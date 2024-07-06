import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.post('/eval', (req, res) => {
  res.status(500).json({ message: 'Server Error' })
})

export default app
