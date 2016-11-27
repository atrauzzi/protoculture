import * as _ from "lodash";
import App from "./App";
import {createRequest} from "./CreateRequest";
import {Environment} from "./Domain/Model/Environment";
import {ApplicationState} from "./Domain/Model/ApplicationState";
// ToDo: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/12935
declare function domready(callback: () => any) : void;


export default class Suite<EnvironmentType extends Environment> {

    private environmentFilePath: string;

    private apps: App<ApplicationState>[];

    private environment: EnvironmentType;

    public constructor(apps: App<ApplicationState>[], environmentFilePath = "/env.json") {
        this.apps = apps;
        this.environmentFilePath = environmentFilePath;
    }

    public run() {

        createRequest(this.environmentFilePath)
            .then(response => {

                switch(response.status) {

                    case 200:

                        response.json().then((environmentData: EnvironmentType) => {
                            this.environment = environmentData;
                            this.bootApps();
                        });

                        break;

                    default:
                        throw "Unable to get environment information.";

                }

            });

    }

    private bootApps() {
        domready(() => {
            _.each(this.apps, (app) => this.bootApp(app));
        });
    }

    private bootApp(app: App<ApplicationState>) {
        app.run(_.clone(this.environment));
    }

}
