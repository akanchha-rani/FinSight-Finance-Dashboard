import { useState, useCallback } from 'react'
import { fmtCurrency } from '../utils/helpers.js'
import { CATEGORY_COLORS } from '../data/mockData.js'

const PROXY_URL = '/api/claude'
const MODEL = 'claude-sonnet-4-20250514'

async function callClaude(system, messages, maxTokens = 800) {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'API_ERROR')
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('')
}

export function useAI(txns) {
  const NOW = new Date('2026-04-03')
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
  const cutoff30 = addDays(NOW, -30)
  const cutoff60 = addDays(NOW, -60)

  const expTxns     = txns.filter(t => t.type === 'expense' && new Date(t.date) >= cutoff30)
  const expTxnsPrev = txns.filter(t => t.type === 'expense' && new Date(t.date) >= cutoff60 && new Date(t.date) < cutoff30)
  const income30    = txns.filter(t => t.type === 'income'  && new Date(t.date) >= cutoff30).reduce((s, t) => s + t.amount, 0)
  const exp30       = expTxns.reduce((s, t) => s + t.amount, 0)
  const savingsRate = income30 > 0 ? ((income30 - exp30) / income30) * 100 : 0

  function getCatData(list) {
    const by = {}
    list.forEach(t => { by[t.category] = (by[t.category] || 0) + t.amount })
    const total = Object.values(by).reduce((s, v) => s + v, 0)
    return Object.entries(by)
      .map(([k, v]) => ({
        category: k,
        amount: Math.round(v),
        percentage: total > 0 ? Math.round(v / total * 100) : 0,
        color: CATEGORY_COLORS[k] || '#6b7280',
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  const catData        = getCatData(expTxns)
  const catDataPrev    = getCatData(expTxnsPrev)
  const catDataPrevMap = Object.fromEntries(catDataPrev.map(c => [c.category, c.amount]))

  function getMonthlyData() {
    const months = {}
    txns.forEach(t => {
      const d = new Date(t.date)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[k]) months[k] = { income: 0, expenses: 0, label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }) }
      if (t.type === 'income') months[k].income += t.amount
      else months[k].expenses += t.amount
    })
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => ({ month: v.label, net: Math.round(v.income - v.expenses) }))
  }
  const monthlyData = getMonthlyData()

  function buildContext() {
    const catSummary  = catData.map(c => `${c.category}: ${fmtCurrency(c.amount)} (${c.percentage}%)`).join('\n')
    const prevSummary = catDataPrev.map(c => `${c.category}: ${fmtCurrency(c.amount)}`).join(', ')
    const recentTxns  = txns.slice(0, 15).map(t =>
      `${t.date}: ${t.type === 'income' ? '+' : '-'}${fmtCurrency(t.amount)} — ${t.title} (${t.category})`
    ).join('\n')
    const netTrend = monthlyData.map(m => `${m.month}: ${fmtCurrency(m.net)}`).join(', ')
    return `FINANCIAL DATA (as of April 3, 2026 — Indian Rupees):

Last 30 days:
- Income: ${fmtCurrency(income30)}
- Expenses: ${fmtCurrency(exp30)}
- Savings rate: ${savingsRate.toFixed(1)}%
- Expense transactions: ${expTxns.length}

Category spending (last 30 days):
${catSummary}

Previous 30 days by category: ${prevSummary}
Monthly net savings (6 months): ${netTrend}

Recent 15 transactions:
${recentTxns}`
  }

  const [serverHasKey, setServerHasKey] = useState(null)
  const [apiError, setApiError]         = useState(null)

  const checkServerKey = useCallback(async () => {
    try {
      const res  = await fetch('/api/health')
      const data = await res.json()
      setServerHasKey(data.hasKey)
      return data.hasKey
    } catch {
      setServerHasKey(false)
      return false
    }
  }, [])

  const [insights,        setInsights]        = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true)
    setInsights(null)
    setApiError(null)

    const prompt = `${buildContext()}\n\nProvide exactly 5 concise, actionable financial insights. Return ONLY this JSON (no markdown, no extra text):\n{"insights":[{"title":"Short title","body":"1-2 sentence insight","type":"warning|success|info|danger","emoji":"single emoji"}]}\n\nFocus on: spending anomalies vs previous month, savings health, top categories, practical advice. Be specific with rupee amounts.`

    try {
      const text  = await callClaude('You are a financial analyst. Return only valid JSON, no markdown fences.', [{ role: 'user', content: prompt }], 900)
      const clean = text.replace(/```json|```/g, '').trim()
      setInsights(JSON.parse(clean).insights)
    } catch (err) {
      setApiError(err.message)
      setInsights([
        { title: `Savings Rate: ${savingsRate.toFixed(1)}%`, body: savingsRate >= 20 ? 'Above the 20% benchmark — great discipline! Aim for 30% for faster wealth building.' : 'Below the 20% target. Cutting Food and Entertainment spending will help.', type: savingsRate >= 20 ? 'success' : 'warning', emoji: savingsRate >= 20 ? '🎯' : '⚠️' },
        { title: `Top Spend: ${catData[0]?.category || 'N/A'}`, body: `${catData[0]?.category} consumed ${catData[0]?.percentage || 0}% of your budget (${fmtCurrency(catData[0]?.amount || 0)}). ${(catData[0]?.percentage || 0) > 30 ? 'Consider a monthly cap.' : 'Looks manageable.'}`, type: (catData[0]?.percentage || 0) > 30 ? 'warning' : 'info', emoji: '📊' },
        { title: `${expTxns.length} Expense Transactions`, body: `You made ${expTxns.length} expense transactions totalling ${fmtCurrency(exp30)} this month. Review regularly to spot leaks.`, type: 'info', emoji: '📈' },
        { title: 'Set Category Budgets', body: 'A monthly cap on your top 3 categories reduces overspending significantly. Even rough limits work.', type: 'info', emoji: '💡' },
        { title: 'Automate Savings', body: 'Auto-transfer at least 20% of salary to savings on payday. Spend what remains — not the other way around.', type: 'success', emoji: '🏦' },
      ])
    } finally {
      setInsightsLoading(false)
    }
  }, [txns])

  const anomalies = catData
    .map(c => {
      const prev   = catDataPrevMap[c.category] || 0
      if (prev === 0) return null
      const change = Math.round(((c.amount - prev) / prev) * 100)
      if (Math.abs(change) < 30) return null
      return { category: c.category, amount: c.amount, prev: Math.round(prev), change, color: c.color }
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 3)

  const dailyAvg        = exp30 / 30
  const daysLeft        = 30 - new Date('2026-04-03').getDate() + 1
  const projectedExp    = exp30 + dailyAvg * daysLeft
  const projectedSavings = income30 - projectedExp
  const projectedRate   = income30 > 0 ? (projectedSavings / income30) * 100 : 0
  const pctUsed         = Math.min(100, Math.round((exp30 / income30) * 100))
  const forecast        = { dailyAvg, daysLeft, projectedExp, projectedSavings, projectedRate, pctUsed }

  return {
    catData, catDataPrevMap, monthlyData, income30, exp30, savingsRate, expTxns,
    insights, insightsLoading, fetchInsights,
    anomalies, forecast,
    serverHasKey, apiError, checkServerKey,
  }
}
