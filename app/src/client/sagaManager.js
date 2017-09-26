import { take, fork, cancel } from 'redux-saga/effects';
import { treemapSaga } from './actions/treemap';
import { linksSaga } from './actions/links';
import { domainsSaga } from './actions/domains';
import { ipSaga,resolutionsSaga } from './actions/ip';
import { ipsSaga,DomainReportSaga } from './actions/ips';


const sagas = [
  treemapSaga,
  linksSaga,
  domainsSaga,
  ipSaga,
  resolutionsSaga,
  ipsSaga,
  DomainReportSaga,
];

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

function createAbortableSaga(saga) {
  if (process.env.NODE_ENV === 'development') {
    return function* main() {
      const sagaTask = yield fork(saga);
      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  }
  return saga;
}

const SagaManager = {
  startSagas(sagaMiddleware) {
    sagas.map(createAbortableSaga).forEach((saga) => sagaMiddleware.run(saga));
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    });
  },
};

export default SagaManager;
