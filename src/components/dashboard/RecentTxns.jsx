import { catEmoji, fmtCurrency, fmtDateShort } from '../../utils/helpers.js'

export default function RecentTxns({ txns, setPage }) {
  return (
    <div className="chart-box" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
      <div className="chart-header">
        <div>
          <p className="chart-title">Recent Transactions</p>
          <p className="chart-sub">Latest activity</p>
        </div>
        <button onClick={() => setPage('transactions')} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
          See all →
        </button>
      </div>
      {txns.slice(0, 6).map(t => (
        <div key={t.id} className="recent-txn-row">
          <div className="txn-emoji-icon">{catEmoji(t.category)}</div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</p>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{t.category}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
              {t.type === 'income' ? '+' : '-'}{fmtCurrency(t.amount, true)}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{fmtDateShort(t.date)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
