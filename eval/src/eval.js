import fs from 'node:fs'
import { v4 as uuid } from 'uuid'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export const evalSnippet = async (lang, code) => {
  const id = uuid()
    .split('')
    .filter((i) => i !== '-')
    .join('')

  const codePath = 'code_eval_' + id
  fs.mkdirSync(codePath)
  fs.writeFileSync(codePath + '/main.' + lang, code)

  const containerConfig = {
    Image: 'python:3.9-slim',
    Cmd: ['python3', `/code/${codePath}/main.py`],
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      AutoRemove: true,
      Binds: [`${process.cwd()}/${codePath}:/code`],
    },
  }

  const container = await docker.createContainer(containerConfig)
  await container.start()

  return new Promise((resolve, reject) => {
    container.logs(
      { follow: true, stdout: true, stderr: true },
      (err, stream) => {
        if (err) {
          return reject(err)
        }

        let output = ''
        stream.on('data', (chunk) => {
          output += chunk.toString()
        })

        stream.on('end', () => {
          resolve(output)
        })
      }
    )
  })
}
