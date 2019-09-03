const Path = require('path')
const { spawn } = require('child_process')

const rootDir = Path.resolve(__dirname, '..')
const binPath = rootDir + '/node_modules/.bin/'

const compileClient = spawn(
  binPath + 'webpack-dev-server',
  ['--config', './webpack.config.client.js'],
  {
    cwd: rootDir
  }
)
const compileElectron = spawn(
  binPath + 'webpack',
  ['-w', '--config', './webpack.config.electron.js'],
  {
    cwd: rootDir
  }
)
const runNodemon = spawn('nodemon')

compileClient.stdout.on('data', data => {
  console.log('[client]', data.toString())
})

compileClient.stderr.on('data', data => {
  console.error('[client]', data.toString())
})

compileElectron.stdout.on('data', data => {
  console.log('[electron]', data.toString())
})

compileElectron.stderr.on('data', data => {
  console.error('[electron]', data.toString())
})

runNodemon.stdout.on('data', data => {
  console.log('[nodemon]', data.toString())
})

runNodemon.stderr.on('data', data => {
  console.error('[nodemon]', data.toString())
})
