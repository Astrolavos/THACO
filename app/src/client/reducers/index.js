import { combineReducers } from 'redux-immutable';
import treemap from './treemap';
import links from './links';
import routing from './routing';
import ui from './ui';
import domains from './domains';
import ips from './ips';

export default combineReducers({
  treemap,
  routing,
  ui,
  links,
  domains,
  ips,
});
