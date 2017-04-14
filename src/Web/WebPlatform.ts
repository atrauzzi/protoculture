import * as _ from "lodash";
import * as platform from "platform";
import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import {BaseEnvironment} from "../Environment";
import {Method, requestJson} from "../CreateRequest";


export class WebPlatform implements Platform {

    public name = "web";

    protected env: Partial<BaseEnvironment>;

    public get current() {

        return !!platform.ua;
    }

    public async boot(suite?: string) {

        const envFilename = [
            "/env",
        ];

        if(suite) {

            envFilename.push(`.${_.kebabCase(suite)}`);
        }

        this.env = await requestJson<BaseEnvironment>(`${envFilename}.json`);
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

        console.log(`${levelName} ${message}`);
    }
}
