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

      
      {serverHasKey === false && (
        <div style={{
          background: 'var(--amber-light)', border: '1px solid var(--amber)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              API Key Not Found — AI Insights are disabled
            </p>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
              1. Copy <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.env.example</code> → <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.env</code><br />
              2. Set <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>ANTHROPIC_API_KEY=sk-ant-...</code><br />
              3. Restart <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>node server.js</code>
            </p>
          </div>
        </div>
      )}

      
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
