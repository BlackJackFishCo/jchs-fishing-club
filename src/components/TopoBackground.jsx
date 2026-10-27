import { useEffect, useRef } from 'react'
import './TopoBackground.css'

const GRID_STEP = 7
const NOISE_SCALE = 0.004
const LEVEL_COUNT = 22
const MAX_DPR = 2
const FRAME_INTERVAL = 1000 / 15
const LINE_COLOR = 'rgba(234, 250, 255, 0.22)'
const INDEX_LINE_COLOR = 'rgba(234, 250, 255, 0.45)'

// Seeded PRNG (mulberry32) so each lattice is reproducible from a seed,
// while the seed itself is randomized once per page load.
function mulberry32(seed) {
  let s = seed >>> 0
  return function random() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A 256-entry permutation + value table for 2D lattice (value) noise.
function createLattice(seed) {
  const rand = mulberry32(seed)
  const size = 256
  const mask = size - 1
  const perm = new Uint8Array(size)
  for (let i = 0; i < size; i++) perm[i] = i
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = perm[i]
    perm[i] = perm[j]
    perm[j] = tmp
  }
  const values = new Float32Array(size)
  for (let i = 0; i < size; i++) values[i] = rand()
  return { perm, values, mask }
}

function latticeValue(lat, ix, iy) {
  const { perm, values, mask } = lat
  return values[perm[(ix + perm[iy & mask]) & mask]]
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

// Smooth 2D value noise (0..1) via bilinear interpolation of the lattice,
// eased with a quintic fade curve so it has no visible grid artifacts.
function valueNoise2D(lat, x, y) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const xf = x - x0
  const yf = y - y0
  const v00 = latticeValue(lat, x0, y0)
  const v10 = latticeValue(lat, x0 + 1, y0)
  const v01 = latticeValue(lat, x0, y0 + 1)
  const v11 = latticeValue(lat, x0 + 1, y0 + 1)
  const u = fade(xf)
  const v = fade(yf)
  const nx0 = v00 + u * (v10 - v00)
  const nx1 = v01 + u * (v11 - v01)
  return nx0 + v * (nx1 - nx0)
}

// Fractal sum of 3 octaves of value noise ("fractal value noise").
function fractalNoise(lat, x, y) {
  let total = 0
  let amp = 1
  let freq = 1
  let maxAmp = 0
  for (let o = 0; o < 3; o++) {
    total += valueNoise2D(lat, x * freq, y * freq) * amp
    maxAmp += amp
    amp *= 0.5
    freq *= 2
  }
  return total / maxAmp
}

function lerpT(threshold, a, b) {
  const d = b - a
  return d === 0 ? 0.5 : (threshold - a) / d
}

