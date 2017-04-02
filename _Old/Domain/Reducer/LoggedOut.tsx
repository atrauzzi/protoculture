import * as _ from "lodash";
import {ApplicationState} from "../Model/ApplicationState";
import {LoggedOutActionType, LoggedOutAction} from "../Action/LoggedOut";


export default { [LoggedOutActionType]: (state: ApplicationState, action: LoggedOutAction) => {
    return _.omit(state, "user");
}};