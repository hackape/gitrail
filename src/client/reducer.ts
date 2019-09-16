import { AnyAction } from 'redux'
import produce from 'immer';
import * as types from './types';

export interface Notebook {
    path:string,
}
export interface INotebookPluginStore {
    loacalData: {
        [path:string]:Notebook,
    },
}

const initialState:INotebookPluginStore = {
    loacalData: {},
}

export default function (state: INotebookPluginStore = initialState, action: AnyAction) {
    let loacalData = {};
    switch (action.type) {
    case 'UPDPATE_CURRENT':
    case types.LOAD_FILE:
        loacalData = action.payload.loacalData;
        return { ...state, loacalData }
    case types.ADD_FILE:
        loacalData = action.payload.loacalData;
        return {
            ...state, loacalData,
        }
    default:
        return state
    }
}
