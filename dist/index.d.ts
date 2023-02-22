import * as _reduxjs_toolkit_dist_configureStore from '@reduxjs/toolkit/dist/configureStore';
import * as _reduxjs_toolkit from '@reduxjs/toolkit';
import { Reducer } from '@reduxjs/toolkit';
import * as redux from 'redux';
import { TypedUseSelectorHook } from 'react-redux';

type FixState<H extends Record<string, any> = Record<string, any>> = {
    [K in keyof H]: {
        reducer: Reducer<H[K]>;
    };
};
declare function register<FixStateStates extends Record<string, any>, S extends Record<string, any>>(slices: FixState<FixStateStates> & S): {
    StoreProvider: (props: any) => JSX.Element;
    useStore: TypedUseSelectorHook<FixStateStates>;
    getState: () => FixStateStates;
    dispatch: FixState<FixStateStates> & S extends infer T extends Record<string, any> ? { [W in keyof T]: (FixState<FixStateStates> & S)[W]["actions"]; } : never;
    store: _reduxjs_toolkit_dist_configureStore.ToolkitStore<FixStateStates, redux.AnyAction, [_reduxjs_toolkit.ThunkMiddleware<FixStateStates, redux.AnyAction, undefined>]>;
};

export { FixState, register };
