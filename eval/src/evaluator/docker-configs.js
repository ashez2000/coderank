/**
 * Creates DockerConfig with (image, cmd, binds)
 * @param {string} image - Container image name
 * @param {Array<string>} cmd - Container cmd
 * @param {Array<string>} binds - Container volume binds
 */
const createDockerConfig = (image, cmd, binds) => ({
  Image: image,
  Cmd: cmd,
  AttachStdout: true,
  AttachStderr: true,
  HostConfig: {
    AutoRemove: true,
    Binds: binds,
  },
})

/** Returns docker config for given lang */
export const getConfig = (lang, binds) => {
  if (lang === 'py') {
    return createDockerConfig(
      'python:3.9-slim',
      ['python3', `/code/main.py`],
      binds
    )
  }

  if (lang === 'rs') {
    return createDockerConfig(
      'rust:slim',
      ['/bin/bash', '-c', 'rustc /code/main.rs -o /code/code && /code/code'],
      binds
    )
  }

  throw new Error(`Unsupported lang: ${lang}`)
}
