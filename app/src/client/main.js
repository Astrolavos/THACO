import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import App from './components/app';
import Treemap from './components/treemap/';
import About from './components/about';
import FindIp from './components/findIp';
import FindDomain from './components/findDomain';

ReactGA.initialize(process.env.NODE_ENV === 'production' ? 'UA-87914459-1' : 'UA-FAKE-ID');

function logPageView() {
  /* eslint no-undef: 0 */
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const Main = ({ history }) =>
  <Router history={history} onUpdate={logPageView}>
    <Route path="/" component={App}>
      <IndexRoute component={Treemap} />
      <Route path="/geo" component={Treemap} />
      <Route path="/as" component={Treemap} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/find-ip" component={FindIp} />
      <Route path="/find-domain" component={FindDomain} />
    </Route>
  </Router>;

Main.propTypes = {
  history: React.PropTypes.object,
};

export default Main;
