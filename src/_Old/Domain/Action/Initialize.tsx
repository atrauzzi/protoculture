import {Action} from "redux";
import {thunkActionCreator, ActionCreatorThunk} from "../../ThunkActionCreator";
import {ApplicationState} from "../Model/ApplicationState";


export const InitializeActionType = "initialize";

export interface InitializeAction extends Action {
}

export function initialize(): ActionCreatorThunk<ApplicationState, InitializeAction> {
    return thunkActionCreator(() => {
        return {
            type: InitializeActionType,
        };
    });
}