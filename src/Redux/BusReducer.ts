import * as _ from "lodash";
import {Reducer, Action} from "redux";


export interface BusReducer {

    action: string;

    reducer: Reducer<any>;
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
