import { fork, take } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { getIpReport, getResolutions} from '../api';
import fetchEntity from './common';

export const fetchIpReport = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_IP_REPORT_PENDING,
  ACTIONS.FETCHED_IP_REPORT_ERROR,
  ACTIONS.FETCHED_IP_REPORT,
  getIpReport
);

function* watchFetchIpReport() {
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_IP_REPORT);
    yield fork(fetchIpReport, data);
  }
}

export function* ipSaga() {
  yield [
    fork(watchFetchIpReport),
  ];
}


export const fetchResolutions = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_RESOLUTIONS_PENDING,
  ACTIONS.FETCHED_RESOLUTIONS_ERROR,
  ACTIONS.FETCHED_RESOLUTIONS,
  getResolutions
);

function* watchFetchResolutions() {
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_RESOLUTIONS);
    yield fork(fetchResolutions, data);
  }
}

export function* resolutionsSaga() {
  yield [
    fork(watchFetchResolutions),
  ];
}
