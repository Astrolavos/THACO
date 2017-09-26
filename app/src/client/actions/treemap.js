import { fork, take } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { getTreemap } from '../api';
import fetchEntity from './common';

export const fetchTreemap = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_TREEMAP_PENDING,
  ACTIONS.FETCHED_TREEMAP_ERROR,
  ACTIONS.FETCHED_TREEMAP,
  getTreemap
);

function* watchFetchTreemap() {
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_TREEMAP);
    yield fork(fetchTreemap, data);
  }
}

export function* treemapSaga() {
  yield [
    fork(watchFetchTreemap),
  ];
}
