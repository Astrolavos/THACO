import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ACTIONS } from '../constants';
import { formatDate } from '../utils';
import Errors from './errors';

const getDates = links =>
  links
    .filter(link => link.get('type') === 1)
    .sort((a, b) => b.get('day') - a.get('day'));

class FindIp extends React.PureComponent {

  static propTypes = {
    links: React.PropTypes.any,
    errors: React.PropTypes.instanceOf(List).isRequired,
    isPending: React.PropTypes.bool.isRequired,
    fetchJustLinks: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchJustLinks();
  }

  render() {
    return (
      <div>
        {this.props.errors.count() > 0 &&
          <Errors errors={this.props.errors} close={this.props.clearErrors} />}
        <h1>Find IP</h1>
        <form method="get" action="/go-to-ip">
          <div className="form-group">
            <label htmlFor="day">Day</label>
            <select className="form-control" id="day" name="day">
              {getDates(this.props.links).valueSeq().map(day =>
                <option key={day} value={day.get('day')}>{formatDate(day.get('day'))}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ip">IP</label>
            <input type="text" className="form-control" id="ip" name="ip" placeholder="8.8.8.8 or 8.8.8 or 8.8 or 8" />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
        {this.props.location.search === '?msg=no' &&
          <p style={{ marginTop: '20px', color: 'darkred' }}>
            <strong>This IP and day is not in our database!</strong>
          </p>
        }
      </div>
    );
  }

}

const mapStateToProps = state => ({
  links: state.getIn(['links', 'links']),
  errors: state.getIn(['links', 'errors']),
  isPending: state.getIn(['links', 'isPending']),
});

const mapDispatchToProps = dispatch => ({
  fetchJustLinks: () => dispatch({ type: ACTIONS.FETCH_JUST_LINKS }),
  clearErrors: () => dispatch({ type: ACTIONS.CLEAR_LINKS_ERRORS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FindIp);
