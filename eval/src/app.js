import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { evalSnippet } from './eval.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.post('/eval', async (req, res) => {
  const { lang, code } = req.body

  try {
    const output = await evalSnippet(lang, code)
    res.status(200).json(output)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

export default app
