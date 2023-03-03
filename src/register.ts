import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux'
import { configureStore, Reducer } from '@reduxjs/toolkit'
import { generateStoreProvider } from './storeProvider'

function extractReducers<S extends Record<string, any>>(slices: S) {
  return Object.fromEntries(Object.entries(slices).map(([key, value]) => [key, value.reducer])) as {[W in keyof typeof slices]: (typeof slices)[W]["reducer"]}
}

function wrapWithDispatch<Payload extends any, S extends (payload: Payload) => any, T extends { dispatch: (action: S) => void}>(action: S, store: T) {
  return ((payload: Payload) => {
    store.dispatch(action(payload))
  }) as S
}

function wrapFunctionsWithDispatch<S extends Record<string, any>>(actions: S, store: any) {
  return Object.fromEntries(Object.entries(actions).map(([key, value]) => [key, wrapWithDispatch(value, store)]))
}

function extractActions<S extends Record<string, any>, T extends { dispatch: (action: any) => void }>(slices: S, store: T) {
  return Object.fromEntries(Object.entries(slices).map(([key, value]) => [key, wrapFunctionsWithDispatch(value.actions, store)])) as {[W in keyof typeof slices]: (typeof slices)[W]["actions"]}
}

/* A fix for the wrong type of the getState result - see register */
export type FixState<H extends Record<string, any> = Record<string, any>> = {
  [K in keyof H]: {
    reducer: Reducer<H[K]>;
  }
}

/*
The typing of the function register should actually be like this:
function register<S extends Record<string, any>>(slices: S) {...}

But there seems to be a bug either in @redux/toolkit or in TypeScript
where configureStore returns the wrong type (it's ToolkitStore
with a hash as an argument, but that argument is the whole Slice,
and it should be just the state).

As a result getState() returns an object of slices
instead of an object of states.

Using FixStateStates and FixState types as shown below
fixes the issue.
*/
export function register<FixStateStates extends Record<string, any>, S extends Record<string, any>>(slices: FixState<FixStateStates> & S) {
  const reducers = extractReducers(slices)
  const store = configureStore({ reducer: reducers })
  const dispatch = extractActions(slices, store)

  const StoreProvider = generateStoreProvider(store)
  const useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useReduxSelector
  const getState = () => {
    return store.getState()
  }

  return {
    // For components
    StoreProvider,
    useSelector,
    // For actions
    getState,
    dispatch,
    // For direct access to redux/toolkit
    store
  }
}
