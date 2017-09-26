import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Main from './main';
import configureStore from './configureStore';

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.get('routing').toJS(),
});

/* eslint-disable no-undef */
const rootEl = document.getElementById('app-root');
/* eslint-enable no-undef */
ReactDOM.render(<Provider store={store}><Main history={history} /></Provider>, rootEl);

if (module.hot) {
  module.hot.accept('./main', () => {
    const NextApp = require('./main').default; // eslint-disable-line
    ReactDOM.render(<Provider store={store}><NextApp history={history} /></Provider>, rootEl);
  });
}
