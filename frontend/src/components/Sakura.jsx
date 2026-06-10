import { useEffect, useState } from 'react'
import { SAKURA_COLORS } from '../data/constants'

export default function Sakura() {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    const count = 22
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 12 + 8,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * -15,
      color: SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
      opacity: Math.random() * 0.4 + 0.3,
      sway: Math.random() > 0.5,
    }))
    setPetals(generated)
  }, [])

  return (
    <div className="sakura-container">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            [p.sway ? 'animation' : 'animation']: `sakura-fall ${p.duration}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}
