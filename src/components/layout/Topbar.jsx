import { IconDownload, IconMoon, IconSun, IconPlus } from '../ui/Icons.jsx'

const PAGE_LABELS = {
  overview: 'Overview',
  transactions: 'Transactions',
  insights: 'Insights',
}
const PAGE_SUBS = {
  overview: 'Your financial summary at a glance',
  transactions: 'All your income and expenses',
  insights: 'AI-powered spending analysis · Anomaly detection · Forecast',
}

export default function Topbar({ page, role, dark, onDarkToggle, onAdd, onExport }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-title">{PAGE_LABELS[page]}</p>
        <p className="topbar-sub">{PAGE_SUBS[page]}</p>
      </div>
      <div className="topbar-actions">
        {role === 'admin' && (
          <button className="btn" onClick={onExport}>
            <IconDownload /> Export CSV
          </button>
        )}
        <button className="btn btn-icon" onClick={onDarkToggle}>
          {dark ? <IconSun /> : <IconMoon />}
        </button>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={onAdd}>
            <IconPlus /> Add
          </button>
        )}
      </div>
    </header>
  )
}
