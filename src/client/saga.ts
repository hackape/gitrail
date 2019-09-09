import { select, takeEvery, takeLatest, put } from 'redux-saga/effects';
import { message, notification } from 'antd';
import _ from 'lodash';
// import dagDAO from '../dao/dag';
// import { dagSelector, layoutSelector } from '../selector/dag';
import { func } from 'prop-types';
import * as types from './types'
import { loadFile } from './action';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* loadsFile(){
    yield put(loadFile('ddd'));
}

export default function* projectSaga() {
    yield takeLatest(types.LOAD_FILE, loadsFile);
}
