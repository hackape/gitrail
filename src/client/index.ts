import { createElement } from 'react'
import { render } from 'react-dom';
// import RootRouter from './root-router';
import App from './App'

function main() {
  render(createElement(App), document.getElementById('root'))
}

window.onload = main
