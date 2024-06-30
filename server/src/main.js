import 'dotenv/config'

import http from 'node:http'

import * as env from './config/env.js'
import app from './app.js'

const server = http.createServer(app)

server.listen(env.PORT, () => {
  console.log(`main: Listening on port:${env.PORT} (${env.NODE_ENV})`)
})
