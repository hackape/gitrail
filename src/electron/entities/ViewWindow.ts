import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { Disposable } from '~/base/common/lifecycle'
import { Emitter, Event } from '~/base/common/event'
import uuid from 'uuid/v4'

const viewWindowConfigs: { [viewType: string]: IViewWindowConfig } = {
  dashboard: {
    type: 'dashboard',
    width: 480,
    height: 800,
    singleton: true,
  },
  repo: {
    type: 'repo',
    width: 900,
    height: 540,
    singleton: false
  }
}

type IOptions = {
  type: IViewTypes
  viewId?: string
  config?: IViewWindowConfig
}

export class ViewWindow extends Disposable {
  static viewWindowConfigs = viewWindowConfigs

  public type: IViewTypes

  public viewId: string

  public windowId: number

  public config: IViewWindowConfig

  public browserWindow: BrowserWindow

  private readonly _onClosed: Emitter<any> = this._register(new Emitter<any>())
  public readonly onClosed: Event<ViewWindow> = this._onClosed.event

  constructor(options: IOptions) {
    super()
    const type = options.type
    this.type = type
    this.viewId = options.viewId || uuid()
    this.config = options.config ? { ...options.config, type } : { ...viewWindowConfigs[type] }
    this.open()
  }

  private createWindow(options: BrowserWindowConstructorOptions) {
    const browserWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
      },
      ...options,
    })

    browserWindow.on('closed', () => {
      this._onClosed.fire(this)
      this.dispose()
    })
    return browserWindow
  }

  public dispose() {
    super.dispose()
    // de-ref
    this.browserWindow = null
  }

  private open() {
    const { width, height } = this.config
    this.browserWindow = this.createWindow({ width, height })
    this.windowId = this.browserWindow.id
  }
}
