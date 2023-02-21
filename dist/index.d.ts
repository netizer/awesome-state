import { Reducer } from '@reduxjs/toolkit';

type FixState<H extends Record<string, any> = Record<string, any>> = {
    [K in keyof H]: {
        reducer: Reducer<H[K]>;
    };
};
declare function register<FixStateStates extends Record<string, any>, S extends Record<string, any>>(slices: FixState<FixStateStates> & S): {
    StoreProvider: (props: any) => JSX.Element;
    useStore: (fn: () => any) => any;
    getState: () => FixStateStates;
    dispatch: FixState<FixStateStates> & S extends infer T extends Record<string, any> ? { [W in keyof T]: (FixState<FixStateStates> & S)[W]["actions"]; } : never;
};

export { FixState, register };
