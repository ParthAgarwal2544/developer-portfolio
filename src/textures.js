import * as THREE from 'three'

// All art is generated at runtime on <canvas>, so the project needs no image assets.
// To use your own scans/drawings, swap any of these builders for a TextureLoader.

export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const INK = 'rgba(38,32,28,0.82)'
const PENCIL = 'rgba(70,62,56,0.45)'
const FONT = '"Caveat", "Comic Sans MS", cursive'

const mk = (w, h) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function toTexture(c, wrap = false) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function paper(ctx, w, h, r, base = '#f3eee2') {
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 16
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
  for (let i = 0; i < 36; i++) {
    ctx.fillStyle = `rgba(130,105,70,${r() * 0.028})`
    ctx.beginPath()
    ctx.arc(r() * w, r() * h, r() * 160 + 30, 0, 7)
    ctx.fill()
  }
}

function line(ctx, x1, y1, x2, y2, r, o = {}) {
  const { jit = 1.4, passes = 2, color = INK, width = 2.2 } = o
  for (let p = 0; p < passes; p++) {
    ctx.strokeStyle = color
    ctx.lineWidth = width * (0.7 + r() * 0.6)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    const steps = Math.max(4, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 18))
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = x1 + (x2 - x1) * t + (r() - 0.5) * jit * 2
      const y = y1 + (y2 - y1) * t + (r() - 0.5) * jit * 2
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()
  }
}

function poly(ctx, pts, r, o = {}) {
  for (let i = 0; i < pts.length - 1; i++) line(ctx, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r, { passes: 1, ...o })
}

function rect(ctx, x, y, w, h, r, o) {
  line(ctx, x - 3, y, x + w + 3, y, r, o)
  line(ctx, x + w, y - 3, x + w, y + h + 3, r, o)
  line(ctx, x + w + 3, y + h, x - 3, y + h, r, o)
  line(ctx, x, y + h + 3, x, y - 3, r, o)
}

function circle(ctx, cx, cy, rad, r, o = {}) {
  const pts = []
  const n = 36
  const off = r() * 6
  for (let i = 0; i <= n + 2; i++) {
    const a = ((i / n) * Math.PI * 2) + off
    const k = rad * (1 + (r() - 0.5) * 0.04)
    pts.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k])
  }
  poly(ctx, pts, r, { jit: 0.6, ...o })
}

function hatch(ctx, x, y, w, h, r, { gap = 12, alpha = 0.3, angle = 1 } = {}) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  const color = `rgba(60,52,46,${alpha})`
  for (let i = -h; i < w + h; i += gap) {
    const x1 = x + i
    const y1 = y
    const x2 = x + i + h * angle
    const y2 = y + h
    line(ctx, x1, y1, x2, y2, r, { passes: 1, width: 1.2, color, jit: 1 })
  }
  ctx.restore()
}

function text(ctx, str, x, y, size, o = {}) {
  ctx.save()
  ctx.font = `700 ${size}px ${FONT}`
  ctx.fillStyle = o.color || INK
  ctx.textAlign = o.align || 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(x, y)
  ctx.rotate(o.rot || 0)
  ctx.fillText(str, 0, 0)
  ctx.restore()
}

/* ───────────── Hall surfaces ───────────── */

