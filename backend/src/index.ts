import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Health check route
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ status: 'ok', time: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})