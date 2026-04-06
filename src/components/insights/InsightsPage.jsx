import { useState, useEffect } from 'react'
import { useAI } from '../../hooks/useAI.js'
import InsightsTab from './InsightsTab.jsx'
import AnomaliesTab from './AnomaliesTab.jsx'
import ForecastTab from './ForecastTab.jsx'

const TABS = [
  { id: 'insights',  label: ' Insights'  },
  { id: 'anomalies', label: ' Anomalies' },
  { id: 'forecast',  label: ' Forecast'  },
]

export default function InsightsPage({ txns, dark }) {
  const [activeTab, setActiveTab] = useState('insights')

  const {
    catData, monthlyData, income30, exp30, savingsRate, expTxns,
    insights, insightsLoading, fetchInsights,
    anomalies, forecast,
    serverHasKey, checkServerKey,
  } = useAI(txns)

  useEffect(() => { checkServerKey() }, [])

  return (
    <div style={{ animation: 'fadeIn .35s ease-out' }}>

      <div className="ai-tab-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`ai-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'insights' && (
        <InsightsTab
          insights={insights}
          insightsLoading={insightsLoading}
          fetchInsights={fetchInsights}
          monthlyData={monthlyData}
          dark={dark}
          serverHasKey={serverHasKey}
        />
      )}
      {activeTab === 'anomalies' && (
        <AnomaliesTab anomalies={anomalies} catData={catData} dark={dark} />
      )}
      {activeTab === 'forecast' && (
        <ForecastTab forecast={forecast} catData={catData} income30={income30} exp30={exp30} />
      )}
    </div>
  )
}
