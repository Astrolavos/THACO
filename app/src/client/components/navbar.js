import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pure } from 'recompose';
import cx from 'classnames';
import { ACTIONS } from '../constants';

const isTreemapActive = location => {
  if (location.pathname === '/as') return true;
  if (location.pathname === '/geo') return true;
  if (location.pathname === '/') return true;
  return false;
};

const isFindIOCActive = location => {
  if (location.pathname === '/find-ip') return true;
  if (location.pathname === '/find-domain') return true;
  return false;
};

const Navbar = pure(({ showMenu, showHideMenu, showTreemap, showHideTreemap, showFindIOC, showHideFindIOC, location }) =>
  <div>
    <nav className="navbar navbar-custom navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            onClick={() => showHideMenu(!showMenu)}
            type="button"
            className="navbar-toggle collapsed"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a className="navbar-brand" href="https://www.activednsproject.org/">
            Active DNS Project
          </a>
        </div>
        <div id="navbar" className={cx('navbar-collapse', 'collapse', { in: showMenu })}>
          <ul className="nav navbar-nav">
            <li><a href="https://www.activednsproject.org/statistics.html">Statistics</a></li>
            <li><a href="https://www.activednsproject.org/combosquatting.html">Combosquatting</a></li>
            <li className="active"><a href="http://ipviz.gtisc.gatech.edu">Open Source Threat Console</a></li>
            <li><a href="https://www.activednsproject.org/about.html">About</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <nav
      className="navbar navbar-default navbar-static-top"
      style={{ top: '50px', marginBottom: 0 }}
    >
      <div className="container">
        <ul className="nav navbar-nav">
          <li className={cx('dropdown', { open: showTreemap, active: isTreemapActive(location) })}>
            <a
              href="#"
              className="dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => showHideTreemap(!showTreemap)}
            >
              Grouping options <span className="caret" />
            </a>
            <ul className="dropdown-menu" onClick={() => showHideTreemap(false)}>
              <li className={cx({ active: location.pathname === '/' })}>
                <Link to={'/'}>IP space</Link>
              </li>
              <li className={cx({ active: location.pathname === '/geo' })}>
                <Link to={'/geo'}>Geo</Link>
              </li>
              <li className={cx({ active: location.pathname === '/as' })}>
                <Link to={'/as'}>Autonomous systems</Link>
              </li>
            </ul>
          </li>

           <li className={cx('dropdown', { open: showFindIOC, active: isFindIOCActive(location) })}>
            <a
              href="#"
              className="dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => showHideFindIOC(!showFindIOC)}
            >
              Find IOCs <span className="caret" />
            </a>
            <ul className="dropdown-menu" onClick={() => showHideFindIOC(false)}>
              <li className={cx({ active: location.pathname === '/find-ip' })}>
                <Link to={'/find-ip'}>Find IP</Link>
              </li>
              <li className={cx({ active: location.pathname === '/find-domain' })}>
                <Link to={'/find-domain'}>Find Domain</Link>
              </li>
            </ul>
          </li>

     


          <li className={cx({ active: location.pathname === '/feedback' })}>
            <Link to="/feedback">Feedback</Link>
          </li>
          <li className={cx({ active: location.pathname === '/privacy-policy' })}>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li className={cx({ active: location.pathname === '/about' })}>
            <Link to="/about">Project Description</Link>
          </li>
          <li className={cx({ active: location.pathname === '/contact' })}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
);

const mapStateToProps = state => ({
  showMenu: state.getIn(['ui', 'showMenu']),
  showTreemap: state.getIn(['ui', 'showTreemap']),
  showFindIOC: state.getIn(['ui', 'showFindIOC']),
});

const mapDispatchToProps = dispatch => ({
  showHideMenu: response => dispatch({ type: ACTIONS.TOGGLE_MENU, response }),
  showHideTreemap: response => dispatch({ type: ACTIONS.TOGGLE_TREEMAP, response }),
  showHideFindIOC: response => dispatch({ type: ACTIONS.TOGGLE_FIND_IOC, response }),
});

Navbar.propTypes = {
  showMenu: React.PropTypes.bool.isRequired,
  showHideMenu: React.PropTypes.func.isRequired,
  showTreemap: React.PropTypes.bool.isRequired,
  showHideTreemap: React.PropTypes.func.isRequired,
  showFindIOC: React.PropTypes.bool.isRequired,
  showHideFindIOC: React.PropTypes.func.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
