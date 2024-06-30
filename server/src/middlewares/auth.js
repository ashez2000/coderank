import jwt from 'jsonwebtoken'
import { AppError } from '../utils/app-error.js'

export const authenticate = (req, res, next) => {
  const token = req.headers && req.headers.authorization

  if (!token) {
    console.log('Token undefined')
    throw new AppError('Unauthorized', 401)
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    console.log('Token malformed:', err.message)
    throw new AppError('Unauthorized', 401)
  }
}
