import React from 'react';
import { pure } from 'recompose';
import Navbar from './navbar';

import '../styles/main.less';
import '../../../node_modules/font-awesome/less/font-awesome.less';
import '../../../node_modules/font-awesome/fonts/fontawesome-webfont.eot';
import '../../../node_modules/font-awesome/fonts/fontawesome-webfont.svg';
import '../../../node_modules/font-awesome/fonts/fontawesome-webfont.ttf';
import '../../../node_modules/font-awesome/fonts/fontawesome-webfont.woff';
import '../../../node_modules/font-awesome/fonts/fontawesome-webfont.woff2';

const App = pure(({ children, location }) =>
  <div>
    <Navbar location={location} />
    <div className="container" style={{ marginTop: '70px' }}>
      {children}
      <hr />
      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        Active DNS Project © 2016 <a href="http://astrolavos.gatech.edu/">Astrolavos</a>,{' '}
        <a href="http://www.gatech.edu/">Georgia Institute of Technology</a>
      </div>
    </div>
  </div>
);

App.propTypes = {
  children: React.PropTypes.any,
  location: React.PropTypes.object,
};

export default App;
