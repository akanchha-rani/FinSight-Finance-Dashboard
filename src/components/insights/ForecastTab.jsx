import { fmtCurrency, catEmoji } from '../../utils/helpers.js'

export default function ForecastTab({ forecast, catData, income30, exp30 }) {
  const { dailyAvg, daysLeft, projectedExp, projectedSavings, projectedRate, pctUsed } = forecast

  const meterColor = pctUsed > 80 ? 'var(--red)' : pctUsed > 60 ? 'var(--amber)' : 'var(--green)'
  const projColor = projectedSavings >= 0 ? 'var(--green)' : 'var(--red)'
  const projBg = projectedSavings >= 0 ? 'var(--green-light)' : 'var(--red-light)'

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
        Based on your spending pace this month, here's where you'll end up by April 30.
      </p>

      <div className="forecast-row">
        
        <div className="chart-box" style={{ marginBottom: 0 }}>
          <p className="chart-title" style={{ marginBottom: 16 }}>April Spending Forecast</p>

          
          <div className="forecast-meter" style={{ marginBottom: 16 }}>
            <div className="forecast-meter-label">
              <span>Budget Used</span>
              <span style={{ fontWeight: 700, color: pctUsed > 80 ? 'var(--red)' : 'var(--text)' }}>{pctUsed}%</span>
            </div>
            <div className="forecast-meter-track">
              <div className="forecast-meter-fill" style={{ width: `${pctUsed}%`, background: meterColor }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              {fmtCurrency(exp30, true)} of {fmtCurrency(income30, true)} income spent
            </p>
          </div>

          
          <div className="forecast-meter" style={{ marginBottom: 16 }}>
            <div className="forecast-meter-label">
              <span>Projected Month-End Expenses</span>
              <strong style={{ color: 'var(--text)' }}>{fmtCurrency(projectedExp, true)}</strong>
            </div>
            <div className="forecast-meter-track">
              <div className="forecast-meter-fill" style={{ width: `${Math.min(100, projectedExp / income30 * 100)}%`, background: 'var(--primary)' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              Daily avg: {fmtCurrency(Math.round(dailyAvg), true)} · {daysLeft} days remaining
            </p>
          </div>

         
          <div style={{ background: projBg, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: projColor }}>Projected Savings</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: projColor, letterSpacing: '-.4px' }}>
                {fmtCurrency(Math.abs(Math.round(projectedSavings)), true)}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                {Math.abs(projectedRate.toFixed(1))}% of income
              </p>
            </div>
          </div>
        </div>

        
        <div className="category-rank" style={{ marginBottom: 0 }}>
          <p className="chart-title" style={{ marginBottom: 14 }}>Spending Rank</p>
          {catData.slice(0, 6).map((item, i) => (
            <div key={item.category} className="rank-row">
              <div className="rank-top">
                <div className="rank-label">
                  <span className="rank-num">#{i + 1}</span>
                  <span>{catEmoji(item.category)}</span>
                  <span>{item.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{item.percentage}%</span>
                  <span className="rank-amount">{fmtCurrency(item.amount, true)}</span>
                </div>
              </div>
              <div className="rank-bar-track">
                <div className="rank-bar-fill" style={{ width: `${item.percentage}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
