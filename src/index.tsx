import React from 'react'
import { useSelector } from 'react-redux'
import { Provider } from 'react-redux';
import { configureStore, Reducer } from '@reduxjs/toolkit'

function extractReducers<S extends Record<string, any>>(slices: S) {
  return Object.fromEntries(Object.entries(slices).map(([key, value]) => [key, value.reducer])) as {[W in keyof typeof slices]: (typeof slices)[W]["reducer"]}
}

function extractActions<S extends Record<string, any>>(slices: S) {
  return Object.fromEntries(Object.entries(slices).map(([key, value]) => [key, value.actions])) as {[W in keyof typeof slices]: (typeof slices)[W]["actions"]}
}

/* A fix for the wrong type of the getState result - see register */
export type FixState<H extends Record<string, any> = Record<string, any>> = {
  [K in keyof H]: {
    reducer: Reducer<H[K]>;
  }
}

/*
The typing of the function register should be like this:
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
  const actions = extractActions(slices)
  const store = configureStore({ reducer: reducers })

  const dispatch = actions

  const useStore = (fn: () => any) => useSelector(fn)
  const StoreProvider = (props: any) => (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
  const getState = () => {
    return store.getState()
  }

  return {
    // For components
    StoreProvider,
    useStore,
    // For actions
    getState,
    dispatch,
  }
}
