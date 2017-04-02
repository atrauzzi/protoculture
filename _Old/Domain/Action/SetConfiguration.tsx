import {Dispatch, Action} from "redux";
import {ActionCreatorThunk, thunkActionCreator} from "../../ThunkActionCreator";
import {ApplicationState} from "../Model/ApplicationState";


export const SetConfigurationActionType = "set-configuration";

export interface SetConfigurationAction extends Action {
    configuration: any;
}

export function setConfiguration(configuration: any) {

    return thunkActionCreator((): SetConfigurationAction => {
        return {
            type: SetConfigurationActionType,
            configuration: configuration,
        };
    });
}