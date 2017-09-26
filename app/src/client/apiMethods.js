import fetch from 'isomorphic-fetch';
import { API_URL } from './constants';

// handle cases when the an ERROR CODE is returned but res.body.errors is empty
// something that should not happen, but better safe than sorry...
function parseRes(response) {
  if (response.status === 204) return ({}); // no content
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  return response.json().then(object => {
    if (!object.errors) {
      const unknownError = {
        errors: [`Unknown error. (${response.status} - ${response.statusText})`],
      };
      return unknownError;
    }
    return object;
  });
}

// VERY SPECIAL CASE: fetch() throws only when there is no reponse from the server
function handleError() {
  return ({ errors: ['There was no response from the server.'] });
}

export function get(url) {
  return fetch(API_URL + url)
    .then(parseRes)
    .catch(handleError);
}

export function post(url, data) {
  return fetch(API_URL + url, {
    method: 'POST',
    mode: 'cors',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(parseRes)
    .catch(handleError);
}

export function put(url, data) {
  return fetch(API_URL + url, {
    method: 'PUT',
    mode: 'cors',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(parseRes)
    .catch(handleError);
}

export function patch(url, data) {
  return fetch(API_URL + url, {
    method: 'PATCH',
    mode: 'cors',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(parseRes)
    .catch(handleError);
}

export function remove(url) {
  return fetch(API_URL + url, { method: 'delete' })
    .then(parseRes)
    .catch(handleError);
}
