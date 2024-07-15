import fs from 'node:fs'
import Docker from 'dockerode'

import { getConfig } from './evaluator/docker-configs.js'
import { randomId } from './utils.js'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export const evalSnippet = async (lang, code) => {
  const codeDir = 'code_eval_' + randomId()
  const codePath = codeDir + '/main.' + lang

  // Creating temp codedir for evaluation
  fs.mkdirSync(codeDir)
  fs.writeFileSync(codePath, code)

  // Createing and evaluation code in docker container
  const containerConfig = getConfig(lang, [`${process.cwd()}/${codeDir}:/code`])
  const container = await docker.createContainer(containerConfig)

  await container.start()

  let output = new Promise((resolve, reject) => {
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

  output = await output

  const exitCode = await container.inspect().then((data) => data.State.ExitCode)

  return { output, exitCode }
}
