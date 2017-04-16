import * as _ from "lodash";
import * as platform from "platform";
import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import {BaseEnvironment} from "../Environment";
import { Method, requestJson } from "../CreateRequest";
import { Suite } from "../index";


export class WebPlatform implements Platform {

    public name = "web";

    protected env: Partial<BaseEnvironment>;

    public suite: Suite;

    public get current() {

        return !!platform.ua;
    }

    public async boot() {

        this.env = await requestJson<BaseEnvironment>(`/${_.kebabCase(this.suite.name)}.env.json`);
    }

    public get environment(): BaseEnvironment {

        const defaultEnvironment: BaseEnvironment = {
            debug: true,
            name: undefined,
            logLevel: LogLevel.Info,
        };

        return _.assign(defaultEnvironment, this.env);
    }

    public log(message: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;
        const logMessage = `${levelName} ${message}`;

        if(level >= LogLevel.Error) {

            console.error(logMessage);
        }
        else {

            console.log(logMessage);
        }
    }
}
