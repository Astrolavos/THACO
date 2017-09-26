import { fork, take, cancel, call } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { getDomains, getBlacklistedDomains, getInfo, getNewDomains } from '../api';
import fetchEntity from './common';

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const DEBOUNCE_DELAY = 200;

export const fetchDomains = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_DOMAINS_PENDING,
  ACTIONS.FETCHED_DOMAINS_ERROR,
  ACTIONS.FETCHED_DOMAINS,
  getDomains
);

export const fetchNewDomains = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_DOMAINS_PENDING,
  ACTIONS.FETCHED_DOMAINS_ERROR,
  ACTIONS.FETCHED_NEW_DOMAINS,
  getNewDomains
);

export const fetchBlacklistedDomains = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_DOMAINS_PENDING,
  ACTIONS.FETCHED_DOMAINS_ERROR,
  ACTIONS.FETCHED_BLACKLISTED_DOMAINS,
  getBlacklistedDomains
);

export const fetchInfo = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_DOMAINS_PENDING,
  ACTIONS.FETCHED_DOMAINS_ERROR,
  ACTIONS.FETCHED_INFO,
  getInfo
);

function* debounceFetchDomains(data) {
  yield call(delay, DEBOUNCE_DELAY);
  yield* fetchDomains(data);
}

function* debounceFetchNewDomains(data) {
  yield call(delay, DEBOUNCE_DELAY);
  yield* fetchNewDomains(data);
}

function* debounceFetchBlacklistedDomains(data) {
  yield call(delay, DEBOUNCE_DELAY);
  yield* fetchBlacklistedDomains(data);
}

function* debounceFetchInfo(data) {
  yield call(delay, DEBOUNCE_DELAY);
  yield* fetchInfo(data);
}

function* watchFetchDomains() {
  let lastTask;
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_DOMAINS);
    if (lastTask) {
      yield cancel(lastTask); // the last event wins, other dies...
    }
    lastTask = yield fork(debounceFetchDomains, data);
  }
}

function* watchFetchNewDomains() {
  let lastTask;
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_NEW_DOMAINS);
    if (lastTask) {
      yield cancel(lastTask); // the last event wins, other dies...
    }
    lastTask = yield fork(debounceFetchNewDomains, data);
  }
}

function* watchFetchBlacklistedDomains() {
  let lastTask;
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_BLACKLISTED_DOMAINS);
    if (lastTask) {
      yield cancel(lastTask); // the last event wins, other dies...
    }
    lastTask = yield fork(debounceFetchBlacklistedDomains, data);
  }
}

function* watchFetchInfo() {
  let lastTask;
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_INFO);
    if (lastTask) {
      yield cancel(lastTask); // the last event wins, other dies...
    }
    lastTask = yield fork(debounceFetchInfo, data);
  }
}

export function* domainsSaga() {
  yield [
    fork(watchFetchDomains),
    fork(watchFetchNewDomains),
    fork(watchFetchBlacklistedDomains),
    fork(watchFetchInfo),
  ];
}
