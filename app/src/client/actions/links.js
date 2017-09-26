import { fork, take, put, call } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { getLinks } from '../api';
import fetchEntity from './common';

export function* fetchLinks(data) {
  yield put({ type: ACTIONS.FETCHED_LINKS_PENDING });
  const response = yield call(getLinks);
  if (response && response.errors) {
    yield put({ type: ACTIONS.FETCHED_LINKS_ERROR, response });
  } else {
    yield put({ type: ACTIONS.FETCHED_LINKS, response });
    const links = response.links
      .filter(link => link.type === data.type)
      .sort((a, b) => a.day - b.day);
    const lastLink = links[links.length - 1];
    yield put({ type: ACTIONS.FETCH_TREEMAP, data: { id: data.id || lastLink.topId } });
  }
}

export const fetchJustLinks = fetchEntity.bind(
  null,
  ACTIONS.FETCHED_LINKS_PENDING,
  ACTIONS.FETCHED_LINKS_ERROR,
  ACTIONS.FETCHED_LINKS,
  getLinks
);

function* watchFetchLinks() {
  while (true) {
    const { data } = yield take(ACTIONS.FETCH_LINKS);
    yield fork(fetchLinks, data);
  }
}

function* watchFetchJustLinks() {
  while (true) {
    yield take(ACTIONS.FETCH_JUST_LINKS);
    yield fork(fetchJustLinks);
  }
}

export function* linksSaga() {
  yield [
    fork(watchFetchLinks),
    fork(watchFetchJustLinks),
  ];
}
