import React from 'react'
import { Provider } from 'react-redux';
import Home from './home/index'
import './App.css'
import store from './store';

export function App() {
  return <Provider store={store}>
  <Home />
</Provider>
}
