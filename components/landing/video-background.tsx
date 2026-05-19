'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'
const DARK_VIDEO  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before mount, default to dark so the initial render matches
  // the server output and avoids a hydration flash.
  const isDark = !mounted || theme !== 'light'

  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      {/* ── Video 1: Daytime clouds (Light Mode) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src={LIGHT_VIDEO}
        className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          !isDark ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Video 2: Cinematic evening (Dark Mode) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src={DARK_VIDEO}
        className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          isDark ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  )
}
