// Run snippet in another process. Return promise with status code, stdout and stderr

const exec = require('child_process').exec;

const R    = require('ramda')
const Task = require('data.task')

const validateSnippetResult = (code, signal, stderr) => code === 0 && !signal && stderr.length === 0

function runSnippet(timeout, { snippet, id }) {
  const child = exec('node')

  const stdout = []
  child.stdout.on('data', (data) => stdout.push(data))

  const stderr = []
  child.stderr.on('data', (data) => stderr.push(data))

  return new Task((reject, resolve) => {

    const t = setTimeout(() => {
      child.kill('SIGKILL')
    }, timeout)

    child.on('exit', (code, signal) => {
      clearTimeout(t)
      resolve({
        id,
        ok: validateSnippetResult(code, signal, stderr),
        code,
        signal,
        stdout,
        stderr
      })
    })

    child.stdin.write(snippet)
    child.stdin.end()
  })
}

module.exports = R.curry(runSnippet)
