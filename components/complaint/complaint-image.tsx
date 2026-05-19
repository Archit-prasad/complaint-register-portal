'use client'

import { useState } from 'react'
import { Car, Droplets, Trash2, Zap, Trees, FileWarning } from 'lucide-react'

const CATEGORY_MAP: Array<{ keywords: string[]; Icon: React.ElementType; gradient: string; color: string }> = [
  {
    keywords: ['pothole', 'road', 'street', 'pavement', 'traffic', 'footpath'],
    Icon: Car,
    gradient: 'from-slate-400/30 to-slate-600/30',
    color: 'text-slate-500',
  },
  {
    keywords: ['water', 'pipe', 'drain', 'flood', 'sewage', 'leak'],
    Icon: Droplets,
    gradient: 'from-blue-400/30 to-cyan-600/30',
    color: 'text-blue-500',
  },
  {
    keywords: ['garbage', 'waste', 'trash', 'litter', 'dump', 'rubbish'],
    Icon: Trash2,
    gradient: 'from-orange-400/30 to-amber-600/30',
    color: 'text-orange-500',
  },
  {
    keywords: ['light', 'electricity', 'power', 'wire', 'electric', 'streetlight'],
    Icon: Zap,
    gradient: 'from-yellow-400/30 to-amber-500/30',
    color: 'text-yellow-500',
  },
  {
    keywords: ['tree', 'park', 'garden', 'green', 'plant', 'branch'],
    Icon: Trees,
    gradient: 'from-emerald-400/30 to-green-600/30',
    color: 'text-emerald-500',
  },
]

function inferCategory(title: string) {
  const lower = title.toLowerCase()
  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some((kw) => lower.includes(kw))) return cat
  }
  return {
    Icon: FileWarning,
    gradient: 'from-primary/20 to-primary/10',
    color: 'text-primary',
  }
}

export function ComplaintImage({ src, alt, title }: { src: string | null; alt: string; title: string }) {
  const [failed, setFailed] = useState(false)

  const { Icon, gradient, color } = inferCategory(title)

  if (!src || failed) {
    return (
      <div className={`aspect-video flex flex-col items-center justify-center bg-gradient-to-br ${gradient} rounded-t-2xl`}>
        <Icon className={`h-12 w-12 ${color} opacity-60`} strokeWidth={1.5} />
        <span className="mt-2 text-xs text-muted-foreground font-medium opacity-70">
          No image attached
        </span>
      </div>
    )
  }

  return (
    <div className="aspect-video overflow-hidden rounded-t-2xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  )
}
