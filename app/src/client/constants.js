import keyMirror from 'keymirror';

export const API_URL = '/api/v1';

export const DEFAULT_DAY = '20160415';

const MAIN_ACTIONS = keyMirror({
  CHANGED_SCALE: null,
  CHANGED_SQUARE_COLOR: null,
  CHANGED_SQUARE_SIZE: null,
  CLEAR_LINKS_ERRORS: null,
  CLEAR_TREEMAP_ERRORS: null,
  CLEAR_FETCHED_IPS: null,
  FETCH_BLACKLISTED_DOMAINS: null,
  FETCHED_BLACKLISTED_DOMAINS: null,
  FETCH_DOMAINS: null,
  FETCHED_DOMAINS: null,
  FETCHED_DOMAINS_PENDING: null,
  FETCHED_DOMAINS_ERROR: null,
  FETCH_IPS: null,
  FETCHED_IPS: null,
  FETCHED_IPS_PENDING: null,
  FETCHED_IPS_ERROR: null,
  FETCH_INFO: null,
  FETCH_IP_REPORT: null,
  FETCHED_IP_REPORT: null,
  FETCHED_IP_REPORT_PENDING: null,
  FETCHED_IP_REPORT_ERROR: null,
  FETCH_DOMAIN_REPORT:null,
  FETCHED_DOMAIN_REPORT_PENDING: null,
  FETCHED_DOMAIN_REPORT_ERROR: null,
  FETCHED_DOMAIN_REPORT: null,
  FETCH_RESOLUTIONS:null,
  FETCHED_RESOLUTIONS_PENDING: null,
  FETCHED_RESOLUTIONS_ERROR: null,
  FETCHED_RESOLUTIONS: null,
  FETCHED_INFO: null,
  FETCH_JUST_LINKS: null,
  FETCH_LINKS: null,
  FETCHED_LINKS: null,
  FETCHED_LINKS_PENDING: null,
  FETCHED_LINKS_ERROR: null,
  FETCH_NEW_DOMAINS: null,
  FETCHED_NEW_DOMAINS: null,
  FETCH_TREEMAP: null,
  FETCHED_TREEMAP: null,
  FETCHED_TREEMAP_PENDING: null,
  FETCHED_TREEMAP_ERROR: null,
  SELECTED_SCHEME: null,
  TOGGLE_MENU: null,
  TOGGLE_TREEMAP: null,
  TOGGLE_FIND_IOC: null,
});

const ADDITIONAL_ACTIONS = {
  ROUTER_LOCATION_CHANGED: '@@router/LOCATION_CHANGE',
};

export const COLOR_SCHEMES = [
  { start: '#fee6ce', end: '#e6550d' },
  { start: '#deebf7', end: '#3182bd' },
  { start: '#f0f0f0', end: '#636363' },
  { start: '#e5f5e0', end: '#31a354' },
  { start: '#efedf5', end: '#756bb1' },
  { start: '#fee0d2', end: '#de2d26' },
];

export const COLOR_SCHEME_TRAFFIC_LIGHT = [
  { start: '#7fbf7b', end: '#d73027' },

];

export const SCALES = [
  { key: 'log', name: 'logarithmic' },
  { key: 'cbrt', name: 'cube root' },
  { key: 'sqrt', name: 'square root' },
  { key: 'real', name: 'realistic' },
];

export const SQUARE_SIZE = [
  { key: 'all', name: 'all domains' },
  { key: 'rel', name: '% of blacklisted domains' },
  { key: 'abs', name: '# of blacklisted domains' },
];

export const SQUARE_COLOR = [
  { key: 'rel', name: '% of blacklisted domains' },
  { key: 'abs', name: '# of blacklisted domains' },
  { key: 'all', name: 'all domains' },
];

export const ACTIONS = Object.assign(MAIN_ACTIONS, ADDITIONAL_ACTIONS);
