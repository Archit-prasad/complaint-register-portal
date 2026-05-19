'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const DARK_VIDEO  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'
const LIGHT_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-by-a-bright-blue-sky-41662-large.mp4'

export function VideoBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before mount theme is undefined — fall back to dark (matches defaultTheme).
  // After mount use the resolved theme from ThemeProvider / localStorage.
  const videoSrc = mounted && theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO

  return (
    // bg-slate-950 is always painted by CSS with zero network cost.
    // It stays visible while the video element is mounting or buffering,
    // so the canvas is never white even during a key-forced remount.
    <div className="fixed inset-0 z-0 bg-slate-950">
      {/* key={theme} tells React to destroy and rebuild the <video> element
          whenever the theme value changes. This is more reliable than
          imperatively updating video.src because the browser's HTML5 video
          engine gets a completely fresh element and media pipeline each time,
          eliminating any frozen/blank state from mid-stream source swaps. */}
      <video
        key={theme}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  )
}
