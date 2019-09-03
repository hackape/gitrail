type ILogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

type ILogFunction = (...args: any[]) => void

declare const enum SupportedLevels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly'
}

type ILogMessage = {
  data: any[]
  date: Date
  level: ILogLevel
  prefix?: string
  variables?: { [key: string]: string }
}

type IFormat = (msg: ILogMessage) => void

type IFOpenFlags = 'r' | 'r+' | 'rs+' | 'w' | 'wx' | 'w+' | 'wx+' | 'a' | 'ax' | 'a+' | 'ax+'

interface ITransport {
  (msg: ILogMessage): void

  /**
   * Messages with level lower than will be dropped
   */
  level: ILogLevel
}

interface IConsoleTransport extends ITransport {
  /**
   * String template of function for message serialization
   */
  format: IFormat | string
}

interface IFileTransport extends ITransport {
  /**
   * Determines a location of log file, something like
   * ~/.config/<app name>/log.log depending on OS. By default electron-log
   * reads this value from name or productName value in package.json. In most
   * cases you should keep a default value
   */
  appName?: string

  /**
   * Function which is called on log rotation. You can override it if you need
   * custom log rotation behavior. This function should remove old file
   * synchronously
   */
  archiveLog: (oldLogPath: string) => void

  /**
   * How much bytes were written since transport initialization
   */
  bytesWritten: number

  /**
   * The full log file path. I can recommend to change this value only if
   * you strongly understand what are you doing. If set, appName and fileName
   * options are ignored
   */
  file?: string

  /**
   * Filename without path, log.log by default
   */
  fileName: string

  /**
   * String template of function for message serialization
   */
  format: IFormat | string

  /**
   * Maximum size of log file in bytes, 1048576 (1mb) by default. When a log
   * file exceeds this limit, it will be moved to log.old.log file and the
   * current file will be cleared. You can set it to 0 to disable rotation
   */
  maxSize: number

  /**
   * Whether to write a log file synchronously. Default to true
   */
  sync: boolean

  /**
   * Options used when writing a file
   */
  writeOptions?: {
    /**
     * Default 'a'
     */
    flag?: IFOpenFlags

    /**
     * Default 0666
     */
    mode?: number

    /**
     * Default 'utf8'
     */
    encoding?: string
  }

  /**
   * Clear the current log file
   */
  clear(): void

  /**
   * Return full path of the current log file
   */
  findLogPath(appName?: string, fileName?: string): string

  /**
   * In most cases, you don't need to call it manually. Try to call only if
   * you change appName, file or fileName property, but it has no effect.
   */
  init(transp: any): void
}
