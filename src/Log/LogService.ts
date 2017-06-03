import * as _ from "lodash";
import { App } from "../App";
import { Bundle } from "../Bundle";
import { LogLevel } from "./LogLevel";
import { Platform } from "../Bundle";
import { Environment } from "../index";


export class LogService {

    protected static readonly defaultEnvironment = {
        logLevel: LogLevel.Fatal,
        debug: false,
    };

    public constructor(
        protected bundle: Bundle,
        protected platform: Platform,
        protected environment: Environment = LogService.defaultEnvironment
    ) {

    }

    public log(message: any, app: App, level: LogLevel = LogLevel.Info) {

        if (this.environment.logLevel >= level || this.environment.debug) {

            this.platform.log(this.buildLogMessage(message, app), level);
        }
    }

    protected buildLogMessage(message: any, app: App = null): string[] {

        const messageLines = _.isString(message)
            ? message.split("\n")
            : [message];

        const logLinePrefix = this.buildLogLinePrefix(app);

        return _.map(messageLines, (messageLine) => `${logLinePrefix}${messageLine}`);
    }

    protected buildLogLinePrefix(app: App) {

        const logLinePrefixParts = [
            `protoculture@${this.platform.name}:${this.bundle.name}`
        ];

        if (app) {

            logLinePrefixParts.push(`/${app.name}`);
        }

        logLinePrefixParts.push("# ");

        return logLinePrefixParts.join("");
    }
}
