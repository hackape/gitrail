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
    let path = ''
    switch (action.type) {
    case 'UPDPATE_CURRENT':
    case types.LOAD_FILE:
        // path = action.payload.path
        // const { current } = action.payload
        // return produce(state, (draftState) => {
        //     draftState.notebooks[path] = { ...draftState.notebooks[path], ...current }
        // })
        console.log('hhhhhh');
        return { ...state }
    case 'NEW_FILE_DIALOG':
        return {
            ...state, showNewFileDialog:action.payload,
        }
    default:
        return state
    }
}
