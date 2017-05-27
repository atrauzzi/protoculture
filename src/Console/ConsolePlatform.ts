import * as _ from "lodash";
import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import { Environment } from "../Environment";
import { Bundle } from "../index";


export class ConsolePlatform implements Platform {

    public bundle: Bundle;

    public name = "console";

    public get current() {

        return !!process;
    }

    public get environment(): Environment {

        const defaultEnvironment: Environment = {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        };

        return _.assign(defaultEnvironment, process.env);
    }

    public log(messageLines: string[], level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;

        // tslint:disable-next-line:no-console
        _.each(messageLines, (messageLine) => console.log(`${levelName} ${messageLine}`));
    }
}
