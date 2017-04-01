import {Action, Dispatch} from "redux";
import {ApplicationState} from "../Model/ApplicationState";
import {broadcast} from "./Broadcast";


export const LoggedOutActionType = "logout";

export interface LoggedOutAction extends Action {
}

export function loggedOut() {

    return broadcast({
        type: LoggedOutActionType,
    });

}