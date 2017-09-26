import test from 'ava';
import { call, put } from 'redux-saga/effects';
import fetchEntity from '../../../src/client/actions/common';

const noErrors = { errors: undefined };
const errors = { errors: [] };

const PENDING = 'pending';
const ERROR = 'error';
const SUCCESS = 'success';
const apiFn = x => x;
const data = {};

test('fetchEntity', t => {
  const gen = fetchEntity(PENDING, ERROR, SUCCESS, apiFn, data);

  t.deepEqual(
    gen.next().value,
    put({ type: PENDING }),
    'fetchEntity should yield an effect put({ type: pending })'
  );

  t.deepEqual(
    gen.next().value,
    call(apiFn, data),
    'fetchEntity should yield an effect call(apiFn, data)'
  );

  t.deepEqual(
    gen.next(noErrors).value,
    put({ type: SUCCESS, response: noErrors }),
    `
      fetchEntity should yield an effect
      put({ type: success, response: { errors: undefined } })
    `
  );
});

test('fetchEntity error handling', t => {
  const gen = fetchEntity(PENDING, ERROR, SUCCESS, apiFn, data);
  gen.next();
  gen.next();

  t.deepEqual(
    gen.next(errors).value,
    put({ type: ERROR, response: errors }),
    `
      fetchEntity should yield an effect
      put({ type: error, response: { errors: [] } })
    `
  );
});
