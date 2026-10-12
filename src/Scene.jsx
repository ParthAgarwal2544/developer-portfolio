import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createPaintMaterial } from './PaintMaterial.js'
import { buildTextures, endWallTexture } from './textures.js'
import { FRAMES, HALL, MIN_Z, ROOMS, START_Z, rig } from './world.js'
import { profile, projects } from './content.js'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const LEN = HALL.zStart - HALL.zEnd
const MID_Z = (HALL.zStart + HALL.zEnd) / 2
const HEIGHT = HALL.ceilY - HALL.floorY
const MID_Y = (HALL.ceilY + HALL.floorY) / 2
const HALF_W = HALL.width / 2

/* ───────────── Camera: walking + look-around ───────────── */

export function CameraRig() {
  const { camera, gl, pointer } = useThree()
  const look = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const walk = (dz) => {
      if (!rig.enabled) return
      rig.targetZ = clamp(rig.targetZ + dz, MIN_Z, START_Z)
    }
    // forward = decreasing z, so scrolling down (deltaY > 0) subtracts
    const onWheel = (e) => walk(-e.deltaY * 0.012)
    let touchY = null
    const onTouchStart = (e) => (touchY = e.touches[0].clientY)
    const onTouchMove = (e) => {
      if (touchY == null) return
      const y = e.touches[0].clientY
      walk(-(touchY - y) * 0.045)
      touchY = y
    }
    const onKey = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) walk(-1.6)
      if (['ArrowDown', 's', 'S'].includes(e.key)) walk(1.6)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 5)
    if (!rig.locked) {
      // note: z decreases as we walk forward, so scroll-down => targetZ lower
      rig.z += (rig.targetZ - rig.z) * k
    }
    const moving = clamp(Math.abs(rig.targetZ - rig.z) * 1.5, 0, 1)
    look.current.x += (pointer.x - look.current.x) * k
    look.current.y += (pointer.y - look.current.y) * k
    const amt = rig.locked ? 0.25 : 1
    camera.position.set(rig.x, 0.05 + Math.sin(rig.z * 2.4) * 0.03 * moving, rig.z)
    camera.rotation.set(look.current.y * 0.05 * amt, rig.yaw - look.current.x * 0.1 * amt, 0, 'YXZ')
  })

  useEffect(() => {
    gl.setClearColor('#efe8d9')
  }, [gl])

  return null
}

/* ───────────── Paper surfaces ───────────── */

function Surface({ map, position, rotation, size, repeat }) {
  const mat = useMemo(() => createPaintMaterial({ map, repeat }), [map, repeat])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* A painted plane: pencil art + color wash driven by `target` (0..1). */
function Painted({ map, color, size, position, rotation, getTarget, onClick, onHover }) {
  const mat = useMemo(() => createPaintMaterial({ map, color }), [map, color])
  useFrame((_, dt) => {
    const t = getTarget()
    const u = mat.uniforms.uReveal
    u.value += (t - u.value) * (1 - Math.exp(-dt * 4))
  })
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.(true)
      }}
      onPointerOut={() => onHover?.(false)}
    >
      <planeGeometry args={size} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

const sideRot = (side) => [0, side === 'L' ? Math.PI / 2 : -Math.PI / 2, 0]
const sideX = (side, inset = 0.02) => (side === 'L' ? -HALF_W + inset : HALF_W - inset)

function Door({ room, map, onEnter }) {
  const hovered = useRef(false)
  const doorH = 2.7
  return (
    <Painted
      map={map}
      color={room.color}
      size={[1.45, doorH]}
      position={[sideX(room.side), HALL.floorY + doorH / 2, room.z]}
      rotation={sideRot(room.side)}
      getTarget={() => {
        const near = 1 - clamp((Math.abs(rig.z - room.z) - 1.5) / 5, 0, 1)
        return hovered.current ? 1 : near * 0.55
      }}
      onClick={() => onEnter(room)}
      onHover={(v) => {
        hovered.current = v
        document.body.style.cursor = v ? 'pointer' : ''
      }}
    />
  )
}

