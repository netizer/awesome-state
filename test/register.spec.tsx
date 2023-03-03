import { createSlice } from '@reduxjs/toolkit'
import React from 'react';
import renderer from 'react-test-renderer';
import { register } from '../src/register';

const slices = {
  accounts: createSlice({
    name: "accounts",
    initialState: {
      name: "Monica" as (string | null)
    },
    reducers: {
      set: (state, action: { payload: string }) => {
        state.name = action.payload
      },
      resetName: (state) => {
        state.name = null
      }
    }
  }),
  authToken: createSlice({
    name: "authToken",
    initialState: {
      value: null as (string | null)
    },
    reducers: {
      set: (state, action: { payload: string | null }) => {
        state.value = action.payload
      },
      reset: (state) => {
        state.value = null
      }
    }
  })
}

describe('getState', () => {
  test('provides access to initial state', () => {
    const { getState } = register(slices)
    const state = getState()
    expect(state.authToken.value).toBe(null);
  })
})

describe('dispatch', () => {
  test('allows changing state', () => {
    const { dispatch, getState } = register(slices)
    dispatch.authToken.set("123")

    const state = getState()
    expect(state.authToken.value).toBe("123")
  })
})

describe('useSelector' ,() => {
  test('provides access to state', () => {
    const { StoreProvider, useSelector } = register(slices)

    const App = () => {
      const account = useSelector((state) => state.accounts.name)
      return (
        <span>{account}</span>
      )
    }

    const output = renderer.create(
      <StoreProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </StoreProvider>
    );

    const expecedDOM = { type: 'span', props: {}, children: [ 'Monica' ] }

    expect(output.toJSON()).toEqual(expecedDOM)
  })
})