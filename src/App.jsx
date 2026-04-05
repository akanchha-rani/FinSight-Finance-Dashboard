import { useState, useEffect } from 'react'
import { useStore, useActions } from './store/useStore.js'
import { genId, fmtIso } from './utils/helpers.js'
import Sidebar from './components/layout/Sidebar.jsx'
import Topbar from './components/layout/Topbar.jsx'
import Modal from './components/ui/Modal.jsx'
import TransactionForm from './components/ui/TransactionForm.jsx'
import OverviewPage from './components/dashboard/OverviewPage.jsx'
import TransactionsPage from './components/transactions/TransactionsPage.jsx'
import InsightsPage from './components/insights/InsightsPage.jsx'

export default function App() {
  const txns = useStore(s => s.txns)
  const role = useStore(s => s.role)
  const dark = useStore(s => s.dark)
  const { addTxn, updateTxn, deleteTxn, setRole, setDark } = useActions()

  const [page, setPage] = useState('overview')
  const [addOpen, setAddOpen] = useState(false)
  const [editTxn, setEditTxn] = useState(null)
  const [deleteTxnState, setDeleteTxnState] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const exportCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Note']
    const rows = txns.map(t => [t.date, t.title, t.category, t.type, t.amount, t.paymentMethod, t.note || ''])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'FinSight-export.csv'
    a.click()
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} role={role} setRole={setRole} />

      <div className="main">
        <Topbar
          page={page}
          role={role}
          dark={dark}
          onDarkToggle={() => setDark(!dark)}
          onAdd={() => setAddOpen(true)}
          onExport={exportCSV}
        />

        <main className="content">
          {page === 'overview' && <OverviewPage txns={txns} dark={dark} setPage={setPage} />}
          {page === 'transactions' && (
            <TransactionsPage
              txns={txns}
              role={role}
              onEdit={setEditTxn}
              onDelete={setDeleteTxnState}
            />
          )}
          {page === 'insights' && <InsightsPage txns={txns} dark={dark} />}
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Transaction">
        <TransactionForm onSave={addTxn} onClose={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editTxn} onClose={() => setEditTxn(null)} title="Edit Transaction">
        {editTxn && (
          <TransactionForm
            initial={editTxn}
            onSave={t => { updateTxn(t); setEditTxn(null) }}
            onClose={() => setEditTxn(null)}
          />
        )}
      </Modal>

      <Modal open={!!deleteTxnState} onClose={() => setDeleteTxnState(null)} title="Delete Transaction" sm>
        {deleteTxnState && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>Are you sure you want to delete this transaction?</p>
            <div className="delete-confirm-info">
              <p className="delete-confirm-title">{deleteTxnState.title}</p>
              <p className="delete-confirm-sub">{deleteTxnState.amount} · {deleteTxnState.category}</p>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setDeleteTxnState(null)}>Cancel</button>
              <button className="btn-delete" onClick={() => { deleteTxn(deleteTxnState.id); setDeleteTxnState(null) }}>Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
