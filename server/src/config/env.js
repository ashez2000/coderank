import 'dotenv/config'

const load = (name) => {
  const v = process.env[name]
  if (v == undefined) {
    throw new Error(`env: ${name} undefined`)
  }
  return v
}

export const PORT = load('PORT')
export const NODE_ENV = load('NODE_ENV')
