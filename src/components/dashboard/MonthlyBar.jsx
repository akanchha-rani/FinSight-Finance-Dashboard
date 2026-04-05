import { useMemo } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtCurrency } from '../../utils/helpers.js'

function ChartTooltip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: dark ? '#111827' : '#fff', border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`, borderRadius: 12, padding: '10px 14px', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
      <p style={{ fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', marginBottom: 8 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: dark ? '#9ca3af' : '#6b7280' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a' }}>{fmtCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBar({ txns, dark }) {
  const data = useMemo(() => {
    const months = {}
    txns.forEach(t => {
      const d = new Date(t.date)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[k]) months[k] = { income: 0, expenses: 0, label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }) }
      if (t.type === 'income') months[k].income += t.amount
      else months[k].expenses += t.amount
    })
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([, v]) => ({ month: v.label, Income: Math.round(v.income), Expenses: Math.round(v.expenses) }))
  }, [txns])

  const gc = dark ? '#1f2937' : '#f1f5f9'
  const tc = dark ? '#4b5563' : '#94a3b8'

  return (
    <div className="chart-box" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
      <div className="chart-header">
        <div>
          <p className="chart-title">Monthly Comparison</p>
          <p className="chart-sub">Income vs expenses</p>
        </div>
        <div className="chart-legend">
          {[{ c: '#6366f1', n: 'Income' }, { c: '#ef4444', n: 'Expenses' }].map(({ c, n }) => (
            <div key={n} className="legend-item">
              <span style={{ width: 12, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{n}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={185}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid stroke={gc} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: tc }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
          <Tooltip content={<ChartTooltip dark={dark} />} cursor={{ fill: dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)', radius: 8 }} />
          <Bar dataKey="Income" radius={[6, 6, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => <Cell key={i} fill={i === data.length - 1 ? '#6366f1' : '#c7d2fe'} />)}
          </Bar>
          <Bar dataKey="Expenses" radius={[6, 6, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => <Cell key={i} fill={i === data.length - 1 ? '#ef4444' : '#fecaca'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
