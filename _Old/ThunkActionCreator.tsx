import {ActionCreator, ThunkAction } from "redux";
import {Action, Dispatch } from "redux";
import {ApplicationState} from "./Domain/Model/ApplicationState";


//
// ThunkActionCreator
//
// Instead of writing the same promise boilerplate over and over again to dispatch plain actions, this function
// will wrap an action factory for you.  Everything should be type safe so that the contract is easy to consume.


// A thunked action creator has the option of reading the current state.
export interface ThunkedActionCreator<ActionType extends Action> extends ActionCreator<ActionType> {
    (getState: () => any): ActionType;
}

// Once thunked, the ActionCreator will be wrapped in a promise.
export interface ActionCreatorThunk<StateType, ActionType> {
    (dispatch: Dispatch<StateType>, getState: () => StateType): Promise<void>;
}

// Receives an action factory...
export function thunkActionCreator<StateType extends ApplicationState, ActionType extends Action>(createAction: ThunkedActionCreator<ActionType>): ActionCreatorThunk<StateType, ActionType> {
    // ...and returns a thunk...
    return (dispatch: Dispatch<StateType>, getState: () => StateType): Promise<void> =>
        // ...that returns a promise that completes after calling the action factory and dispatching its result.
        new Promise<void>((resolve, reject) => {

            // The action factory can trigger failure by returning null or something that doesn't look like an action.
            const action = createAction(getState);

            if(!action || !action.type) {
                return reject(action);
            }

            dispatch(action);

            resolve();

        });
}
