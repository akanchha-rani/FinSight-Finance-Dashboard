import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtCurrency } from '../../utils/helpers.js'
import { CATEGORY_COLORS } from '../../data/mockData.js'

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }

export default function DonutChart({ txns, dark }) {
  const data = useMemo(() => {
    const NOW = new Date('2026-04-03')
    const cutoff = addDays(NOW, -30)
    const exp = txns.filter(t => t.type === 'expense' && new Date(t.date) >= cutoff)
    const total = exp.reduce((s, t) => s + t.amount, 0)
    const by = {}
    exp.forEach(t => { by[t.category] = (by[t.category] || 0) + t.amount })
    return Object.entries(by)
      .map(([k, v]) => ({ category: k, amount: Math.round(v), percentage: total > 0 ? Math.round(v / total * 100) : 0, color: CATEGORY_COLORS[k] || '#6b7280' }))
      .sort((a, b) => b.amount - a.amount).slice(0, 6)
  }, [txns])

  const TooltipEl = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{ background: dark ? '#111827' : '#fff', border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`, borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
        <p style={{ fontWeight: 600, marginBottom: 3 }}>{d.category}</p>
        <p style={{ color: 'var(--text3)' }}>{fmtCurrency(d.amount)} · {d.percentage}%</p>
      </div>
    )
  }

  return (
    <div className="chart-box" style={{ animationDelay: '120ms', animationFillMode: 'both' }}>
      <div className="chart-header">
        <div>
          <p className="chart-title">Spending Breakdown</p>
          <p className="chart-sub">By category · 30 days</p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-title">No expense data</p>
        </div>
      ) : (
        <div className="donut-wrap">
          <div style={{ width: 120, height: 120, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="amount">
                  {data.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip content={<TooltipEl />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="donut-legend">
            {data.map(d => (
              <div key={d.category} className="donut-legend-row">
                <span className="donut-dot" style={{ background: d.color }} />
                <span className="donut-cat-name">{d.category}</span>
                <span className="donut-pct">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