// Traces every contour line for one threshold level across the whole grid,
// via marching squares, appending segments into the current canvas path.
function traceLevel(ctx, field, cols, rows, threshold) {
  for (let j = 0; j < rows - 1; j++) {
    const rowOff = j * cols
    const rowOffNext = rowOff + cols
    const y0 = j * GRID_STEP
    const y1 = y0 + GRID_STEP

    for (let i = 0; i < cols - 1; i++) {
      const tl = field[rowOff + i]
      const tr = field[rowOff + i + 1]
      const br = field[rowOffNext + i + 1]
      const bl = field[rowOffNext + i]

      let c = 0
      if (tl >= threshold) c |= 8
      if (tr >= threshold) c |= 4
      if (br >= threshold) c |= 2
      if (bl >= threshold) c |= 1
      if (c === 0 || c === 15) continue

      const x0 = i * GRID_STEP
      const x1 = x0 + GRID_STEP

      switch (c) {
        case 1:
        case 14: {
          const ly = y0 + lerpT(threshold, tl, bl) * GRID_STEP
          const bx = x0 + lerpT(threshold, bl, br) * GRID_STEP
          ctx.moveTo(x0, ly)
          ctx.lineTo(bx, y1)
          break
        }
        case 2:
        case 13: {
          const bx = x0 + lerpT(threshold, bl, br) * GRID_STEP
          const ry = y0 + lerpT(threshold, tr, br) * GRID_STEP
          ctx.moveTo(bx, y1)
          ctx.lineTo(x1, ry)
          break
        }
        case 3:
        case 12: {
          const ly = y0 + lerpT(threshold, tl, bl) * GRID_STEP
          const ry = y0 + lerpT(threshold, tr, br) * GRID_STEP
          ctx.moveTo(x0, ly)
          ctx.lineTo(x1, ry)
          break
        }
        case 4:
        case 11: {
          const tx = x0 + lerpT(threshold, tl, tr) * GRID_STEP
          const ry = y0 + lerpT(threshold, tr, br) * GRID_STEP
          ctx.moveTo(tx, y0)
          ctx.lineTo(x1, ry)
          break
        }
        case 6:
        case 9: {
          const tx = x0 + lerpT(threshold, tl, tr) * GRID_STEP
          const bx = x0 + lerpT(threshold, bl, br) * GRID_STEP
          ctx.moveTo(tx, y0)
          ctx.lineTo(bx, y1)
          break
        }
        case 7:
        case 8: {
          const tx = x0 + lerpT(threshold, tl, tr) * GRID_STEP
          const ly = y0 + lerpT(threshold, tl, bl) * GRID_STEP
          ctx.moveTo(tx, y0)
          ctx.lineTo(x0, ly)
          break
        }
        case 5: {
          const tx = x0 + lerpT(threshold, tl, tr) * GRID_STEP
          const ry = y0 + lerpT(threshold, tr, br) * GRID_STEP
          const bx = x0 + lerpT(threshold, bl, br) * GRID_STEP
          const ly = y0 + lerpT(threshold, tl, bl) * GRID_STEP
          ctx.moveTo(tx, y0)
          ctx.lineTo(x1, ry)
          ctx.moveTo(x0, ly)
          ctx.lineTo(bx, y1)
          break
        }
        case 10: {
          const tx = x0 + lerpT(threshold, tl, tr) * GRID_STEP
          const ly = y0 + lerpT(threshold, tl, bl) * GRID_STEP
          const bx = x0 + lerpT(threshold, bl, br) * GRID_STEP
          const ry = y0 + lerpT(threshold, tr, br) * GRID_STEP
          ctx.moveTo(tx, y0)
          ctx.lineTo(x0, ly)
          ctx.moveTo(bx, y1)
          ctx.lineTo(x1, ry)
          break
        }
        default:
          break
      }
    }
  }
}

function TopoBackground() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const ctx = canvas.getContext('2d')
    const reduceMotion = Boolean(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )

    // Fresh random pattern every page load.
    const seed = Math.floor(Math.random() * 1e9)
    const latA = createLattice(seed)
    const latB = createLattice(seed + 7919)

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let field = new Float32Array(0)
    let rafId = null
    let resizeTimer = null
    let lastDrawTime = 0
    const startTime = performance.now()

    function resize() {
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / GRID_STEP) + 1
      rows = Math.ceil(height / GRID_STEP) + 1
      field = new Float32Array(cols * rows)
    }

    function computeField(elapsedSeconds) {
      // Two noise layers drifting in different directions, blended — a
      // slow, calm "water shifting" motion rather than a scroll.
      const ax = elapsedSeconds * 0.0026
      const ay = elapsedSeconds * 0.0013
      const bx = -elapsedSeconds * 0.0017
      const by = elapsedSeconds * 0.0021

      for (let j = 0; j < rows; j++) {
        const y = j * GRID_STEP
        const rowOff = j * cols
        for (let i = 0; i < cols; i++) {
          const x = i * GRID_STEP
          const a = fractalNoise(latA, x * NOISE_SCALE + ax, y * NOISE_SCALE + ay)
          const b = fractalNoise(latB, x * NOISE_SCALE + bx, y * NOISE_SCALE + by)
          field[rowOff + i] = (a + b) / 2
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let levelIdx = 0; levelIdx < LEVEL_COUNT; levelIdx++) {
        const threshold = (levelIdx + 1) / (LEVEL_COUNT + 1)
        const isIndexLine = levelIdx % 5 === 0
        ctx.beginPath()
        traceLevel(ctx, field, cols, rows, threshold)
        ctx.strokeStyle = isIndexLine ? INDEX_LINE_COLOR : LINE_COLOR
        ctx.lineWidth = isIndexLine ? 1.8 : 1
        ctx.stroke()
      }
    }

    function frame(now) {
      if (now - lastDrawTime >= FRAME_INTERVAL) {
        lastDrawTime = now
        computeField((now - startTime) / 1000)
        draw()
      }
      rafId = requestAnimationFrame(frame)
    }

    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reduceMotion) {
          computeField(0)
          draw()
        }
      }, 150)
    }

    resize()
    computeField(0)
    draw()

    if (!reduceMotion) {
      rafId = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="topo-bg" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="topo-bg__canvas" />
    </div>
  )
}

export default TopoBackground
