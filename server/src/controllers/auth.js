import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '../utils/app-error.js'
import db from '../utils/prisma.js'
import { registerSchema, loginSchema } from '../schemas/user.js'

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  })
}

/**
 * Register new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body)
  const hash = bcrypt.hashSync(password)

  const emailTaken = await db.user.findUnique({ where: { email } })
  if (emailTaken) {
    throw new AppError('Email already exists', 400)
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  })

  const token = signToken(user.id, user.role)

  res.status(201).json({ token })
}

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)

  const user = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
    })
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      message: 'Invalid email or password',
    })
  }

  const token = signToken(user.id, user.role)

  res.status(200).json({ token })
}
