'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const DARK_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'
const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const src = mounted && theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO

  return (
    <video
      key={src}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
