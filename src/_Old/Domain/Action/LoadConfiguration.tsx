import Action = Redux.Action;
import {ApplicationState} from "../Model/ApplicationState";
import {createRequest} from "../../CreateRequest";
import {setConfiguration} from "./SetConfiguration";
import {Dispatch} from "redux";


export function loadConfiguration(configurationPath: string) {
    return (dispatch: Dispatch<ApplicationState>, getState: () => ApplicationState) => new Promise((resolve, reject) => {

        const state: ApplicationState = getState();

        const uri = state.environment.appHost + configurationPath;

        return createRequest(uri)
            .then((response: Response) => {
                switch(response.status) {

                    case 200:
                        return response.json().then((configuration) => {
                            dispatch(setConfiguration(configuration));
                        });

                    default:
                        throw "Unable to load configuration from " + uri;

                }
            })

    });
}