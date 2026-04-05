import { useState, useMemo, useRef, useEffect } from 'react'
import { CATEGORIES } from '../../data/mockData.js'
import { catEmoji, payIcon, fmtCurrency, fmtDate, addDays } from '../../utils/helpers.js'
import { IconEdit, IconTrash } from '../ui/Icons.jsx'

const NOW = new Date('2026-04-03')


function Dropdown({ label, value, onChange, options, minWidth = 140 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = options.find(o => o.value === value)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', minWidth }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          padding: '7px 10px',
          borderRadius: 9,
          border: '1px solid var(--border)',
          background: value !== options[0]?.value ? 'var(--primary-light)' : 'var(--bg3)',
          color: value !== options[0]?.value ? 'var(--primary)' : 'var(--text2)',
          fontFamily: 'inherit',
          fontSize: 12.5,
          fontWeight: value !== options[0]?.value ? 600 : 400,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          outline: 'none',
          transition: 'all .15s',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
          {current?.label || label}
        </span>
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          minWidth: '100%',
          maxWidth: 240,
          maxHeight: 260,
          overflowY: 'auto',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,.12)',
          zIndex: 200,
          animation: 'slideUp .15s ease-out',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: value === opt.value ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 12.5,
                fontWeight: value === opt.value ? 600 : 400,
                color: value === opt.value ? 'var(--primary)' : 'var(--text)',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'background .1s',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.label}</span>
              {value === opt.value && (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" style={{ flexShrink: 0, marginLeft: 6 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TransactionsPage({ txns, role, onEdit, onDelete }) {
  const [nameFilter, setNameFilter]   = useState('all')
  const [typeFilter, setTypeFilter]   = useState('all')
  const [catFilter,  setCatFilter]    = useState('all')
  const [dateRange,  setDateRange]    = useState('30')
  const [sort,       setSort]         = useState({ field: 'date', order: 'desc' })

  const handleSort = (field) => {
    setSort(s => s.field === field
      ? { field, order: s.order === 'asc' ? 'desc' : 'asc' }
      : { field, order: 'desc' }
    )
  }

  const nameOptions = useMemo(() => {
    const names = [...new Set(txns.map(t => t.title))].sort()
    return [
      { value: 'all', label: 'All Names' },
      ...names.map(n => ({ value: n, label: n })),
    ]
  }, [txns])

  const typeOptions = [
    { value: 'all',     label: 'All Types' },
    { value: 'income',  label: '↑ Income' },
    { value: 'expense', label: '↓ Expense' },
  ]

  const catOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c, label: c })),
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7',   label: 'Last 7 days' },
    { value: '30',  label: 'Last 30 days' },
    { value: '90',  label: 'Last 90 days' },
  ]

  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (nameFilter !== 'all' && t.title !== nameFilter) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (catFilter  !== 'all' && t.category !== catFilter) return false
      if (dateRange  !== 'all') {
        const cutoff = addDays(NOW, -parseInt(dateRange))
        if (new Date(t.date) < cutoff) return false
      }
      return true
    }).sort((a, b) => {
      let cmp = 0
      if      (sort.field === 'date')     cmp = new Date(a.date) - new Date(b.date)
      else if (sort.field === 'amount')   cmp = a.amount - b.amount
      else if (sort.field === 'category') cmp = a.category.localeCompare(b.category)
      else if (sort.field === 'title')    cmp = a.title.localeCompare(b.title)
      return sort.order === 'asc' ? cmp : -cmp
    })
  }, [txns, nameFilter, typeFilter, catFilter, dateRange, sort])

  const SortBtn = ({ field, label }) => {
    const active = sort.field === field
    return (
      <button className={`sort-btn ${active ? 'active' : ''}`} onClick={() => handleSort(field)}>
        {label}{' '}{active ? (sort.order === 'asc' ? '↑' : '↓') : '↕'}
      </button>
    )
  }

  const isDirty = nameFilter !== 'all' || typeFilter !== 'all' || catFilter !== 'all' || dateRange !== '30'
  const reset = () => { setNameFilter('all'); setTypeFilter('all'); setCatFilter('all'); setDateRange('30') }

 
  const gridCols = role === 'admin'
    ? '2fr 1fr 1fr 120px 80px'
    : '2fr 1fr 1fr 120px'

  return (
    <div style={{ animation: 'fadeIn .35s ease-out' }}>

      
      <div className="filter-bar">
        
        <Dropdown
          label="Filter by Name"
          value={nameFilter}
          onChange={setNameFilter}
          options={nameOptions}
          minWidth={160}
        />
        
        <Dropdown
          label="All Types"
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
          minWidth={120}
        />
        
        <Dropdown
          label="All Categories"
          value={catFilter}
          onChange={setCatFilter}
          options={catOptions}
          minWidth={150}
        />
        
        <Dropdown
          label="All Time"
          value={dateRange}
          onChange={setDateRange}
          options={dateOptions}
          minWidth={130}
        />
        
        {isDirty && (
          <button className="filter-chip" onClick={reset} style={{ marginLeft: 'auto' }}>
            ✕ Reset
          </button>
        )}
      </div>

      
      <div className="txn-table txn-table-wrap">

        
        <div className="txn-head" style={{ gridTemplateColumns: gridCols }}>
          <SortBtn field="title"    label="Transaction" />
          <span className="col-cat"><SortBtn field="category" label="Category" /></span>
          <span className="col-date"><SortBtn field="date" label="Date" /></span>
          
          <div style={{ textAlign: 'center' }}>
            <SortBtn field="amount" label="Amount" />
          </div>
          {role === 'admin' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text3)' }}>
                Actions
              </span>
            </div>
          )}
        </div>

        
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">No transactions found</p>
            <p className="empty-sub">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="txn-row-item" style={{ gridTemplateColumns: gridCols }}>

             
              <div className="txn-name-wrap">
                <div className="txn-emoji-icon">{catEmoji(t.category)}</div>
                <div style={{ minWidth: 0 }}>
                  <p className="txn-title">{t.title}</p>
                  <p className="txn-meta-text">{payIcon(t.paymentMethod)} {t.paymentMethod}</p>
                </div>
              </div>

              
              <div className="col-cat">
                <span className="txn-cat-badge">{t.category}</span>
              </div>

              
              <div className="col-date">
                <span className="txn-date-text">{fmtDate(t.date)}</span>
              </div>

            
              <div style={{ textAlign: 'center' }}>
                <p className={`txn-amount ${t.type === 'income' ? 'credit' : 'debit'}`}>
                  {t.type === 'income' ? '+' : '-'}{fmtCurrency(t.amount, true)}
                </p>
                <span className={`type-badge ${t.type}`}>{t.type}</span>
              </div>

              
              {role === 'admin' && (
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(t)}
                    title="Edit"
                    style={{ opacity: 1 }}
                  >
                    <IconEdit />
                  </button>
                  <button
                    className="action-btn del"
                    onClick={() => onDelete(t)}
                    title="Delete"
                    style={{ opacity: 1 }}
                  >
                    <IconTrash />
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', fontSize: 11, color: 'var(--text3)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Showing {filtered.length} of {txns.length} transaction{txns.length !== 1 ? 's' : ''}</span>
            {isDirty && <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Filtered</span>}
          </div>
        )}
      </div>
    </div>
  )
}
