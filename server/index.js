import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Database initialization
import { initDB } from './db/store.js'
await initDB()

// Routes
import patientRoutes from './routes/patients.js'
import appointmentRoutes from './routes/appointments.js'
import analysisRoutes from './routes/analysis.js'

app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/analysis', analysisRoutes)

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase()
    if (!q) {
      return res.json([])
    }

    const { db } = await import('./db/store.js')
    const patients = db.data?.patients || []
    const results = patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.contact?.email?.toLowerCase().includes(q)
    )
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: 'Search failed' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Doc Assist server running on http://localhost:${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)
  console.log(`💾 Using ${process.env.USE_SUPABASE ? 'Supabase' : 'lowdb (local storage)'}`)
})

export default app
