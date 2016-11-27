import {Dispatch, Action} from "redux";
import App from "../../App";
import {ApplicationState} from "../Model/ApplicationState";


export function respond(responseTargetId: string, data: any) {

    return (dispatch: Dispatch<ApplicationState>, getState: () => ApplicationState) => {

        return new Promise((resolve, reject) => {
            App.respond(responseTargetId, data);
            resolve();
        });

    };

}