export function wallTexture() {
  const w = 1536
  const h = 864
  const c = mk(w, h)
  const ctx = c.getContext('2d')
  const r = rng(11)
  paper(ctx, w, h, r, '#f1ebdd')
  // faint vertical pencil lines
  for (let x = 90; x < w; x += 180 + r() * 40) line(ctx, x, 0, x + (r() - 0.5) * 10, h, r, { passes: 1, width: 1, color: 'rgba(80,70,60,0.12)', jit: 2 })
  // chair rail
  line(ctx, 0, h * 0.62, w, h * 0.62, r, { width: 2.4, color: PENCIL, jit: 2 })
  line(ctx, 0, h * 0.64, w, h * 0.64, r, { width: 1.4, color: PENCIL, jit: 2 })
  // wainscot hatching below the rail
  hatch(ctx, 0, h * 0.64, w, h * 0.36, r, { gap: 14, alpha: 0.12, angle: 0.5 })
  // baseboard
  line(ctx, 0, h - 40, w, h - 40, r, { width: 3, color: INK, jit: 2 })
  line(ctx, 0, h - 8, w, h - 8, r, { width: 2, color: PENCIL, jit: 2 })
  // little scribbles
  for (let i = 0; i < 5; i++) {
    const sx = 140 + r() * (w - 280)
    const sy = 120 + r() * 300
    const pts = []
    for (let k = 0; k < 8; k++) pts.push([sx + k * 14, sy + Math.sin(k * 1.4) * 10 + r() * 4])
    poly(ctx, pts, r, { color: 'rgba(60,52,46,0.25)', width: 1.4 })
  }
  // top shadow
  const g = ctx.createLinearGradient(0, 0, 0, 160)
  g.addColorStop(0, 'rgba(90,75,55,0.18)')
  g.addColorStop(1, 'rgba(90,75,55,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, 160)
  return toTexture(c, true)
}

export function floorTexture() {
  const s = 1024
  const c = mk(s, s)
  const ctx = c.getContext('2d')
  const r = rng(23)
  paper(ctx, s, s, r, '#ece4d3')
  for (const x of [s / 3, (2 * s) / 3]) line(ctx, x, 0, x, s, r, { width: 2.4, jit: 2.5 })
  for (let p = 0; p < 3; p++) {
    let y = r() * 260
    while (y < s) {
      const x0 = (p * s) / 3
      line(ctx, x0, y, x0 + s / 3, y, r, { passes: 1, width: 1.8, color: PENCIL, jit: 1.5 })
      y += 220 + r() * 260
    }
    hatch(ctx, (p * s) / 3 + 10, 0, s / 3 - 20, s, r, { gap: 22, alpha: 0.06, angle: 0.15 })
  }
  // darken edges where floor meets walls
  for (const [x0, x1] of [[0, 90], [s, s - 90]]) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0)
    g.addColorStop(0, 'rgba(80,65,45,0.28)')
    g.addColorStop(1, 'rgba(80,65,45,0)')
    ctx.fillStyle = g
    ctx.fillRect(Math.min(x0, x1), 0, 90, s)
  }
  return toTexture(c, true)
}

export function ceilingTexture() {
  const s = 1024
  const c = mk(s, s)
  const ctx = c.getContext('2d')
  const r = rng(37)
  paper(ctx, s, s, r, '#f5f0e5')
  for (let y = 170; y < s; y += 340) line(ctx, 0, y, s, y, r, { width: 2, color: PENCIL, jit: 2 })
  hatch(ctx, 0, 0, s, s, r, { gap: 38, alpha: 0.05, angle: 0.3 })
  return toTexture(c, true)
}

export function endWallTexture(name) {
  const w = 1536
  const h = 864
  const c = mk(w, h)
  const ctx = c.getContext('2d')
  const r = rng(5)
  paper(ctx, w, h, r, '#f3eee2')
  text(ctx, "you've reached the end", w / 2, h * 0.22, 120, { rot: -0.02 })
  text(ctx, 'thanks for walking through, find me online:', w / 2, h * 0.36, 46, { color: PENCIL, rot: 0.008 })

  // GitHub button
  rect(ctx, w / 2 - 320, h * 0.435, 640, 62, r, { width: 2, color: PENCIL })
  text(ctx, 'GitHub: github.com/ParthAgarwal2544 ↗', w / 2, h * 0.472, 42, { color: INK })

  // LinkedIn button
  rect(ctx, w / 2 - 360, h * 0.53, 720, 62, r, { width: 2.2, color: 'rgba(91,143,209,0.85)' })
  text(ctx, 'LinkedIn: in/parth-rohit-agarwal ↗', w / 2, h * 0.567, 42, { color: '#2f629c', rot: -0.005 })

  // arrow pointing back
  poly(ctx, [[w / 2 - 200, h * 0.74], [w / 2 + 200, h * 0.74]], r, { width: 4 })
  poly(ctx, [[w / 2 - 200, h * 0.74], [w / 2 - 160, h * 0.74 - 36]], r, { width: 4 })
  poly(ctx, [[w / 2 - 200, h * 0.74], [w / 2 - 160, h * 0.74 + 36]], r, { width: 4 })
  text(ctx, 'scroll back to turn around', w / 2, h * 0.86, 50, { color: PENCIL })
  return toTexture(c)
}

