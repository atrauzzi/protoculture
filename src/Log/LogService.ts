import * as _ from "lodash";
import { App } from "../App";
import { Suite } from "../Suite";
import { LogLevel } from "./LogLevel";
import { Platform } from "../Suite";
import { Environment } from "../index";


export class LogService {

    public constructor(
        protected suite: Suite,
        protected environment: Environment,
        protected platform: Platform
    ) {

    }

    public log(message: any, app: App, level: LogLevel = LogLevel.Info) {

        if(this.environment.logLevel >= level || this.environment.debug) {

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
            `protoculture@${this.platform.name}:${this.suite.name}`
        ];

        if(app) {

            logLinePrefixParts.push(`/${app.name}`);
        }

        logLinePrefixParts.push("# ");

        return logLinePrefixParts.join("");
    }
}