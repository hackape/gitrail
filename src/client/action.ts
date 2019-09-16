import { createAction } from 'redux-actions';
import * as types from './types'

export const addFile = createAction(types.ADD_FILE);
export const loadFile = createAction(types.LOAD_FILE);