function Frame({ frame, map }) {
  return (
    <Painted
      map={map}
      color={frame.color}
      size={[1.6, 1.33]}
      position={[sideX(frame.side), 0.25, frame.z]}
      rotation={sideRot(frame.side)}
      getTarget={() => 1 - clamp((Math.abs(rig.z - frame.z) - 1.5) / 6, 0, 1)}
    />
  )
}

function EndWall({ map }) {
  const [hoveredLink, setHoveredLink] = useState(null)

  const handlePointer = (link, isHover) => {
    setHoveredLink(isHover ? link : null)
    document.body.style.cursor = isHover ? 'pointer' : ''
  }

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const githubUrl = profile.socials.find((s) => s.label === 'GitHub')?.url || 'https://github.com/ParthAgarwal2544'
  const linkedinUrl = profile.socials.find((s) => s.label === 'LinkedIn')?.url || 'https://www.linkedin.com/in/parth-rohit-agarwal'

  const handleWallClick = (e) => {
    e.stopPropagation()
    if (!e.uv) return
    const canvasYFrac = 1 - e.uv.y
    if (canvasYFrac >= 0.51 && canvasYFrac <= 0.65) {
      openLink(linkedinUrl)
    } else if (canvasYFrac >= 0.40 && canvasYFrac < 0.51) {
      openLink(githubUrl)
    }
  }

  return (
    <group position={[0, MID_Y, HALL.zEnd]}>
      {/* Base wall surface */}
      <Surface
        map={map}
        size={[HALL.width, HEIGHT]}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        repeat={[1, 1]}
      />

      {/* GitHub interactive button */}
      <mesh
        position={[0, 0.08, 0.02]}
        onClick={(e) => {
          e.stopPropagation()
          openLink(githubUrl)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          handlePointer('github', true)
        }}
        onPointerOut={() => handlePointer('github', false)}
      >
        <planeGeometry args={[3.2, 0.36]} />
        <meshBasicMaterial
          transparent
          opacity={hoveredLink === 'github' ? 0.08 : 0}
          color="#26201c"
        />
      </mesh>

      {/* LinkedIn interactive button */}
      <mesh
        position={[0, -0.24, 0.02]}
        onClick={(e) => {
          e.stopPropagation()
          openLink(linkedinUrl)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          handlePointer('linkedin', true)
        }}
        onPointerOut={() => handlePointer('linkedin', false)}
      >
        <planeGeometry args={[3.6, 0.38]} />
        <meshBasicMaterial
          transparent
          opacity={hoveredLink === 'linkedin' ? 0.12 : 0}
          color="#5b8fd1"
        />
      </mesh>
    </group>
  )
}

export function Hall({ onEnter }) {
  const tex = useMemo(() => buildTextures(projects, ROOMS), [])
  const frameTex = useMemo(() => FRAMES.map((f) => tex.frame(f.i)), [tex])
  const endTex = useMemo(() => endWallTexture(profile.name), [])

  // texture repeat counts so each tile is ~6 units long
  const wallRepeat = [LEN / 6, 1]
  const floorRepeat = [1, LEN / 6]

  return (
    <group>
      <Surface map={tex.wall} size={[LEN, HEIGHT]} position={[-HALF_W, MID_Y, MID_Z]} rotation={[0, Math.PI / 2, 0]} repeat={wallRepeat} />
      <Surface map={tex.wall} size={[LEN, HEIGHT]} position={[HALF_W, MID_Y, MID_Z]} rotation={[0, -Math.PI / 2, 0]} repeat={wallRepeat} />
      <Surface map={tex.floor} size={[HALL.width, LEN]} position={[0, HALL.floorY, MID_Z]} rotation={[-Math.PI / 2, 0, 0]} repeat={floorRepeat} />
      <Surface map={tex.ceiling} size={[HALL.width, LEN]} position={[0, HALL.ceilY, MID_Z]} rotation={[Math.PI / 2, 0, 0]} repeat={floorRepeat} />
      <EndWall map={endTex} />
      {ROOMS.map((room) => (
        <Door key={room.id} room={room} map={tex.doors[room.id]} onEnter={onEnter} />
      ))}
      {FRAMES.map((f, idx) => (
        <Frame key={idx} frame={f} map={frameTex[idx]} />
      ))}
    </group>
  )
}
