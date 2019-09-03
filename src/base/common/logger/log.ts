import { ILogger } from './index'

const levels: ILogLevel[] = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
export function createLogFn(ctx: ILogger, level: ILogLevel) {
  const transports = filterTransportsByLevel(ctx, level)

  return function log(...data: any[]) {
    const msg: ILogMessage = {
      data: data,
      date: new Date(),
      level: level,
      prefix: ctx.prefix
    }

    for (const k in transports) {
      if (!transports.hasOwnProperty(k) || typeof transports[k] !== 'function') {
        continue
      }

      transports[k](msg)
    }
  }
}

function filterTransportsByLevel(ctx: ILogger, level: ILogLevel) {
  const transports = ctx.transports

  const filtered = {}

  for (const i in transports) {
    if (!transports.hasOwnProperty(i)) continue
    if (!transports[i]) continue
    if (!compareLevels(levels, transports[i].level, level)) continue

    filtered[i] = transports[i]
  }

  return filtered
}

function compareLevels(levels: ILogLevel[], passLevel: ILogLevel, checkLevel: ILogLevel) {
  const pass = levels.indexOf(passLevel)
  const check = levels.indexOf(checkLevel)
  if (check === -1 || pass === -1) {
    return true
  }

  return check <= pass
}
