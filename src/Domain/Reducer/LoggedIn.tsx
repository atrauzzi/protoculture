import * as _ from "lodash";
import {ApplicationState} from "../Model/ApplicationState";
import {LoggedInActionType, LoggedInAction} from "../Action/LoggedIn";


export default { [LoggedInActionType]: (state: ApplicationState, action: LoggedInAction) => {

        const newState: ApplicationState = _.clone(state);

        newState.user = action.user;

        return newState;

}};