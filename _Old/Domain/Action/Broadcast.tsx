import {App} from "../../App";
import {Dispatch} from "redux";
import {ApplicationState} from "../Model/ApplicationState";


export function broadcast(data: any, internal: boolean = true) {

    return (dispatch: Dispatch<ApplicationState>, getState: () => ApplicationState) => new Promise((resolve, reject) => {
        App.broadcast(data, internal);
        resolve();
    });

}
