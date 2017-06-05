import * as _ from "lodash";
import {Reducer, Action} from "redux";


export interface TypedAction<ActionType extends string> extends Action {

    type: ActionType;
}

export interface StaticBusReducer<ActionType extends TypedAction<any>, State = any> {

    new(...args: any[]): BusReducer<ActionType, State>;
}

export interface BusReducer<Action extends TypedAction<any>, State = any> {

    action: Action["type"];

    reducer(state: State, action: Action): State;
}

export function createBusReducer<State>(busReducers: BusReducer<any>[]) {

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
