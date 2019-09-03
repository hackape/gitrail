import { app } from 'electron'
import { WindowsManager } from './entities/WindowsManager'

const windowsManager = new WindowsManager()

app.on('ready', () => windowsManager.initialize())
app.on('activate', () => {
  windowsManager.activate()
})
