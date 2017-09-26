import React from 'react';
import Portal from 'react-portal';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Modal from '../modal';
import { formatDate } from '../../utils';
import '../../styles/legends.scss';

const sortAndFormat = (links, type) => {
  let url = '/';
  if (type === 2) url = '/geo';
  if (type === 3) url = '/as';
  return links
    .filter(link => link.get('type') === type)
    .sort((a, b) => b.get('day') - a.get('day'))
    .valueSeq()
    .map(link =>
      <li key={link.get('topId')}>
        <Link to={`${url}?id=${link.get('topId')}`}>
          {formatDate(link.get('day'))}
        </Link>
      </li>
    );
};

class Datepicker extends React.Component {

  static propTypes = {
    date: React.PropTypes.any,
    links: React.PropTypes.instanceOf(Immutable.List),
  };

  render() {
    const cog = (
      <span className="date">
        {formatDate(this.props.date || 'Date')}
      </span>
    );
    return (
      <Portal closeOnEsc openByClickOn={cog}>
        <Modal title="Select a date">
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <h4>IP</h4>
              <ul>{sortAndFormat(this.props.links, 1)}</ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4>GEO</h4>
              <ul>{sortAndFormat(this.props.links, 2)}</ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4>AS</h4>
              <ul>{sortAndFormat(this.props.links, 3)}</ul>
            </div>
          </div>
        </Modal>
      </Portal>
    );
  }

}

const mapStateToProps = state => ({
  links: state.getIn(['links', 'links']),
});

export default connect(mapStateToProps)(Datepicker);

