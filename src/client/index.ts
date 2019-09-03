import { createElement } from 'react'
import { render } from 'react-dom'
import { App } from './App'

function main() {
  render(createElement(App), document.getElementById('root'))
}

window.onload = main
