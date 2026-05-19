'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

const DARK_VIDEO  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'
const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const video = videoRef.current
    if (!video) return

    // Resolve the correct source for the current theme.
    // Dark = cinematic evening asset  |  Light = bright daytime clouds.
    const src = theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO

    // Assign the src imperatively — no JSX attribute so React's reconciler
    // never fights us by resetting the attribute between renders.
    video.src = src
    // Force the browser to pick up the new source immediately.
    video.load()
    // Resume playback; catch AbortError thrown when a rapid second toggle
    // interrupts an in-progress play() promise.
    video.play().catch(() => {})
  }, [theme, mounted])

  return (
    /*
     * bg-slate-950 is the permanent fallback canvas. It paints in one CSS
     * tick — zero network latency — so the screen is never white while a
     * video is fetching, buffering, or switching sources.
     */
    <div className="fixed inset-0 z-0 bg-slate-950">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        /* No src attribute here — the useEffect above owns the src entirely.
           Keeping src out of JSX prevents React from resetting it on re-renders
           and stops the dark video from briefly flashing before light mode loads. */
        className="fixed inset-0 w-full h-full object-cover z-0"
      />
    </div>
  )
}
