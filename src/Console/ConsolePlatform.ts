import {Platform} from "../Suite/Platform";
import {LogLevel} from "../Log/LogLevel";
import {Environment} from "../Suite/Environment";


declare const process: any;

export class ConsolePlatform implements Platform {

    public name = "console";

    public get current() {

        return !!process;
    }

    public get environment(): Environment {

        return {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Debug,
        }
    }

    public log(message: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;

        console.log(`${levelName} ${message}`);
    }
}
