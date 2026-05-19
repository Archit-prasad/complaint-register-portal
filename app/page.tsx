import Link from 'next/link'
import { VideoBackground } from '@/components/landing/video-background'
import { AnimatedHeading } from '@/components/landing/animated-heading'
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { FadeIn } from '@/components/landing/fade-in'
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  Bell,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* ── Full-screen video background (NO overlays) ── */}
      <VideoBackground />

      {/* ── Navbar ── */}
      <LandingNavbar />

      {/* ── Hero — pinned to bottom of viewport ── */}
      <main className="relative z-10 flex-1 flex items-end pb-16 px-6 md:px-12 lg:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

          {/* Left Column */}
          <div className="space-y-6">
            <AnimatedHeading />

            <FadeIn delay={800}>
              <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                Empowering citizens to connect with local authorities, report civic issues, and drive community change — one complaint at a time.
              </p>
            </FadeIn>

            <FadeIn delay={1100}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                    bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-lg"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="liquid-glass inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                    text-white border border-white/30 hover:bg-white/10 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right Column — Glass Card */}
          <FadeIn delay={1400}>
            <div className="liquid-glass rounded-2xl p-6 border border-white/20 space-y-4 max-w-md ml-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  System Active
                </span>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug">
                Grievance Redressal System
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                A transparent, community-powered platform connecting citizens to civic authorities. File reports, track progress, and hold the system accountable.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon: MapPin, label: 'Location-tagged' },
                  { icon: TrendingUp, label: 'Priority voting' },
                  { icon: ShieldCheck, label: 'Admin verified' },
                  { icon: Bell, label: 'Live updates' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                    <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-xs text-white/50">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Secured by end-to-end session authentication
              </div>
            </div>
          </FadeIn>

        </div>
      </main>
    </div>
  )
}
