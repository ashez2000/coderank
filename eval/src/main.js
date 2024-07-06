import http from 'node:http'
import app from './app.js'

const port = process.env.PORT || 3001
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`main: Listening on port:${port}`)
})
