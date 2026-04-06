import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY || ''
  res.json({
    ok: true,
    hasKey: !!key,
    keyPreview: key ? `${key.slice(0, 14)}...` : null,
  })
})

app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'NO_API_KEY',
      message: 'ANTHROPIC_API_KEY is not set in environment variables.',
    })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: upstream.status === 401 ? 'INVALID_KEY' : 'API_ERROR',
        message: data?.error?.message || 'Anthropic API error',
        status: upstream.status,
      })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({
      error: 'NETWORK_ERROR',
      message: err.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n FinSight proxy server running on port ${PORT}`)
  const key = process.env.ANTHROPIC_API_KEY
  if (key) {
    console.log(`API key loaded: ${key.slice(0, 14)}...`)
  } else {
    console.log(`No ANTHROPIC_API_KEY found — AI features won't work`)
  }
  console.log(`\n Start the frontend separately: npm run dev:client\n`)
})