import { IDisposable } from './lifecycle'

export class IntervalTimer implements IDisposable {
  private _token: any

  constructor() {
    this._token = -1
  }

  dispose(): void {
    this.cancel()
  }

  cancel(): void {
    if (this._token !== -1) {
      clearInterval(this._token)
      this._token = -1
    }
  }

  cancelAndSet(runner: () => void, interval: number): void {
    this.cancel()
    this._token = setInterval(() => {
      runner()
    }, interval)
  }
}
