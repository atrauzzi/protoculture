import * as _ from "lodash";
import * as platform from "platform";
import { Platform } from "../Platform";
import { LogLevel } from "../Log/LogLevel";
import { Environment } from "../Environment";
import { Method, requestJson } from "../CreateRequest";
import { Suite } from "../index";


export class WebPlatform implements Platform {

    public name = "web";

    public suite: Suite;

    protected env: Partial<Environment>;

    public get current() {

        return !!platform.ua;
    }

    public get environment(): Environment {

        const defaultEnvironment: Environment = {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        };

        return _.assign(defaultEnvironment, this.env);
    }

    public log(messageLines: string[], level: LogLevel) {

        _.forEach(messageLines, (messageLine) => this.logLine(messageLine, level));
    }

    public logLine(messageLine: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;
        const logMessage = `${levelName} ${messageLine}`;

        switch(level) {

            case LogLevel.Debug:
            case LogLevel.Info:
                // tslint:disable-next-line:no-console
                console.log(logMessage);
            break;

            default:
                // tslint:disable-next-line:no-console
                console.error(logMessage);
            break;
        }
    }
}
