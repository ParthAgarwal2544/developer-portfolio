import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { CameraRig, Hall } from './Scene.jsx'
import Room from './Rooms.jsx'
import { ROOMS, rig, walkBack, walkTo } from './world.js'
import { profile } from './content.js'

/* ─── WebGL availability check ─── */
function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

/* ─── Cover page ─── */
function Cover({ onEnter }) {
  const ref = useRef(null)
  const clip = useMemo(() => {
    const pts = ['0% 0%', '100% 0%', '100% 96%']
    for (let i = 20; i >= 0; i--) pts.push(`${(i / 20) * 100}% ${96 + (i % 2 ? 3.2 : 0) + Math.random() * 1.6}%`)
    return `polygon(${pts.join(',')})`
  }, [])

  const open = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { onEnter(); return }
    gsap.to(ref.current, {
      yPercent: -110,
      rotate: -1.5,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: onEnter,
    })
  }

  return (
    <div className="cover" ref={ref} style={{ clipPath: clip }}>
      <p className="eyebrow">{profile.role}</p>
      <h1>{profile.name}</h1>
      <p className="tag">{profile.tagline}</p>
      <button className="btn big" onClick={open} id="cover-enter-btn">
        Step inside
      </button>
      <p className="hint">scroll · swipe · arrow keys to walk the hall</p>
    </div>
  )
}

/* ─── Quick-nav overlay (visible after entering) ─── */
function QuickNav({ enterRoom, room }) {
  return (
    <nav className="quicknav" aria-label="Quick navigation">
      {ROOMS.map((r) => (
        <button
          key={r.id}
          id={`quicknav-${r.id}`}
          className="quicknav-btn"
          onClick={() => enterRoom(r)}
          disabled={!!room}
          style={{ '--room-color': r.color }}
        >
          {r.label}
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [fontsReady, setFontsReady] = useState(false)
  const [webGLOk] = useState(() => isWebGLAvailable())
  const [entered, setEntered] = useState(false)
  const [room, setRoom] = useState(null)
  const [overlayIn, setOverlayIn] = useState(false)

  useEffect(() => {
    const timeout = new Promise((res) => setTimeout(res, 2500))
    Promise.race([document.fonts.load('700 64px Caveat'), timeout]).finally(() => setFontsReady(true))
  }, [])

  const handleEntered = useCallback(() => {
    setEntered(true)
    rig.enabled = true
  }, [])

  const enterRoom = useCallback((r) => {
    if (rig.locked) return
    document.body.style.cursor = ''
    walkTo(r, () => {
      setRoom(r.id)
      requestAnimationFrame(() => setOverlayIn(true))
    })
  }, [])

  const closeRoom = useCallback(() => {
    setOverlayIn(false)
    setTimeout(() => {
      setRoom(null)
      walkBack()
    }, 350)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && room && closeRoom()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [room, closeRoom])

  /* ─── No WebGL fallback ─── */
  if (!webGLOk) {
    return (
      <div className="no-webgl">
        <p className="eyebrow">{profile.role}</p>
        <h1>{profile.name}</h1>
        <p>{profile.tagline}</p>
        <p style={{ marginTop: '1rem', color: 'var(--ink-soft)' }}>
          This portfolio uses WebGL for its 3D environment. Your browser or device doesn't support it.
          You can still reach me via the links below.
        </p>
        <ul className="socials" style={{ marginTop: '1.5rem', padding: 0 }}>
          {profile.socials.map((s) => (
            <li key={s.label} style={{ listStyle: 'none', marginBottom: '0.5rem' }}>
              <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="app">
      {fontsReady && (
        <Canvas flat dpr={[1, 1.5]} camera={{ fov: 60, near: 0.1, far: 80, position: [0, 0.05, 2] }}>
          <Suspense fallback={null}>
            <CameraRig />
            <Hall onEnter={enterRoom} />
          </Suspense>
        </Canvas>
      )}

      <div className="vignette" />

      {/* HUD: brand + room nav */}
      <header className={`hud ${entered ? 'show' : ''}`} role="banner">
        <span className="brand">{profile.name}</span>
        <nav aria-label="Room navigation">
          {ROOMS.map((r) => (
            <button key={r.id} id={`hud-${r.id}`} onClick={() => enterRoom(r)} disabled={!!room}>
              {r.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Quick access nav (below HUD) */}
      {entered && <QuickNav enterRoom={enterRoom} room={room} />}

      {!entered && fontsReady && <Cover onEnter={handleEntered} />}
      {!fontsReady && <div className="loading" role="status" aria-live="polite">sharpening pencils…</div>}

      {room && (
        <div className={`overlay ${overlayIn ? 'in' : ''}`} role="main">
          <Room id={room} onClose={closeRoom} />
        </div>
      )}
    </div>
  )
}

