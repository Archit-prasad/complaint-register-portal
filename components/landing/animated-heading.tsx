'use client'

import { useEffect, useState } from 'react'

const HEADING = 'Responsibility of change\nlies in your hands.'

export function AnimatedHeading() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const chars = HEADING.split('')

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
      {chars.map((char, i) => (
        char === '\n' ? (
          <br key={i} />
        ) : (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 500ms ease, transform 500ms ease`,
              transitionDelay: `${i * 30}ms`,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        )
      ))}
    </h1>
  )
}
