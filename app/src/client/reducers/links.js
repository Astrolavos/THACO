import { fromJS, Record, List } from 'immutable';
import { ACTIONS } from '../constants';

export const LinksRecord = new Record({
  isPending: false,
  links: new List(),
  errors: new List(),
});

export const initState = new LinksRecord();

export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.FETCHED_LINKS: {
      return state
        .set('errors', new List())
        .set('links', fromJS(action.response.links))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_LINKS_ERROR: {
      return state
        .set('errors', fromJS(action.response.errors))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_LINKS_PENDING: {
      return state
        .set('errors', new List())
        .set('isPending', true);
    }
    case ACTIONS.CLEAR_LINKS_ERRORS: {
      return state
        .set('errors', new List())
        .set('isPending', true);
    }
    default:
      return state;
  }
};
