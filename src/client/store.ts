import { createStore, applyMiddleware, compose, combineReducers, Middleware, ReducersMapObject, Store } from 'redux'
import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();
import projectSaga from './saga'
import reducer from './reducer'
const middlewares: Middleware[] = [
    sagaMiddleware,
];
const pluginReducers: ReducersMapObject = {}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
  }
const composeEnhancers = compose;

export const store: Store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(...middlewares),
));

const projectTask = sagaMiddleware.run(projectSaga)
projectTask.done.catch((err:any) => console.error(err));

export default store
