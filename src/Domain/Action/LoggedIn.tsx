import {Action, Dispatch} from "redux";
import {ApplicationState} from "../Model/ApplicationState";
import {User} from "../Model/User";
import {broadcast} from "./Broadcast";


export const LoggedInActionType = "login";

export interface LoggedInAction extends Action {
    user: User;
}

export function loggedIn(user: User) {

    return broadcast({
        type: LoggedInActionType,
        user: user,
    });

}