import { v4 as uuid } from 'uuid'

export const randomId = () =>
  uuid()
    .split('')
    .filter((i) => i !== '-')
    .join('')
