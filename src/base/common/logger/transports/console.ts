import { format, getColoredLevelText, getColoredPrefix } from '../format'

const _console = {
  context: console,
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.log,
  debug: console.debug,
  silly: console.log,
  log: console.log
}

export function consoleTransportFactory(level: ILogLevel = 'silly'): IConsoleTransport {
  transport.level = level
  transport.format = '[{h}:{i}:{s}.{ms}] {coloredLevel} {colordPrefix}{text}'

  return transport

  function transport(msg: ILogMessage) {
    msg = { ...msg }
    msg.variables = {
      coloredLevel: getColoredLevelText(msg.level),
      colordPrefix: msg.prefix ? getColoredPrefix(msg.prefix) + ' ' : ''
    }

    const text = format(msg, transport.format)
    consoleLog(msg.level, text)
  }
}

function consoleLog(level, args) {
  if (_console[level]) {
    _console[level].call(_console.context, args)
  } else {
    _console.log.call(_console.context, args)
  }
}
