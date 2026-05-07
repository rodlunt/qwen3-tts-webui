import { useEffect, useRef } from 'react'
import { useSettings } from '../context/settings'

interface Particle { x: number; y: number; vx: number; vy: number }

const N = 70
const MAX_DIST = 160
const SPEED = 0.35

export function NetworkBackground() {
  const { animated, effectiveTheme } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: N }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
      }))
    }

    // node/line colour per theme
    const rgb = effectiveTheme === 'light' ? '8,145,178' : '14,219,207'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ps = particlesRef.current

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x
          const dy = ps[i].y - ps[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.28
            ctx.strokeStyle = `rgba(${rgb},${a})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(ps[i].x, ps[i].y)
            ctx.lineTo(ps[j].x, ps[j].y)
            ctx.stroke()
          }
        }
      }

      ps.forEach(p => {
        ctx.fillStyle = `rgba(${rgb},0.55)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      })

      if (animated) {
        ps.forEach(p => {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        })
        frameRef.current = requestAnimationFrame(draw)
      }
    }

    cancelAnimationFrame(frameRef.current)
    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [animated, effectiveTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