/* ───────────── Doors ───────────── */

export function doorTexture(label, seed = 1) {
  const w = 512
  const h = 1024
  const c = mk(w, h)
  const ctx = c.getContext('2d')
  const r = rng(seed * 101)
  paper(ctx, w, h, r, '#f1eadb')
  // frame
  rect(ctx, 14, 14, w - 28, h - 28, r, { width: 5 })
  rect(ctx, 30, 30, w - 60, h - 60, r, { width: 2.6, color: PENCIL })
  // panels
  const px = 72
  const pw = w - px * 2
  const panels = [
    [px, 210, pw, 250],
    [px, 500, pw, 360],
  ]
  for (const [x, y, pw2, ph] of panels) {
    rect(ctx, x, y, pw2, ph, r, { width: 3 })
    rect(ctx, x + 14, y + 14, pw2 - 28, ph - 28, r, { width: 1.8, color: PENCIL })
    hatch(ctx, x + 14, y + 14, pw2 - 28, ph - 28, r, { gap: 16, alpha: 0.12 })
  }
  // sign
  rect(ctx, 96, 70, w - 192, 100, r, { width: 3.2 })
  text(ctx, label.toLowerCase(), w / 2, 122, 84, { rot: -0.02 })
  // knob + hinge marks
  circle(ctx, w - 100, 590, 20, r, { width: 3 })
  circle(ctx, w - 100, 590, 8, r, { width: 2 })
  for (const y of [180, 540, 900]) line(ctx, 30, y, 56, y, r, { width: 4 })
  // arrow doodle
  poly(ctx, [[w / 2 - 70, 330], [w / 2 + 50, 330]], r, { width: 4 })
  poly(ctx, [[w / 2 + 50, 330], [w / 2 + 14, 300]], r, { width: 4 })
  poly(ctx, [[w / 2 + 50, 330], [w / 2 + 14, 360]], r, { width: 4 })
  text(ctx, 'push', w / 2, 400, 56, { color: PENCIL })
  return toTexture(c)
}

/* ───────────── Framed sketches ───────────── */

