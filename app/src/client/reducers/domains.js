import { fromJS, Record, List, Map } from 'immutable';
import { ACTIONS } from '../constants';

export const DomainsRecord = new Record({
  isPending: false,
  countDomains: 0,
  countBlacklistedDomains: 0,
  countNewDomains: 0,
  geo: new Map(),
  ipReport: new Map(),
  resolutions: new Map(),
  domains: new List(),
  errors: new List(),
});

export const initState = new DomainsRecord();

export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.FETCHED_DOMAINS: {
      return state
        .set('errors', new List())
        .set('domains', fromJS(action.response.domains))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_NEW_DOMAINS: {
      return state
        .set('errors', new List())
        .set('domains', fromJS(action.response.new))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_BLACKLISTED_DOMAINS: {
      return state
        .set('errors', new List())
        .set('domains', fromJS(action.response.blacklisted))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_INFO: {
      return state
        .set('errors', new List())
        .set('geo', fromJS(action.response.geo))
        .set('countDomains', fromJS(action.response.countAllDomains))
        .set('countBlacklistedDomains', fromJS(action.response.countBlacklistedDomains))
        .set('countNewDomains', fromJS(action.response.countNewDomains))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_IP_REPORT_ERROR:
    case ACTIONS.FETCHED_DOMAINS_ERROR: {
      return state
        .set('errors', fromJS(action.response.errors))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_DOMAINS_PENDING: {
      return state
        .set('errors', new List())
        .set('isPending', true);
    }
    case ACTIONS.FETCHED_IP_REPORT: {
      return state
        .set('errors', new List())
        .set('ipReport', fromJS(action.response));
    }
    case ACTIONS.FETCHED_RESOLUTIONS: {
      return state
        .set('errors', new List())
        .set('resolutions', fromJS(action.response));
    }
    default:
      return state;
  }
};
