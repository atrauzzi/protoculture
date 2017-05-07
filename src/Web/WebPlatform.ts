import * as _ from "lodash";
import * as platform from "platform";
import { Platform } from "../Platform";
import { LogLevel } from "../Log/LogLevel";
import { Environment } from "../Environment";
import { Method, requestJson } from "../CreateRequest";
import { Suite } from "../index";


export class WebPlatform implements Platform {

    public name = "web";

    protected env: Partial<Environment>;

    public suite: Suite;

    public get current() {

        return !!platform.ua;
    }

    public async boot() {

        this.env = await requestJson<Environment>(`/${_.kebabCase(this.suite.name)}.env.json`);
    }

    public get environment(): Environment {

        const defaultEnvironment: Environment = {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        };

        return _.assign(defaultEnvironment, this.env);
    }

    public log(message: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;
        const logMessage = `${levelName} ${message}`;

        switch(level) {

            case LogLevel.Debug:
            case LogLevel.Info:
                console.log(logMessage);
            break;

            default:
                console.error(logMessage);
            break;
        }
    }
}
