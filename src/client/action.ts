import { createAction } from 'redux-actions';
import * as types from './types'


export const saveFile = createAction(types.SAVE_FILE);
export const loadFile = createAction(types.LOAD_FILE);
