'use strict'

import fs from 'fs'
import os from 'os'
import path from 'path'

let electron: any
try {
  electron = require('electron')
} catch (e) {
  electron = null
}

function getElectronModule(name) {
  if (!electron) {
    return null
  }

  if (electron[name]) {
    return electron[name]
  }

  if (electron.remote) {
    return electron.remote[name]
  }

  return null
}

function getUserData() {
  var app = getElectronModule('app')
  if (!app) return null

  return app.getPath('userData')
}

function getElectronAppName() {
  const app = getElectronModule('app')
  if (!app) return null

  return app.getName()
}

function getAppName() {
  var name = getElectronAppName()
  if (name) {
    return name
  }

  try {
    name = loadPackageName()
    if (name) {
      return name
    }

    return console.warn('logger: unable to load the app name from package.json')
  } catch (e) {
    return console.warn('logger: ' + e.message)
  }
}

/**
 * Try to load main app package
 * @throws {Error}
 * @return {Object|null}
 */
function loadPackageName() {
  var packageFile

  try {
    if (require.main.filename) {
      packageFile = find(path.dirname(require.main.filename))
    }
  } catch (e) {
    packageFile = null
  }

  if (!packageFile && (process as any).resourcesPath) {
    packageFile = find(path.join((process as any).resourcesPath, 'app.asar'))
    var electronModule = path.join('node_modules', 'electron', 'package.json')
    if (packageFile && packageFile.indexOf(electronModule) !== -1) {
      packageFile = null
    }
  }

  if (!packageFile) {
    packageFile = find(process.cwd())
  }

  if (!packageFile) {
    return null
  }

  var content = fs.readFileSync(packageFile, 'utf-8')
  var packageData = JSON.parse(content)

  return packageData ? packageData.productName || packageData.name : false
}

function find(base: string) {
  let file: string

  while (!file) {
    var parent
    file = path.join(base, 'package.json')

    try {
      fs.statSync(file)
    } catch (e) {
      parent = path.resolve(base, '..')
      file = null
    }

    if (base === parent) {
      break
    }

    base = parent
  }

  return file
}

/**
 * Try to determine a platform-specific path where can write logs
 * @param {string} [appName] Used to determine the last part of a log path
 * @param {string} [fileName='log.log']
 * @return {string|boolean}
 */
export default function findElectronLogPath(
  appName: string,
  fileName: string = 'log.log'
): string | boolean {
  const userData = appName ? null : getUserData()
  appName = appName || getAppName()

  const homeDir = os.homedir ? os.homedir() : process.env.HOME

  let dir: string
  switch (process.platform) {
    case 'darwin': {
      dir = prepareDir(homeDir, 'Library', 'Logs', appName)
        .or(userData)
        .or(homeDir, 'Library', 'Application Support', appName).result
      break
    }

    case 'win32': {
      dir = prepareDir(userData)
        .or(process.env.APPDATA, appName)
        .or(homeDir, 'AppData', 'Roaming', appName).result
      break
    }

    default: {
      dir = prepareDir(userData)
        .or(process.env.XDG_CONFIG_HOME, appName)
        .or(homeDir, '.config', appName)
        .or(process.env.XDG_DATA_HOME, appName)
        .or(homeDir, '.local', 'share', appName).result
      break
    }
  }

  if (dir) {
    return path.join(dir, fileName)
  }

  return false
}

function prepareDir(...args: string[]) {
  let dirPath: string
  if (!this || this.or !== prepareDir || !this.result) {
    if (!args[0]) {
      return { or: prepareDir }
    }

    dirPath = path.join.apply(path, args)
    mkDir(dirPath)

    try {
      fs.accessSync(dirPath, fs.constants.W_OK)
    } catch (e) {
      return { or: prepareDir }
    }
  }

  return {
    or: prepareDir,
    result: (this ? this.result : false) || dirPath
  }
}

function mkDir(dirPath: string, base = '') {
  var dirs = dirPath.split(path.sep)
  var dir = dirs.shift()
  base = base + dir + path.sep

  try {
    fs.mkdirSync(base)
  } catch (e) {
    if (!fs.statSync(base).isDirectory()) {
      throw new Error(e)
    }
  }

  return !dirs.length || mkDir(dirs.join(path.sep), base)
}
