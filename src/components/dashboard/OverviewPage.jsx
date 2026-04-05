import SummaryCards from './SummaryCards.jsx'
import BalanceChart from './BalanceChart.jsx'
import DonutChart from './DonutChart.jsx'
import MonthlyBar from './MonthlyBar.jsx'
import RecentTxns from './RecentTxns.jsx'

export default function OverviewPage({ txns, dark, setPage }) {
  return (
    <div style={{ animation: 'fadeIn .35s ease-out' }}>
      <SummaryCards txns={txns} />
      <div style={{ height: 16 }} />
      <div className="charts-row charts-row-1">
        <BalanceChart txns={txns} dark={dark} />
        <DonutChart txns={txns} dark={dark} />
      </div>
      <div style={{ height: 14 }} />
      <div className="charts-row charts-row-2">
        <MonthlyBar txns={txns} dark={dark} />
        <RecentTxns txns={txns} setPage={setPage} />
      </div>
    </div>
  )
}
