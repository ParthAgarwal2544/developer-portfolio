import gsap from 'gsap'

// Corridor dimensions (world units)
export const HALL = { width: 6, floorY: -1.6, ceilY: 1.8, zStart: 4, zEnd: -46 }
export const START_Z = 2
export const MIN_Z = -42

export const ROOMS = [
  { id: 'work', label: 'Work', side: 'L', z: -8, color: '#e8715a' },
  { id: 'skills', label: 'Skills', side: 'R', z: -16, color: '#5b8fd1' },
  { id: 'about', label: 'About', side: 'L', z: -24, color: '#4f9d8f' },
  { id: 'contact', label: 'Contact', side: 'R', z: -32, color: '#e6b73e' },
]

// Framed sketches along the walls (index = which project to show)
export const FRAMES = [
  { side: 'R', z: -4, i: 0, color: '#e8715a' },
  { side: 'L', z: -11, i: 1, color: '#5b8fd1' },
  { side: 'R', z: -13, i: 2, color: '#4f9d8f' },
  { side: 'L', z: -19, i: 3, color: '#e6b73e' },
  { side: 'R', z: -22, i: 4, color: '#9b6bc9' },
  { side: 'L', z: -27, i: 5, color: '#e8715a' },
  { side: 'R', z: -30, i: 6, color: '#5b8fd1' },
  { side: 'L', z: -35, i: 7, color: '#4f9d8f' },
]


// Mutable camera state shared between the 3D scene and the DOM UI.
export const rig = {
  z: START_Z,
  targetZ: START_Z,
  x: 0,
  yaw: 0,
  enabled: false, // walking input allowed
  locked: false, // camera driven by tweens
}

export function walkTo(room, onArrive) {
  rig.enabled = false
  rig.locked = true
  gsap.killTweensOf(rig)
  const dir = room.side === 'L' ? 1 : -1 // +yaw turns left
  const dist = Math.abs(rig.z - room.z)
  const tl = gsap.timeline({ onComplete: onArrive })
  tl.to(rig, { z: room.z, duration: Math.min(2.2, 0.6 + dist * 0.08), ease: 'power2.inOut' })
  tl.to(rig, { yaw: dir * (Math.PI / 2), x: dir * -1.5, duration: 0.9, ease: 'power2.inOut' })
  tl.to(rig, { x: dir * -2.3, duration: 0.6, ease: 'power2.in' }, '>-0.15')
}

export function walkBack(onDone) {
  gsap.killTweensOf(rig)
  gsap.to(rig, {
    yaw: 0,
    x: 0,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => {
      rig.targetZ = rig.z
      rig.locked = false
      rig.enabled = true
      onDone?.()
    },
  })
}
