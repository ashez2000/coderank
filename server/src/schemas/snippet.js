import { z } from 'zod'

export const snippetCreateSchema = z.object({
  name: z.string(),
  lang: z.enum(['py', 'rs']),
  code: z.string(),
})
