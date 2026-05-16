'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

type Props = {
  pending: number
  inReview: number
  resolved: number
}

const data = (p: Props) => [
  { name: 'Pending',   value: p.pending,  fill: 'oklch(0.748 0.172 66)' },
  { name: 'In Review', value: p.inReview, fill: 'oklch(0.355 0.177 264)' },
  { name: 'Resolved',  value: p.resolved, fill: 'oklch(0.685 0.171 162)' },
]

export function ComplaintsChart({ pending, inReview, resolved }: Props) {
  const chartData = data({ pending, inReview, resolved })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barSize={48} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0 0)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'oklch(0.97 0 0)' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.9 0 0)', fontSize: 12 }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
