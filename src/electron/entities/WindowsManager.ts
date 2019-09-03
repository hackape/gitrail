import { ViewWindow } from './ViewWindow'
import { app } from 'electron'
const appPath = app.getAppPath()

export class WindowsManager {
  private _windows: ViewWindow[] = []

  public initialize() {
    this.renderDefaultWindow()
  }

  public activate() {
    this.renderDefaultWindow()
  }

  private renderDefaultWindow() {
    this.openViewWindow('dashboard')
  }

  register(win: ViewWindow) {
    this._windows.push(win)

    win.onClosed(() => {
      this._windows = this._windows.filter(w => w !== win)
    })
  }

  openViewWindow(type: IViewTypes) {
    this._openViewWindow({ type })
  }

  private _openViewWindow(viewConfig: Partial<IViewConfig>) {
    let { type, config, viewId } = viewConfig
    const defaultConfig = ViewWindow.viewWindowConfigs[type]

    if (!config) config = defaultConfig

    const win = new ViewWindow({
      type,
      viewId: viewId ? viewId : null,
      config
    })

    let url: string
    if (/^https?\:\/\//.test(__WP_RENDERER_HOST__)) {
      url = __WP_RENDERER_HOST__ + '#viewId=' + viewId
    } else {
      url = 'file://' + appPath + '/' + __WP_RENDERER_HOST__ + '#viewId=' + viewId
    }

    win.browserWindow.loadURL(url)
    this.register(win)
  }
}
