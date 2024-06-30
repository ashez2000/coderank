import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import * as snippet from '../controllers/snippet.js'

const router = Router()

router.use(authenticate)

router.get('/', snippet.find)
router.post('/', snippet.create)
router.get('/:id', snippet.findById)
router.delete('/:id', snippet.remove)

export default router
