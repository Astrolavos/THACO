import { fork, take, cancel, call } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { getIPs, getDomainReport } from '../api';
import fetchEntity from './common';

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const DEBOUNCE_DELAY = 200;

export const fetchIPs = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_IPS_PENDING,
  ACTIONS.FETCHED_IPS_ERROR,
  ACTIONS.FETCHED_IPS,
  getIPs
);

function* debounceFetchIPs(data) {
  yield call(delay, DEBOUNCE_DELAY);
  yield* fetchIPs(data);
}

function* watchFetchIPs() {
  let lastTask;
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_IPS);
    if (lastTask) {
      yield cancel(lastTask); // the last event wins, other dies...
    }
    lastTask = yield fork(debounceFetchIPs, data);
  }
}

export function* ipsSaga() {
  yield [
    fork(watchFetchIPs),
  ];
}


export const fetchDomainReport = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_DOMAIN_REPORT_PENDING,
  ACTIONS.FETCHED_DOMAIN_REPORT_ERROR,
  ACTIONS.FETCHED_DOMAIN_REPORT,
  getDomainReport
);

function* watchFetchDomainReport() {
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_DOMAIN_REPORT);
    yield fork(fetchDomainReport, data);
  }
}

export function* DomainReportSaga() {
  yield [
    fork(watchFetchDomainReport),
  ];
}

