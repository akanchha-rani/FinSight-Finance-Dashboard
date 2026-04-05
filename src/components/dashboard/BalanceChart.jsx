import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { fmtCurrency } from '../../utils/helpers.js'

function ChartTooltip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: dark ? '#111827' : '#fff', border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`, borderRadius: 12, padding: '10px 14px', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
      <p style={{ fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', marginBottom: 8 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: dark ? '#9ca3af' : '#6b7280', textTransform: 'capitalize' }}>{(p.name || p.dataKey)}:</span>
          <span style={{ fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a' }}>{fmtCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceChart({ txns, dark }) {
  const data = useMemo(() => {
    const months = {}
    txns.forEach(t => {
      const d = new Date(t.date)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[k]) months[k] = { income: 0, expenses: 0, label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }) }
      if (t.type === 'income') months[k].income += t.amount
      else months[k].expenses += t.amount
    })
    let running = 0
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([, v]) => {
      running += v.income - v.expenses
      return { month: v.label, Income: Math.round(v.income), Expenses: Math.round(v.expenses), Balance: Math.round(running) }
    })
  }, [txns])

  const gc = dark ? '#1f2937' : '#f1f5f9'
  const tc = dark ? '#4b5563' : '#94a3b8'

  return (
    <div className="chart-box" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
      <div className="chart-header">
        <div>
          <p className="chart-title">Balance Trend</p>
          <p className="chart-sub">Last 6 months</p>
        </div>
        <div className="chart-legend">
          {[{ c: '#6366f1', n: 'Balance' }, { c: '#10b981', n: 'Income' }, { c: '#ef4444', n: 'Expenses' }].map(({ c, n }) => (
            <div key={n} className="legend-item">
              <span className="legend-dot" style={{ background: c }} />{n}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gb" x1={0} y1={0} x2={0} y2={1}>
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gi" x1={0} y1={0} x2={0} y2={1}>
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ge" x1={0} y1={0} x2={0} y2={1}>
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.07} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gc} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: tc }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
          <Tooltip content={<ChartTooltip dark={dark} />} />
          <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#gb)" dot={false} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fill="url(#gi)" dot={false} strokeDasharray="6 3" activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#ge)" dot={false} strokeDasharray="4 4" activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
