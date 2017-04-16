import * as _ from "lodash";
import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import { BaseEnvironment } from "../Environment";
import { Suite } from "../index";


export class ConsolePlatform implements Platform {

    public suite: Suite;

    public name = "console";

    public get current() {

        return !!process;
    }

    public get environment(): BaseEnvironment {

        const defaultEnvironment: BaseEnvironment = {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        };

        return _.assign(defaultEnvironment, process.env);
    }

    public log(message: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;

        console.log(`${levelName} ${message}`);
    }
}
