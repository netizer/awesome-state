# Awesome State

A boilerplate-free global state management for React, built on top of redux/toolkit.

# Why Awesome State?

Awesome State is the simplest way to manage state in a React application. It's build on top of redux and redux/toolkit. Why would you use it instead of using redux/toolkit directly? Because Awesome State prioritises the comfort of the developer and provides a simple and powerful interface for managing your state. There is no boilerplate.

## Why not just use React?

I love that I don't always have to use a global state management solution. In small applications it's comfortable enough to just use React's state management functionalities such as useState or useReducer. They are powerful enough to be used for maintaining a small global state management in small applications.

## Why not just use Redux?

I also love Redux. It solved the problems that appear when the application, and the global state grow. The library makes it possible to understand what's going on in the application and it uses abstractions that allow devs to use tools like Redux Devtools.

Redux introduces good abstractions, and using it directly gets the job done, but if you focus on the  developer's comfort, there's a lot that can be improved. A better library should in my opinion handle the following.

- No boilerplate - The more code you have, the more potential there is for bugs, and the more time you spend maintaining it.
- Solid and simple API - I should not need to get to the documentation every time I use the library in a new project; the library should be so simple and the naming it uses so obvious that I should not need to ever read the docs again (at least in the most common use cases).
- Thought through defaults - good practices should be easy, but less good practices should still be possible. It makes sense to divide the state into slices, and have reducers that only focus only on a single slice, but it should be also possible to have exceptions from that rule.
- Reasonable approach to immutability - Immutable state makes sense, because it keeps the devs from introducing hard to detect errors, but I don't want to type twice as much and loose the possibility to easily debug my code.

## Why not just use redux/toolbox?

Redux/Toolbox solved a lot of these issues.

- It reduced the boilerplate code significantly
- It uses Immer (https://github.com/immerjs/immer) for immutable data types
- Once my app is set up, extending global state or adding new reducers is as easy as it can be.

But its API is though through as an extension of Redux. It adds all the essential components of comfortable state management, but it doesn't build a really comfortable developer experience. If you'd look at its API without knowing the history of the state management in React, you would not know why things are the way they are:

- Why you need to dispatch each action if the only reason why you would refer to an action (in normal web development circumstances) is to dispatch it?
- Why do you have to use Provider from react-redux and store defined by you with configureStore from @reduxjs/toolkit? The only reason why you'd use Provider is to use it with the store.
- Why would you repeat twice the name of the slice (first as a variable name, and then as a "name" value of the slice)?
- Why would you repeat twice each reducer name in the same file (of the slice) first to define it, and then to export it?
- Why would you dispatch actions in the component and pass to that component all the data that the action needs if this data is not needed for anything else? Being aware of all the flow of the information is mos tof the time good, but practically actions share logic (for example around raising errors) that react components don't need, so it's just more convenient to keep them separately.

Redux/Toolbox is an awesome tool, and it makes sense that it extends Redux with minimal API changes. What I need though (and I think you might too) is a small layer on top of it, that introduces an API that suits the developer's workflow and does not expose Redux and Redux/Toolbox internals that are not needed to maintain the application state (while not preventing you from importing them if you need that).

## Why "Awesome State"?

Using Awesome State feels like just a bit more convenient Redux/Toolbox. Using it takes fewer keystrokes than using any other global state management solution. It has only 4 elements you need to know about: `StoreProvider`, `dispatch`, `useStore`, and `getState`. You can just import it to a new project, and follow these steps:

1. Add `store.js`. That's where you'll define your store and that's where you'll import all the store-related functionalities from. It could be as simple as: `import { slices } from './slices.js'` + `import { register } from 'awesome-state'` then `export { store, StoreProvider, useStore, getState } = register(slices)`
2. Wherever you call `ReactDOM.render`, import the store provider from `store.js`: `import { StoreProvider } from './store'` and wrap the app with: `<StoreProvider></StoreProvider>`.
3. In your components use `useStore` to access the state: `const user = useStore((s) => s.user)`. It should be imported like this: `import { useStore } from './store'`.
4. Put all the global state-changing actions outside of components, so in the component, call things like: `import { logIn } from './actions'` and then in the `actions`: `import { dispatch } from './store';` and then in the `logIn` action: `dispatch.user.set(responseData)`.

# Installation

npm add awesome-state

# Usage

First, add StoreProvider to your `index.js`

`index.js`

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './store';
import { App } from './App';

ReactDOM.render(
  <StoreProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
```

Let's say you have one file `actions.js` and all the mutable actions (changing the global state, connecting to the server) are there. Of course you could well enough have an `actions` directory and split your code into several files.

You can use `getState` and `dispatch` as follows:

`actions.js`

```js
import {
  callLogin
} from "./apis.js"
import { getState, dispatch } from './store'

export const logIn = ({ params }) => {
  const state = getState()
  if (state.authToken.value) {
    //... if you'd like to do something in case the user is already logged in (but probably this action should never be called in such case)
  }
  const onError = (err) => {
    // some error handling
    dispatch.notifications.set({ severity: "error", text: "Something went wrong" }))
  }
  const onSuccess = (response) => {
    // processing the token
    dispatch.authToken.set(response.headers.authorization)
  }
  return axios.post(`https://yourserver.com/auth/v1/login.json`, params, { headers: { "Content-Type": "application/json" } })
    .then(res => onSuccess(res))
    .catch(error => onError(error))
}
```

Notice, how when using Redux Toolbox, you would type:
```js
store.dispatch(actions.authToken.set(authToken))
```
but here you just write:
```js
dispatch.authToken.set(authToken)
```

Now, to use information from the global state in your component, you can do the following:

```js
import { useSelector } from 'react-redux'
export function Budget() {
  const budget = useSelector((state) => state.currentUser.budget)
}
```

And to cause the change of the state, you can call the action from the component:

```js
import {
  logIn
} from "../../actions.js"
export function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = {
      user: {
        email: data.get('login'),
        password: data.get('password')
      }
    }
    logIn({ params })
  }
  return (
    <form onSubmit={handleSubmit}>
        <input
          id="login"
          name="login"
        />
        <input
          name="password"
          id="password"
        />
        <input
          type="submit"
        >
          Sign In
        </input>
      </form>
  )
}
```

So basically state is referred from only 2 places:
- `<Provider store={store}>` part to make sure that you can use `useSelector` in your components to access the state.
- `store.dispatch(actions.authToken.set(authToken))` or similar mix of store.dispatch and actions  to change the global state.

Now how to define actions? Here it is:

```js
import { createSlice } from '@reduxjs/toolkit'

const authTokenSlice = createSlice({
  name: 'authToken',
  initialState: {
    /*
      false - not set yet
      null/undefined - logged out
      string - logged in
    */
    value: false,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload
    },
    reset: (state) => {
      state.value = null
    }
  },
})

export const slices = [authTokenSlice]
```
