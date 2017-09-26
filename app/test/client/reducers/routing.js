import test from 'ava';
import { LOCATION_CHANGE } from 'react-router-redux';
import reducer, { initState } from '../../../src/client/reducers/routing';

test('routing reducer', t => {
  t.deepEqual(
    reducer(undefined, { type: undefined }),
    initState,
    'it should return init state if input state is not definied'
  );

  t.deepEqual(
    reducer(undefined, { type: LOCATION_CHANGE, payload: 'foo' }).get('locationBeforeTransitions'),
    'foo',
    'it should update the state of locationBeforeTransitions'
  );
});
