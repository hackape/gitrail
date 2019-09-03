import util from 'util'
import { colors, getHashedColorStr } from './colors'
export function format(msg: ILogMessage, formatter: string | ((msg: ILogMessage) => string)) {
  if (typeof formatter === 'function') {
    return formatter(msg)
  }

  const date = new Date(msg.date || Date.now())
  const variables = msg.variables
  let result = formatter

  if (variables) {
    for (let key in variables) {
      if (!variables.hasOwnProperty(key)) continue
      result = result.replace('{' + key + '}', variables[key])
    }
  }

  result = result
    .replace('{level}', msg.level)
    .replace('{y}', String(date.getFullYear()))
    .replace('{m}', pad(date.getMonth() + 1))
    .replace('{d}', pad(date.getDate()))
    .replace('{h}', pad(date.getHours()))
    .replace('{i}', pad(date.getMinutes()))
    .replace('{s}', pad(date.getSeconds()))
    .replace('{ms}', pad(date.getMilliseconds(), 3))
    .replace('{z}', formatTimeZone(date.getTimezoneOffset()))
    .replace('{text}', stringifyArray(msg.data))

  return result
}

export function stringifyArray(data) {
  data = data.map(stringifyObject)

  if (util.formatWithOptions) {
    return util.formatWithOptions.apply(util, [{ getters: true }].concat(data))
  }

  return util.format.apply(util, data)
}

export function stringifyObject(data) {
  if (typeof data === 'function') {
    return data.toString()
  }

  if (data instanceof Error) {
    return data.stack
  }

  return data
}

export function pad(number, zeros = 2) {
  return (new Array(zeros + 1).join('0') + number).substr(-zeros, zeros)
}

export function formatTimeZone(minutesOffset) {
  const m = Math.abs(minutesOffset)
  return (minutesOffset >= 0 ? '-' : '+') + pad(Math.floor(m / 60)) + ':' + pad(m % 60)
}

export function getColoredLevelText(level: ILogLevel) {
  switch (level) {
    case SupportedLevels.error:
      return colors.bgRed(level)

    case SupportedLevels.warn:
      return colors.bgYellow(level)

    case SupportedLevels.info:
      return colors.bgBlue(level)

    case SupportedLevels.verbose:
      return colors.bgCyan(level)

    case SupportedLevels.debug:
      return colors.bgMagenta(level)

    case SupportedLevels.silly:
      return colors.bgWhite(colors.black(level))
  }
}

export function getColoredPrefix(prefix: string) {
  return getHashedColorStr(prefix)
}
