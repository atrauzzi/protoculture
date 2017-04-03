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
            name: "huh?",
        }
    }

    log(level: LogLevel, topic: string, message: any): void {

        console.log(level.toString(), topic, message);
    }
}