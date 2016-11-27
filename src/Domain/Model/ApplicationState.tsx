import {User} from "./User";
import {Environment} from "./Environment";


export interface ApplicationState {

    environment: Environment;
    runtimeConfigurationPath: string;

    configuration?: any;

    user?: User;

}