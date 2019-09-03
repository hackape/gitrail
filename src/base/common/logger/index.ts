/// <reference path="./index.d.ts" />

type ILoggerOptions = {
  prefix?: string
  level?: ILogLevel
  transports?: {
    file?: ILogLevel
    console?: ILogLevel
  }
}

export interface ILogger {
  prefix?: string
  create: (options: ILoggerOptions) => ILogger
  bind: ({ prefix: string }) => ILogger
  transports: {
    console?: IConsoleTransport
    file?: IFileTransport
    [key: string]: ITransport
  }

  error: ILogFunction
  warn: ILogFunction
  info: ILogFunction
  verbose: ILogFunction
  debug: ILogFunction
  silly: ILogFunction
}

import { createLogFn } from './log'
import { consoleTransportFactory } from './transports/console'
import { fileTransportFactory } from './transports/file'

const transportsFactories = {
  console: consoleTransportFactory,
  file: fileTransportFactory
}

export function createLogger(options: ILoggerOptions) {
  const ctx: ILogger = {} as any

  ctx.create = createLogger
  ctx.bind = ({ prefix }) => {
    return createLogger({ ...options, prefix })
  }

  ctx.prefix = options.prefix

  let transpOpt: any
  if (options.transports) {
    transpOpt = options.transports
  } else {
    const globalLogLevel = options.level || 'silly'
    transpOpt = Object.keys(transportsFactories).reduce((acc, key) => {
      acc[key] = globalLogLevel
      return acc
    }, {})
  }

  ctx.transports = Object.keys(transpOpt).reduce((acc, key) => {
    const factory = transportsFactories[key]
    if (typeof factory === 'function') {
      acc[key] = factory(transpOpt[key])
    }
    return acc
  }, {})

  ctx.error = createLogFn(ctx, 'error')
  ctx.warn = createLogFn(ctx, 'warn')
  ctx.info = createLogFn(ctx, 'info')
  ctx.verbose = createLogFn(ctx, 'verbose')
  ctx.debug = createLogFn(ctx, 'debug')
  ctx.silly = createLogFn(ctx, 'silly')

  return ctx
}
