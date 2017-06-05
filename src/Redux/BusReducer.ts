import * as _ from "lodash";
import {Reducer, Action} from "redux";


export interface StaticBusReducer {

    new(...args: any[]): BusReducer;
}

export interface BusReducer<A = Action, S = any> {

    action: string;

    reducer: Reducer<S>;
}

export function createBusReducer<State>(busReducers: BusReducer[]) {

    const indexedReducers = {};

    _.forEach(busReducers, (busReducer) => {

        indexedReducers[busReducer.action] = indexedReducers[busReducer.action] || [];
        indexedReducers[busReducer.action].push(busReducer.reducer);
    });

    return (state: State, action: Action) => {

        let finalState = state;

        _.get<Reducer<State>[]>(indexedReducers, action.type, [])
            .forEach((childReducer) => finalState = childReducer(finalState, action));

        return finalState;
    };
}
