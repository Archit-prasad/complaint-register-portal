'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'
const DARK_VIDEO  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const dayVideoRef     = useRef<HTMLVideoElement>(null)
  const eveningVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => setMounted(true), [])

  // Whenever the resolved theme changes, explicitly kick both players.
  // Browsers suspend hidden media elements to save memory/power; calling
  // .play() on the newly-visible one un-freezes it instantly.
  useEffect(() => {
    if (!mounted) return

    const day     = dayVideoRef.current
    const evening = eveningVideoRef.current

    if (theme === 'light') {
      day?.play().catch(() => {})
      // Pause the hidden stream to reclaim decoder resources, but keep
      // the element in the DOM so it resumes from where it left off.
      evening?.pause()
    } else {
      evening?.play().catch(() => {})
      day?.pause()
    }
  }, [theme, mounted])

  // Default to dark before mount — matches defaultTheme and server HTML.
  const isDark = !mounted || theme !== 'light'

  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      {/* ── Video 1: Daytime clouds (Light Mode) ── */}
      <video
        ref={dayVideoRef}
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
        ref={eveningVideoRef}
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
