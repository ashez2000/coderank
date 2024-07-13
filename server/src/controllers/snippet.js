import axios from 'axios'

import * as env from '../config/env.js'
import db from '../utils/prisma.js'

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

/**
 * Evaluate snippet
 * @route POST /api/snippets/:id
 */
export const evalSnippet = async (req, res) => {
  const userId = req.user.id
  const snippetId = req.params.id

  const snippet = await db.snippet.findUnique({ where: { id: snippetId } })
  if (!snippet) {
    throw new AppError('Snippet Not Found', 404)
  }

  if (snippet.userId !== userId) {
    throw new AppError('Unauthorized', 403)
  }

  try {
    const { data } = await axios.post(env.EVAL_URL + '/eval', {
      lang: snippet.lang,
      code: snippet.code,
    })

    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error evaluating code snippet' })
  }
}
