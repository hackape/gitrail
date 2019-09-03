type IViewWindowConfig = {
  type: IViewTypes
  width: number
  height: number
  singleton?: boolean
}

type IViewConfig = {
  type: IViewTypes
  viewId: string
  windowId: number
  config: any
  singleton: boolean
}

type IViewTypes =
  | 'dashboard'
  | 'repo'