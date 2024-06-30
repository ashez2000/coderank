import express from 'express'
import morgan from 'morgan'
import 'express-async-errors'

import { errorHandler, notFound } from './middlewares/error.js'
import authRoutes from './routes/auth.js'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!')
})

app.use('/api/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
