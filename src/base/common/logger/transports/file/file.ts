import fs from 'fs'
import { EOL } from 'os'
import path from 'path'
import findLogPath from './findElectronLogPath'
import { format } from '../../format'

export function fileTransportFactory(level: ILogLevel = 'silly'): IFileTransport {
  transport.level = level
  transport.appName = null
  transport.bytesWritten = 0
  transport.file = null
  transport.fileSize = null
  transport.fileName = 'log.log'
  transport.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {prefix}{text}'
  transport.maxSize = 1024 * 1024
  transport.sync = false
  transport.archiveLog = archiveLog
  transport.writeOptions = {
    flag: 'a' as const,
    mode: 0o666, // base10=438
    encoding: 'utf8'
  }

  transport.clear = clear
  transport.findLogPath = findCurrentLogPath.bind(null, transport)
  transport.init = init

  return transport

  function transport(msg: ILogMessage) {
    msg = { ...msg }
    msg.variables = {
      prefix: msg.prefix ? `[${msg.prefix}] ` : ''
    }

    if (!transport.file || transport.fileSize === null) {
      init(transport)
    }

    var needLogRotation =
      transport.maxSize > 0 && transport.fileSize + transport.bytesWritten > transport.maxSize

    if (needLogRotation) {
      transport.archiveLog(transport.file)
      init(transport)
    }

    var text = format(msg, transport.format)
    write(text + EOL, transport)
  }

  function init(transp) {
    transp = transp || transport

    transp.file = findCurrentLogPath(transp)

    if (!transp.file) {
      transp.level = false
      logConsole('Could not set a log file')
      return
    }

    try {
      transp.fileSize = fs.statSync(transp.file).size
    } catch (e) {
      transp.fileSize = 0
    }

    transp.bytesWritten = 0
  }

  function write(text, transp) {
    if (transp.sync) {
      try {
        fs.writeFileSync(transp.file, text, transp.writeOptions)
        incCounter(text, transp)
      } catch (e) {
        logConsole("Couldn't write to " + transp.file, e)
      }
    } else {
      fs.writeFile(transp.file, text, transp.writeOptions, function(e) {
        if (e) {
          logConsole("Couldn't write to " + transp.file, e)
        } else {
          incCounter(text, transp)
        }
      })
    }
  }

  function incCounter(text, transp) {
    transp.bytesWritten += Buffer.byteLength(text, transp.writeOptions.encoding)
  }

  function archiveLog(file) {
    var info = path.parse(file)
    try {
      fs.renameSync(file, path.join(info.dir, info.name + '.old' + info.ext))
    } catch (e) {
      logConsole('Could not rotate log', e)
    }
  }

  function clear() {
    try {
      fs.unlinkSync(transport.file)
    } catch (e) {
      logConsole('Could not clear log', e)
    }
  }

  function findCurrentLogPath(transp) {
    return transp.file || findLogPath(transp.appName, transp.fileName)
  }

  function logConsole(message: string, error?: any) {
    var data = ['logger.transports.file: ' + message]

    if (error) {
      data.push(error)
    }

    const msg = {
      data: data,
      date: new Date(),
      level: 'warn' as const
    }

    var text = format(msg, transport.format)
    console.warn(text)
  }
}
