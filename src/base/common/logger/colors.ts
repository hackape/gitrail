const styles = {
  reset: { open: '\u001b[0m', close: '\u001b[0m' },
  bold: { open: '\u001b[1m', close: '\u001b[22m' },
  dim: { open: '\u001b[2m', close: '\u001b[22m' },
  italic: { open: '\u001b[3m', close: '\u001b[23m' },
  underline: { open: '\u001b[4m', close: '\u001b[24m' },
  inverse: { open: '\u001b[7m', close: '\u001b[27m' },
  hidden: { open: '\u001b[8m', close: '\u001b[28m' },
  strikethrough: { open: '\u001b[9m', close: '\u001b[29m' },
  black: { open: '\u001b[30m', close: '\u001b[39m' },
  red: { open: '\u001b[31m', close: '\u001b[39m' },
  green: { open: '\u001b[32m', close: '\u001b[39m' },
  yellow: { open: '\u001b[33m', close: '\u001b[39m' },
  blue: { open: '\u001b[34m', close: '\u001b[39m' },
  magenta: { open: '\u001b[35m', close: '\u001b[39m' },
  cyan: { open: '\u001b[36m', close: '\u001b[39m' },
  white: { open: '\u001b[37m', close: '\u001b[39m' },
  gray: { open: '\u001b[90m', close: '\u001b[39m' },
  grey: { open: '\u001b[90m', close: '\u001b[39m' },
  bgBlack: { open: '\u001b[40m', close: '\u001b[49m' },
  bgRed: { open: '\u001b[41m', close: '\u001b[49m' },
  bgGreen: { open: '\u001b[42m', close: '\u001b[49m' },
  bgYellow: { open: '\u001b[43m', close: '\u001b[49m' },
  bgBlue: { open: '\u001b[44m', close: '\u001b[49m' },
  bgMagenta: { open: '\u001b[45m', close: '\u001b[49m' },
  bgCyan: { open: '\u001b[46m', close: '\u001b[49m' },
  bgWhite: { open: '\u001b[47m', close: '\u001b[49m' },
  blackBG: { open: '\u001b[40m', close: '\u001b[49m' },
  redBG: { open: '\u001b[41m', close: '\u001b[49m' },
  greenBG: { open: '\u001b[42m', close: '\u001b[49m' },
  yellowBG: { open: '\u001b[43m', close: '\u001b[49m' },
  blueBG: { open: '\u001b[44m', close: '\u001b[49m' },
  magentaBG: { open: '\u001b[45m', close: '\u001b[49m' },
  cyanBG: { open: '\u001b[46m', close: '\u001b[49m' },
  whiteBG: { open: '\u001b[47m', close: '\u001b[49m' }
}

type IColors = {
  reset: (s: string) => string
  bold: (s: string) => string
  dim: (s: string) => string
  italic: (s: string) => string
  underline: (s: string) => string
  inverse: (s: string) => string
  hidden: (s: string) => string
  strikethrough: (s: string) => string
  black: (s: string) => string
  red: (s: string) => string
  green: (s: string) => string
  yellow: (s: string) => string
  blue: (s: string) => string
  magenta: (s: string) => string
  cyan: (s: string) => string
  white: (s: string) => string
  gray: (s: string) => string
  grey: (s: string) => string
  bgBlack: (s: string) => string
  bgRed: (s: string) => string
  bgGreen: (s: string) => string
  bgYellow: (s: string) => string
  bgBlue: (s: string) => string
  bgMagenta: (s: string) => string
  bgCyan: (s: string) => string
  bgWhite: (s: string) => string
  blackBG: (s: string) => string
  redBG: (s: string) => string
  greenBG: (s: string) => string
  yellowBG: (s: string) => string
  blueBG: (s: string) => string
  magentaBG: (s: string) => string
  cyanBG: (s: string) => string
  whiteBG: (s: string) => string
}

const tonedColors = ['yellow', 'red', 'green', 'blue', 'cyan', 'magenta', 'gray']
const tonedColorsCount = tonedColors.length

export const colors: IColors = Object.keys(styles).reduce(
  (acc, key) => {
    const { open, close } = styles[key]
    acc[key] = (s: string) => open + s + close
    return acc
  },
  {} as any
)

export function getHashedColorStr(s: string) {
  const hash = Math.abs(stringHash(s))
  const idx = hash % tonedColorsCount
  const colorName = tonedColors[idx]
  return colors[colorName](s)
}

function stringHash(s: string) {
  let hashVal = numberHash(149417, 0)
  for (let i = 0, length = s.length; i < length; i++) {
    hashVal = numberHash(s.charCodeAt(i), 0)
  }
  return hashVal
}

function numberHash(val: number, initialHashVal: number): number {
  return ((initialHashVal << 5) - initialHashVal + val) | 0 // hashVal * 31 + ch, keep as int32
}

export default colors
