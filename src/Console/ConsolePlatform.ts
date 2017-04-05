import {Platform} from "../Suite/Platform";
import {LogLevel} from "../LogLevel";
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
            name: "protoculture",
        }
    }

    log(level: LogLevel, topic: string, message: any): void {

        const levelMessage = `${LogLevel[level]} -`;

        switch(level) {

            case LogLevel.Info:
            case LogLevel.Debug:
                console.log(levelMessage, topic, message);
            break;

            default:
                console.error(levelMessage, topic, message);
            break;
        }
    }
}