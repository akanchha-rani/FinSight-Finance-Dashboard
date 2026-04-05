import { CATEGORY_EMOJIS } from '../data/mockData.js'

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function fmtIso(d) {
  return d.toISOString().split('T')[0]
}

export function fmtCurrency(n, compact = false) {
  if (compact && n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (compact && n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export function fmtDate(s) {
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function fmtDateShort(s) {
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function catEmoji(c) {
  return CATEGORY_EMOJIS[c] || '💳'
}

export function payIcon(m) {
  return { UPI: '📱', Card: '💳', 'Net Banking': '🏦', Cash: '💵', 'Bank Transfer': '🔄' }[m] || '💳'
}
