import {Reducer, Action} from "redux";


export interface StaticBusReducer<ActionType extends Action, State = any> {

    new(...args: any[]): BusReducer<ActionType, State>;
}

export interface BusReducer<ActionType extends Action, State = any> {

    action: ActionType["type"];

    reducer(state: State, action: Action): State;
}

export function createBusReducer<State>(busReducers: BusReducer<any>[]) {

    const indexedReducers = {};

    busReducers.forEach((busReducer) => {

        indexedReducers[busReducer.action] = indexedReducers[busReducer.action] || [];
        indexedReducers[busReducer.action].push(busReducer.reducer);
    });

    return (state: State, action: Action) => {

        let finalState = state;

        const childReducers: Reducer<State>[] = indexedReducers[action.type] || [];

        childReducers.forEach((childReducer) =>
            finalState = childReducer(finalState, action));

        return finalState;
    };
}
