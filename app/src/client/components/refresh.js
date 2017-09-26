import React from 'react';
import cx from 'classnames';
import { pure } from 'recompose';

const Refresh = pure(({ isPending, refresh }) =>
  <small onClick={refresh} style={{ cursor: 'pointer' }} title="Refresh">
    <i className={cx('fa', 'fa-refresh', 'fa', 'fa-fw', { 'fa-spin': isPending })} />
  </small>
);

Refresh.propTypes = {
  isPending: React.PropTypes.bool.isRequired,
  refresh: React.PropTypes.func.isRequired,
};

export default Refresh;
