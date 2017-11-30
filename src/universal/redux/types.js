// @flow

import {fromJS} from 'immutable'
import {Map, Record} from 'immutable'
import type {RecordOf} from 'immutable'
import {reducer as formReducer} from 'redux-form/immutable'
import {featuresReducer, featureStatesReducer} from 'redux-features'
import type {Features, FeatureStates} from 'redux-features'
import type {ConnectionState} from './symmetry'
import {initialConnectionState} from './symmetry'

import {authInit} from '../auth/redux'
import type {User, Auth} from '../auth/redux'

import type {
  Store as _Store,
  Reducer as _Reducer,
  Dispatch as _Dispatch,
  Middleware as _Middleware,
  MiddlewareAPI as _MiddlewareAPI,
} from 'redux'

// Some things can be rendered on the client but not the server.
// But the client must initially render the same thing the server did,
// or React will warn that there was a checksum error.
// So first the client renders in the same mode as the server did, and
// then it sets the renderMode to 'client' to trigger rendering of
// everything that can only be rendered on the client.
export type RenderMode = 'prerender' | 'client'

export type StateFields = {
  features: Features<State, Action>,
  featureStates: FeatureStates,
  user: ?User,
  auth: Auth,
  renderMode: RenderMode,
  form: Map<string, any>,
  connection: ConnectionState,
}
const stateInit: StateFields = {
  features: featuresReducer()((undefined: any), {type: ''}),
  featureStates: featureStatesReducer()((undefined: any), {type: ''}),
  renderMode: 'prerender',
  form: formReducer(undefined, {}),
  user: null,
  auth: authInit,
  connection: initialConnectionState,
}

export const StateRecord = Record(stateInit)
export type State = RecordOf<StateFields>

export type StateJSON = {
  features: Features<StateRecord, Action>,
  featureStates: FeatureStates,
  user: ?User,
  auth: Auth,
  renderMode: RenderMode,
  form: Object,
  connection: ConnectionState,
}

export function parseState({
  form, ...fields
}: StateJSON): State {
  return StateRecord({
    form: (fromJS(form || {}): any),
    ...fields,
  })
}

export type Action = $Shape<{
  type: $Subtype<string>,
  error: boolean,
  payload: any,
  meta: Object,
}>

export type Store = _Store<StateRecord, Action>
export type Dispatch = _Dispatch<Action>
export type Reducer = _Reducer<StateRecord, Action>
export type Middleware = _Middleware<StateRecord, Action>
export type MiddlewareAPI = _MiddlewareAPI<StateRecord, Action>

