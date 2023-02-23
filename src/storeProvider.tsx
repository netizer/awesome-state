import React from 'react'
import { Provider } from 'react-redux';

export function generateStoreProvider(store: unknown) {
  const StoreProvider = (props: any) => (
    <Provider {...props} store={store}>
      {props.children}
    </Provider>
  );
  return StoreProvider;
}
