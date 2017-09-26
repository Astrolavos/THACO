import { Record } from 'immutable';
import { ACTIONS } from '../constants';

const UiState = new Record({
  showMenu: false,
  showTreemap: false,
  showFindIOC:false,
});

export const initState = new UiState();

export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_MENU: {
      return state.set('showMenu', action.response);
    }
    case ACTIONS.TOGGLE_TREEMAP: {
      return state.set('showTreemap', action.response);
    }
     case ACTIONS.TOGGLE_FIND_IOC: {
      return state.set('showFindIOC', action.response);
    }
    default:
      return state;
  }
};
