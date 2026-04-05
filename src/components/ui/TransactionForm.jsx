import { useState } from 'react'
import { CATEGORIES, PAYMENT_METHODS } from '../../data/mockData.js'
import { genId, fmtIso } from '../../utils/helpers.js'

export default function TransactionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    amount: initial?.amount?.toString() || '',
    type: initial?.type || 'expense',
    category: initial?.category || 'Food & Dining',
    date: initial?.date || fmtIso(new Date('2026-04-03')),
    paymentMethod: initial?.paymentMethod || 'UPI',
    note: initial?.note || '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    onSave({ ...form, amount: +form.amount, id: initial?.id || genId() })
    onClose()
  }

  return (
    <div>
      <div className="type-toggle">
        <button className={`type-btn ${form.type === 'expense' ? 'active-expense' : ''}`} onClick={() => set('type', 'expense')}>↓ Expense</button>
        <button className={`type-btn ${form.type === 'income' ? 'active-income' : ''}`} onClick={() => set('type', 'income')}>↑ Income</button>
      </div>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Swiggy Order" />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Amount (₹)</label>
        <input className="form-input" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" min={0} />
        {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <div className="payment-btns">
          {PAYMENT_METHODS.map(m => (
            <button key={m} className={`payment-btn ${form.paymentMethod === m ? 'active' : ''}`} onClick={() => set('paymentMethod', m)}>{m}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Note (optional)</label>
        <input className="form-input" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Add a note..." />
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-submit" onClick={submit}>{initial ? 'Update Transaction' : 'Add Transaction'}</button>
      </div>
    </div>
  )
}
