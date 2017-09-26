import { fromJS, Record, List } from 'immutable';
import { ACTIONS, COLOR_SCHEMES } from '../constants';

/* global localStorage */
const colorScheme = localStorage.getItem('colorScheme') || 0;
const scale = localStorage.getItem('scale') || 0;
const squareSize = localStorage.getItem('squareSize') || 0;
const squareColor = localStorage.getItem('squareColor') || 0;

export const TreemapRecord = new Record({
  treemap: null,
  day: null,
  namedPath: new List(),
  isPending: false,
  legendColorStart: COLOR_SCHEMES[colorScheme].start,
  legendColorEnd: COLOR_SCHEMES[colorScheme].end,
  scale,
  squareColor,
  squareSize,
  errors: new List(),
});

export const initState = new TreemapRecord();

export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.FETCHED_TREEMAP: {
      return state
        .set('errors', new List())
        .set('treemap', {
          children: fromJS(action.response.data.children),
          title: '',
        })
        .set('day', action.response.day)
        .set('namedPath', fromJS(action.response.data.parents))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_TREEMAP_ERROR: {
      return state
        .set('errors', fromJS(action.response.errors))
        .set('isPending', false);
    }
    case ACTIONS.FETCHED_TREEMAP_PENDING: {
      return state
        .set('errors', new List())
        .set('isPending', true);
    }
    case ACTIONS.CLEAR_TREEMAP_ERRORS: {
      return state
        .set('errors', new List());
    }
    case ACTIONS.SELECTED_SCHEME: {
      localStorage.setItem(
        'colorScheme',
        COLOR_SCHEMES.findIndex(s => s.start === action.data.scheme.start)
      );
      return state
        .set('legendColorStart', action.data.scheme.start)
        .set('legendColorEnd', action.data.scheme.end);
    }
    case ACTIONS.CHANGED_SCALE: {
      localStorage.setItem('scale', action.data.scale);
      return state.set('scale', action.data.scale);
    }
    case ACTIONS.CHANGED_SQUARE_SIZE: {
      localStorage.setItem('squareSize', action.data.squareSize);
      return state.set('squareSize', action.data.squareSize);
    }
    case ACTIONS.CHANGED_SQUARE_COLOR: {
      localStorage.setItem('squareColor', action.data.squareColor);
      return state.set('squareColor', action.data.squareColor);
    }
    default:
      return state;
  }
};
