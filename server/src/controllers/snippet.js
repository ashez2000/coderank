import db from '../utils/prisma.js'
import { AppError } from '../utils/error.js'
import * as repo from '../repository/mod.js'

/**
 * Create new snippet
 * @route POST /api/snippets
 */
export const create = async (req, res) => {
  const curUserId = req.user.id

  // TODO: data validatation
  const { name, lang, code } = req.body

  const snippet = await db.snippet.create({
    data: {
      name,
      lang,
      code,
      userId: curUserId,
    },
  })

  res.status(201).json(snippet)
}

/**
 * Get snippets of user
 * @route GET /api/snippets
 */
export const find = async (req, res) => {
  const curUserId = req.user.id

  const snippets = await db.snippet.findMany({
    where: {
      userId: curUserId,
    },
  })

  res.status(200).json(snippets)
}

/**
 * Get snippet by Id
 * @route GET /api/snippets/:id
 */
export const findById = async (req, res) => {
  const curUserId = req.user.id

  const snippet = await db.snippet.findUnique({
    where: {
      id: req.params.id,
    },
  })

  if (!snippet) {
    return res.status(404).json({ message: 'Snippet Not Found' })
  }

  if (snippet.userId !== curUserId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  res.status(200).json(snippet)
}

/**
 * Remove snippet
 * @route DELETE /api/snippets/:id
 */
export const remove = async (req, res) => {
  const curUserId = req.user.id

  const snippet = await db.snippet.findUnique({
    where: {
      id: req.params.id,
    },
  })

  if (!snippet) {
    return res.status(404).json({ message: 'Snippet Not Found' })
  }

  if (snippet.userId !== curUserId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await db.snippet.delete({
    where: { id: snippet.id },
  })

  res.status(200).json(snippet)
}
