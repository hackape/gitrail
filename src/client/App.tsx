import React from 'react'
import * as ReactDOM from 'react-dom';
import RootRouter from './root-router';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHashHistory from 'history/createHashHistory';
import Home from './home/index'
import './App.css'
import store from './store';

const history = createHashHistory();
export default  function App (){
  return (<Provider store={store}>

             <RootRouter />

    </Provider>)
}

// const rootElement: Element | null = document.querySelector('#root');
// function render(Component: React.StatelessComponent) {
//   ReactDOM.render(
//     <Provider store={store}>
//         <ConnectedRouter history={history}>
//             <Component />
//         </ConnectedRouter>
//       </Provider>,
//       rootElement
//   );
// }

// render(RootRouter);
