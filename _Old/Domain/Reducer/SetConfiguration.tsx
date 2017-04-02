import * as _ from "lodash";
import {SetConfigurationActionType, SetConfigurationAction} from "../Action/SetConfiguration";
import {ApplicationState} from "../Model/ApplicationState";


export default {
    [SetConfigurationActionType]: (state: ApplicationState, action: SetConfigurationAction) => {

        const newState: ApplicationState = _.cloneDeep(state);

        newState.configuration = action.configuration;

        return newState;

    }
}