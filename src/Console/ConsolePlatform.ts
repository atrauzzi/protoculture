import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import {BaseEnvironment} from "../Environment";


declare const process: any;

export class ConsolePlatform implements Platform {

    public name = "console";

    public get current() {

        return !!process;
    }

    public get environment(): BaseEnvironment {

        return {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        }
    }

    public log(message: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;

        console.log(`${levelName} ${message}`);
    }
}
