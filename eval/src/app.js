import express from 'express'
import { evalSnippet } from './eval.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.post('/eval', async (req, res) => {
  const { lang, code } = req.body

  try {
    const output = await evalSnippet(lang, code)
    res.send({ output })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

export default app
