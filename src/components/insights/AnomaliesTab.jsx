import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtCurrency, catEmoji } from '../../utils/helpers.js'

export default function AnomaliesTab({ anomalies, catData, dark }) {
  const gc = dark ? '#1f2937' : '#f1f5f9'
  const tc = dark ? '#4b5563' : '#94a3b8'

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.6 }}>
        Comparing your last 30 days vs the previous 30 days to flag unusual changes in spending.
      </p>

      {anomalies.length === 0 ? (
        <div className="chart-box" style={{ textAlign: 'center', padding: 40, marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>No anomalies detected!</p>
          <p style={{ fontSize: 12, color: 'var(--text3)' }}>Your spending is consistent with the previous month.</p>
        </div>
      ) : (
        <div className="anomaly-grid">
          {anomalies.map((a, i) => (
            <div key={i} className="anomaly-card">
              <div className="anomaly-icon" style={{ background: a.change > 0 ? 'var(--red-light)' : 'var(--green-light)' }}>
                {catEmoji(a.category)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="anomaly-card-title">{a.category}</p>
                <p className="anomaly-card-desc">vs prev: {fmtCurrency(a.prev, true)}</p>
                <p className="anomaly-card-val">{fmtCurrency(a.amount, true)}</p>
                <span className={`anomaly-tag ${a.change > 0 ? 'warn' : 'good'}`}>
                  {a.change > 0 ? `↑ ${a.change}% more` : `↓ ${Math.abs(a.change)}% less`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

     
      <div className="chart-box">
        <p className="chart-title" style={{ marginBottom: 4 }}>Category Breakdown — Last 30 Days</p>
        <p className="chart-sub" style={{ marginBottom: 14 }}>By spend amount</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={catData.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 10, left: 80, bottom: 0 }}>
            <CartesianGrid stroke={gc} strokeDasharray="4 4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: tc }} axisLine={false} tickLine={false} tickFormatter={v => fmtCurrency(v, true)} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} width={80} />
            <Tooltip formatter={v => [fmtCurrency(v), 'Amount']} contentStyle={{ background: dark ? '#111827' : '#fff', border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`, borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={16}>
              {catData.slice(0, 6).map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