function doodle(ctx, kind, x, y, w, h, r) {
  const cx = x + w / 2
  const cy = y + h / 2
  const o = { width: 3.4 }
  switch (kind % 4) {
    case 0: {
      // sun over hills
      circle(ctx, cx + w * 0.22, cy - h * 0.18, h * 0.16, r, o)
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const k1 = h * 0.21
        const k2 = h * 0.29
        const sx = cx + w * 0.22
        const sy = cy - h * 0.18
        line(ctx, sx + Math.cos(a) * k1, sy + Math.sin(a) * k1, sx + Math.cos(a) * k2, sy + Math.sin(a) * k2, r, { passes: 1, width: 3 })
      }
      const hill = (amp, base, off) => {
        const pts = []
        for (let i = 0; i <= 24; i++) pts.push([x + (i / 24) * w, base - Math.sin((i / 24) * Math.PI + off) * amp])
        poly(ctx, pts, r, o)
      }
      hill(h * 0.2, y + h * 0.82, 0)
      hill(h * 0.14, y + h * 0.9, 1.2)
      break
    }
    case 1: {
      // house
      const hx = cx - w * 0.2
      const hy = cy - h * 0.02
      rect(ctx, hx, hy, w * 0.4, h * 0.34, r, o)
      poly(ctx, [[hx - 14, hy], [cx, hy - h * 0.26], [hx + w * 0.4 + 14, hy], [hx - 14, hy]], r, o)
      rect(ctx, cx - 18, hy + h * 0.14, 36, h * 0.2, r, { width: 3 })
      rect(ctx, hx + 18, hy + 22, 40, 40, r, { width: 3 })
      const sm = []
      for (let i = 0; i < 9; i++) sm.push([hx + w * 0.32 + Math.sin(i * 1.3) * 12, hy - h * 0.2 - i * 12])
      poly(ctx, sm, r, { width: 2.4, color: PENCIL })
      line(ctx, x + 20, hy + h * 0.34, x + w - 20, hy + h * 0.34, r, o)
      break
    }
    case 2: {
      // rocket
      const rx = cx
      const top = y + h * 0.14
      const bot = y + h * 0.7
      poly(ctx, [[rx, top], [rx + 50, top + 90], [rx + 50, bot], [rx - 50, bot], [rx - 50, top + 90], [rx, top]], r, o)
      circle(ctx, rx, top + 120, 24, r, { width: 3 })
      poly(ctx, [[rx - 50, bot - 60], [rx - 92, bot + 10], [rx - 50, bot]], r, o)
      poly(ctx, [[rx + 50, bot - 60], [rx + 92, bot + 10], [rx + 50, bot]], r, o)
      poly(ctx, [[rx - 28, bot + 6], [rx, bot + 70], [rx + 28, bot + 6]], r, { width: 3, color: PENCIL })
      for (let i = 0; i < 7; i++) {
        const sx = x + 30 + r() * (w - 60)
        const sy = y + 20 + r() * (h * 0.5)
        line(ctx, sx - 8, sy, sx + 8, sy, r, { passes: 1, width: 2.4 })
        line(ctx, sx, sy - 8, sx, sy + 8, r, { passes: 1, width: 2.4 })
      }
      break
    }
    default: {
      // laptop with code lines
      const lw = w * 0.56
      const lh = h * 0.42
      const lx = cx - lw / 2
      const ly = cy - lh / 2 - 14
      rect(ctx, lx, ly, lw, lh, r, o)
      rect(ctx, lx + 14, ly + 14, lw - 28, lh - 28, r, { width: 2, color: PENCIL })
      for (let i = 0; i < 5; i++) {
        const ind = (i % 3) * 18
        line(ctx, lx + 30 + ind, ly + 36 + i * 24, lx + 30 + ind + 50 + r() * 90, ly + 36 + i * 24, r, { passes: 1, width: 3 })
      }
      poly(ctx, [[lx - 34, ly + lh + 6], [lx + lw + 34, ly + lh + 6], [lx + lw + 12, ly + lh + 36], [lx - 12, ly + lh + 36], [lx - 34, ly + lh + 6]], r, o)
    }
  }
}

export function frameTexture(title, kind, seed = 1) {
  const w = 768
  const h = 640
  const c = mk(w, h)
  const ctx = c.getContext('2d')
  const r = rng(seed * 977 + kind)
  paper(ctx, w, h, r, '#f3eee2')
  rect(ctx, 20, 20, w - 40, h - 40, r, { width: 6 })
  rect(ctx, 44, 44, w - 88, h - 130, r, { width: 3, color: PENCIL })
  hatch(ctx, 48, 48, w - 96, h - 138, r, { gap: 30, alpha: 0.05 })
  doodle(ctx, kind, 70, 70, w - 140, h - 180, r)
  text(ctx, title.toLowerCase(), w / 2, h - 56, 64, { rot: -0.015 })
  return toTexture(c)
}

export function buildTextures(projects, rooms) {
  return {
    wall: wallTexture(),
    floor: floorTexture(),
    ceiling: ceilingTexture(),
    doors: Object.fromEntries(rooms.map((rm, i) => [rm.id, doorTexture(rm.label, i + 1)])),
    frame: (i) => frameTexture(projects[i % projects.length].title, i, i + 1),
  }
}
