import { useEffect } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { IconRefresh } from '../ui/Icons.jsx'
import { fmtCurrency } from '../../utils/helpers.js'

const TYPE_COLORS = { warning: 'var(--amber-light)', success: 'var(--green-light)', info: 'var(--primary-light)', danger: 'var(--red-light)' }
const TYPE_BORDER = { warning: 'var(--amber)',       success: 'var(--green)',       info: 'var(--primary)',       danger: 'var(--red)'   }
const TYPE_LABELS = { warning: ' Watch',            success: '✓ Good',            info: 'ℹ Tip',               danger: ' Alert'     }

export default function InsightsTab({ insights, insightsLoading, fetchInsights, monthlyData, dark, serverHasKey }) {
  const gc    = dark ? '#1f2937' : '#f1f5f9'
  const tc    = dark ? '#4b5563' : '#94a3b8'
  const ready = serverHasKey !== false

  useEffect(() => {
    if (!insights && !insightsLoading && ready) fetchInsights()
  }, [serverHasKey])

  return (
    <div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>AI-Powered Insights</p>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Analyzes your last 30 days of spending</p>
        </div>
        <button className="btn" onClick={fetchInsights} disabled={insightsLoading || !ready} style={{ fontSize: 12 }}>
          <IconRefresh spinning={insightsLoading} />
          {insightsLoading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      
      {insightsLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[85, 70, 90, 65, 75].map((_, i) => (
            <div key={i} style={{ height: 70, borderRadius: 14, background: dark ? '#1f2937' : '#f1f5f9', animation: 'pulse 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      
      {!insightsLoading && insights && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{
              background: TYPE_COLORS[ins.type] || 'var(--primary-light)',
              border: `1px solid ${TYPE_BORDER[ins.type] || 'var(--primary)'}30`,
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
              animation: `slideUp .35s ease-out ${i * 0.07}s both`,
            }}>
              <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{ins.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{ins.title}</p>
                <p style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.6 }}>{ins.body}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: TYPE_BORDER[ins.type] || 'var(--primary)',
                background: 'rgba(255,255,255,.6)',
                padding: '2px 8px', borderRadius: 999, flexShrink: 0, marginTop: 2,
              }}>
                {TYPE_LABELS[ins.type] || ''}
              </span>
            </div>
          ))}
        </div>
      )}

      
      <div className="chart-box" style={{ marginTop: 16 }}>
        <p className="chart-title" style={{ marginBottom: 2 }}>Net Savings Per Month</p>
        <p className="chart-sub"  style={{ marginBottom: 14 }}>Income minus expenses each month</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={gc} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: tc }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
            <Tooltip
              formatter={v => [fmtCurrency(v), 'Net Savings']}
              contentStyle={{ background: dark ? '#111827' : '#fff', border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`, borderRadius: 10, fontSize: 12 }}
            />
            <Bar dataKey="net" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {monthlyData.map((m, i) => <Cell key={i} fill={m.net >= 0 ? '#10b981' : '#ef4444'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
