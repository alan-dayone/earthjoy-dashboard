import express from 'express'
import next from 'next'
import dotenv from 'dotenv'
// import proxy from 'http-proxy-middleware';
import { routes } from './routes'

dotenv.config()

const server = express()
const port = process.env.PORT

// server.use(
//   '/api',
//   proxy({
//     target: process.env.BASE_API_URL,
//     changeOrigin: true,
//   })
// );

async function startServer () {
  const nextApp = next({ dev: process.env.NODE_ENV !== 'production' })
  const handler = routes.getRequestHandler(nextApp)
  await nextApp.prepare()

  server.use(handler).listen(port, () => {
    console.info(`Server started at ${process.env.BASE_URL}`)
  })
}

startServer()
