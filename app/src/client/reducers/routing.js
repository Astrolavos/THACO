import Immutable from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

export const initState = Immutable.fromJS({
  locationBeforeTransitions: null,
});

export default (state = initState, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: action.payload,
    });
  }
  return state;
};
