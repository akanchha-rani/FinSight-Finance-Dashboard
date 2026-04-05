export const CATEGORY_COLORS = {
  'Food & Dining': '#6366f1',
  'Transport': '#10b981',
  'Entertainment': '#f59e0b',
  'Utilities': '#ef4444',
  'Shopping': '#8b5cf6',
  'Healthcare': '#06b6d4',
  'Salary': '#3b82f6',
  'Freelance': '#84cc16',
  'Investment': '#f97316',
  'Other': '#6b7280',
}

export const CATEGORY_EMOJIS = {
  'Food & Dining': '🍽️', 'Transport': '🚕', 'Entertainment': '🎬',
  'Utilities': '💡', 'Shopping': '🛍️', 'Healthcare': '🏥',
  'Salary': '💼', 'Freelance': '💻', 'Investment': '📈', 'Other': '📦',
}

export const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking', 'Cash', 'Bank Transfer']
export const CATEGORIES = Object.keys(CATEGORY_COLORS)

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function fmtIso(d) { return d.toISOString().split('T')[0] }

export function generateData() {
  const TODAY = new Date('2026-04-03')
  const txns = []
  const months = [{ o: -150 }, { o: -120 }, { o: -90 }, { o: -60 }, { o: -30 }, { o: 0 }]

  months.forEach(({ o }) => {
    const base = addDays(TODAY, o)
    txns.push({ id: genId(), title: 'Monthly Salary', amount: rnd(82000, 95000), type: 'income', category: 'Salary', date: fmtIso(addDays(base, 1)), paymentMethod: 'Bank Transfer', note: 'Acme Corp salary credit' })
    if (Math.random() > .45) txns.push({ id: genId(), title: 'Freelance Project', amount: rnd(8000, 25000), type: 'income', category: 'Freelance', date: fmtIso(addDays(base, rnd(5, 25))), paymentMethod: 'Bank Transfer', note: '' })

    const food = ["Swiggy Order", "Zomato Order", "BigBasket Grocery", "Restaurant Dinner", "Domino's Pizza", "Blinkit Order"]
    for (let i = 0; i < rnd(4, 6); i++) txns.push({ id: genId(), title: food[rnd(0, food.length - 1)], amount: rnd(200, 3500), type: 'expense', category: 'Food & Dining', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['UPI', 'Card', 'Cash'][rnd(0, 2)], note: '' })

    const transport = ['Ola Cab', 'Uber Ride', 'Metro Card Recharge', 'Petrol - BPCL', 'Auto Rickshaw', 'IRCTC Ticket']
    for (let i = 0; i < rnd(3, 5); i++) txns.push({ id: genId(), title: transport[rnd(0, transport.length - 1)], amount: rnd(80, 2800), type: 'expense', category: 'Transport', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['UPI', 'Card', 'Cash'][rnd(0, 2)], note: '' })

    const ent = ['Netflix', 'Spotify Premium', 'BookMyShow', 'Amazon Prime', 'YouTube Premium']
    for (let i = 0; i < rnd(2, 3); i++) txns.push({ id: genId(), title: ent[rnd(0, ent.length - 1)], amount: rnd(149, 2500), type: 'expense', category: 'Entertainment', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['Card', 'UPI'][rnd(0, 1)], note: '' })

    const util = ['Electricity Bill', 'Internet - Jio', 'Water Bill', 'Gas Bill', 'Mobile Recharge']
    for (let i = 0; i < rnd(2, 3); i++) txns.push({ id: genId(), title: util[rnd(0, util.length - 1)], amount: rnd(300, 3200), type: 'expense', category: 'Utilities', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['Net Banking', 'UPI'][rnd(0, 1)], note: '' })

    const shop = ['Amazon Purchase', 'Flipkart Order', 'Myntra Clothes', 'Decathlon Sports']
    for (let i = 0; i < rnd(1, 3); i++) txns.push({ id: genId(), title: shop[rnd(0, shop.length - 1)], amount: rnd(400, 8000), type: 'expense', category: 'Shopping', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['Card', 'UPI', 'Net Banking'][rnd(0, 2)], note: '' })

    if (Math.random() > .5) {
      const h = ['Apollo Pharmacy', 'Doctor Visit', 'Lab Tests', 'Gym Membership']
      txns.push({ id: genId(), title: h[rnd(0, h.length - 1)], amount: rnd(200, 3500), type: 'expense', category: 'Healthcare', date: fmtIso(addDays(base, rnd(1, 28))), paymentMethod: ['Card', 'Cash', 'UPI'][rnd(0, 2)], note: '' })
    }
  })

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date))
}
