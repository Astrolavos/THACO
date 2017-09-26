import { fromJS, Record, List, Map } from 'immutable';
import { ACTIONS } from '../constants';

export const IPsRecord = new Record({
  isPending: false,
  ips: new List(),
  errors: new List(),
  domainReport: new List(),
});

//Stable version
export const initState = new IPsRecord();

export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.FETCHED_IPS: {
      return state
        .set('errors', new List())
        .set('ips', fromJS(action.response.ips))
        .set('isPending', false);
    }
    case ACTIONS.CLEAR_FETCHED_IPS: {
      return state
        .set('errors', new List())
        .set('ips', new List())
        .set('isPending', false);
    }
     case ACTIONS.FETCHED_DOMAIN_REPORT: {
      return state
        .set('errors', new List())
        .set('domainReport', fromJS(action.response.results));
    }
    default:
      return state;
  }
};
