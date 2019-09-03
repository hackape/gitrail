type ITrafficControlOptions = {
  interval?: number
  backoff?: number
  maxRetry?: number
  logger?: {
    log(...args: any): void
    error(...arg: any): void
  }
}

class TrafficControl {
  static defaultOptions: ITrafficControlOptions = {
    interval: 0,
    backoff: 500
  }

  public readonly options: ITrafficControlOptions
  private readonly _disabled: boolean
  private readonly _interval: number
  private readonly _backoff: number
  private readonly _maxRetry: number
  private readonly _logger: any

  private _prevLap: number
  private _curBackoff: number

  constructor(options?: ITrafficControlOptions) {
    if (!options) {
      this._disabled = true
    }

    this.options = Object.assign({}, TrafficControl.defaultOptions, options)
    const { interval, backoff, maxRetry, logger } = this.options
    this._interval = interval
    this._backoff = backoff
    this._logger = logger
    this._maxRetry = maxRetry

    this._curBackoff = backoff
  }

  private sleep(ms: number) {
    return new Promise(r => {
      setTimeout(r, ms)
    })
  }

  wait() {
    if (this._disabled || !this._prevLap) return
    const now = Date.now()
    const elapse = now - this._prevLap
    if (elapse > this._interval) return
    return this.sleep(this._interval - elapse)
  }

  lap() {
    this._curBackoff = this._backoff
    if (this._disabled) return
    this._prevLap = Date.now()
  }

  backoff(err: Error) {
    if (this._logger && this._logger.error) this._logger.error(err)
    if (this._maxRetry) {
      if (this._curBackoff >= this._maxRetry * this._backoff) throw err
    }
    this._prevLap = null
    try {
      return this.sleep(this._curBackoff)
    } finally {
      this._curBackoff *= 2
    }
  }
}

export function fromPromiseFactory<T>(factory: () => Promise<T>, options?: ITrafficControlOptions) {
  async function* generator() {
    const flow = new TrafficControl(options)

    let value: T
    while (true) {
      try {
        await flow.wait()
        value = await factory()
        flow.lap()
      } catch (err) {
        await flow.backoff(err)
        continue
      }

      yield value
    }
  }

  return generator()
}

type IObserver<T> = {
  closed?: boolean
  next?: (value: T) => void
  error?: (err: any) => void
  complete?: () => void
}

function normalizeObserver<T>(_observer: (value: T) => void | IObserver<T>): IObserver<T> {
  if (typeof _observer !== 'function') return _observer
  return { next: _observer }
}

function _drive<T>(asyncIterator: AsyncIterableIterator<T>, observer: IObserver<T>, signal: any) {
  if (signal.terminated) return
  const iterator = asyncIterator.next()
  iterator.then(
    res => {
      observer.next(res.value)
      if (!res.done) {
        _drive(asyncIterator, observer, signal)
      } else {
        if (observer.complete) observer.complete()
      }
    },
    e => {
      if (observer.error) observer.error(e)
    }
  )
}

export function observe<T>(
  asyncIterator: AsyncIterableIterator<T>,
  observer: (v: T) => void | IObserver<T>
) {
  const _observer = normalizeObserver(observer)
  const signal = { terminated: false }
  const disposer = () => {
    signal.terminated = true
  }
  disposer.dispose = () => disposer

  _drive(asyncIterator, _observer, signal)

  return disposer
}
