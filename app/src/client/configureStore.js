import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { Map } from 'immutable';
import reducer from './reducers/index';
import sagaManager from './sagaManager';

function configureStore(initialState = new Map()) {
  // create saga middleware
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    routerMiddleware(browserHistory),
  ];

  const middleware = applyMiddleware.apply(this, middlewares);

  // add Redux Dev Tools if in browser & development
  let createStoreWithMiddleware;
  if (process.env.NODE_ENV === 'development') {
    createStoreWithMiddleware = compose(
      middleware,
      /* eslint-disable no-undef */
      (typeof window === 'object' && typeof window.devToolsExtension !== 'undefined') ?
        window.devToolsExtension() : f => f
      /* eslint-enable no-undef */
    );
  } else {
    createStoreWithMiddleware = compose(middleware);
  }

  const store = createStoreWithMiddleware(createStore)(reducer, initialState);

  // run sagas
  sagaManager.startSagas(sagaMiddleware);

  // enable hot reload when available
  if (module.hot) {
    // hot reload reducers
    module.hot.accept('./reducers/index', () => {
      store.replaceReducer(require('./reducers/index').default); // eslint-disable-line
    });

    // hot reload sagas
    module.hot.accept('./sagaManager', () => {
      sagaManager.cancelSagas(store);
      require('./sagaManager').default.startSagas(sagaMiddleware); // eslint-disable-line
    });
  }

  return store;
}

export default configureStore;
