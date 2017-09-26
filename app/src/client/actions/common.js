import { put, call } from 'redux-saga/effects';

export default function* fetchEntity(pending, error, success, apiFn, data) {
  yield put({ type: pending });
  const response = yield call(apiFn, data);
  response.$data = data;
  if (response && response.errors) {
    yield put({ type: error, response });
  } else {
    yield put({ type: success, response });
  }
}
