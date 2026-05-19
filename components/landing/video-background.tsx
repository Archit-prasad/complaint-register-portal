'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

const DARK_VIDEO  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'
const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Step 1: mark client mount so we know the real theme is available
  useEffect(() => {
    setMounted(true)
  }, [])

  // Step 2: when theme changes (after mount), imperatively swap src + reload.
  // We never re-key or unmount the <video> — the DOM node stays alive the
  // whole time so the browser's hardware compositor has nothing to tear down.
  useEffect(() => {
    if (!mounted) return
    const video = videoRef.current
    if (!video) return

    const next = theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO
    if (video.src === next) return           // nothing to do

    video.src = next
    video.load()                             // tells the browser to fetch immediately
    video.play().catch(() => {})             // autoplay; swallow AbortError on fast toggles
  }, [theme, mounted])

  return (
    // bg-slate-950 is always present — it shows instantly while any video
    // is loading or buffering, preventing the white browser canvas.
    <div className="absolute inset-0 z-0 bg-slate-950">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        // Inline src keeps the first frame correct on SSR and initial paint.
        // The useEffect above takes over as soon as the component mounts.
        src={DARK_VIDEO}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
