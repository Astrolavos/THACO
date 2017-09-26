import React from 'react';
import { List } from 'immutable';
import Portal from 'react-portal';
import { pure } from 'recompose';

const styles = {
  position: 'fixed',
  top: '85px',
  left: 0,
  right: 0,
  margin: '25px',
  zIndex: 1000,
};

const Errors = pure(({ errors, close }) =>
  <Portal isOpened>
    <div style={styles}>
      <div
        className="alert alert-danger alert-dismissible fade in"
        role="alert"
      >
        <button
          onClick={close}
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
        </button>
        <h4>Oh snap! You got an error{errors.count() > 1 ? 's' : ''}!</h4>
        <ul>
          {errors.valueSeq().map(error =>
            <li key={error}>{error}</li>
          )}
        </ul>
      </div>
    </div>
  </Portal>
);

Errors.propTypes = {
  errors: React.PropTypes.instanceOf(List).isRequired,
  close: React.PropTypes.func.isRequired,
};

export default Errors;
