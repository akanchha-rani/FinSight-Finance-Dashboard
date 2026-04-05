import { useMemo } from 'react'
import { fmtCurrency } from '../../utils/helpers.js'
import { IconTrendUp, IconTrendDown } from '../ui/Icons.jsx'

export default function SummaryCards({ txns }) {
  const NOW = new Date('2026-04-03')

  const { income, expenses, savingsRate, totalBalance, incomeTrend, expTrend } = useMemo(() => {
    const thisMonth = txns.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === NOW.getMonth() && d.getFullYear() === NOW.getFullYear()
    })
    const income = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

    const months = {}
    txns.forEach(t => {
      const d = new Date(t.date)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[k]) months[k] = { income: 0, expenses: 0 }
      if (t.type === 'income') months[k].income += t.amount
      else months[k].expenses += t.amount
    })
    const monthly = Object.entries(months).sort(([a], [b]) => a.localeCompare(b))
    const lastM = monthly.length >= 2 ? monthly[monthly.length - 2][1] : null
    const incomeTrend = lastM ? ((income - lastM.income) / (lastM.income || 1)) * 100 : 0
    const expTrend = lastM ? ((expenses - lastM.expenses) / (lastM.expenses || 1)) * 100 : 0
    const totalBalance = monthly.reduce((s, [, m]) => s + m.income - m.expenses, 0)

    return { income, expenses, savingsRate, totalBalance, incomeTrend, expTrend }
  }, [txns])

  const cards = [
    {
      label: 'Total Balance', value: fmtCurrency(totalBalance, true), trend: incomeTrend, sub: 'Running balance',
      iconBg: '#eef2ff',
      icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={2} strokeLinecap="round"><rect x={2} y={5} width={20} height={14} rx={2} /><line x1={2} y1={10} x2={22} y2={10} /></svg>
    },
    {
      label: 'Monthly Income', value: fmtCurrency(income, true), trend: incomeTrend, sub: 'vs last month',
      iconBg: '#ecfdf5',
      icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={16} /><line x1={8} y1={12} x2={16} y2={12} /></svg>
    },
    {
      label: 'Monthly Expenses', value: fmtCurrency(expenses, true), trend: expTrend, sub: 'vs last month', invertTrend: true,
      iconBg: '#fef2f2',
      icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><line x1={8} y1={12} x2={16} y2={12} /></svg>
    },
    {
      label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, sub: savingsRate >= 20 ? '✓ Healthy savings' : '⚠ Below 20% target',
      iconBg: '#fffbeb',
      icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><path d="M12 8v4l3 3" /></svg>
    },
  ]

  return (
    <div className="cards-grid">
      {cards.map((c, i) => {
        const isPos = (c.invertTrend ? -1 : 1) * (c.trend || 0) > 0
        return (
          <div key={c.label} className="stat-card" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="stat-icon" style={{ background: c.iconBg }}>{c.icon}</div>
            <p className="stat-label">{c.label}</p>
            <p className="stat-value">{c.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {c.trend !== undefined && (
                <span className={`trend-badge ${isPos ? 'up' : 'down'}`}>
                  {isPos ? <IconTrendUp /> : <IconTrendDown />}
                  {` ${Math.abs(c.trend).toFixed(1)}%`}
                </span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{c.sub}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
