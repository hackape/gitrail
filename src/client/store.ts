import { createStore, Store } from 'redux'
import reducer from './reducer'

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
  }

export const store: Store = createStore(
    reducer
    );

export default store
