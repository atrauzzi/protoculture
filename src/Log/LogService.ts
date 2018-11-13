import _ from "lodash";
import { Tracer } from "opentracing";
import { App } from "../App";
import { Bundle } from "../index";


export class LogService {

    public constructor(
        private bundle: Bundle,
        private tracer: Tracer
    ) {
    }

    public log(eventName: string, app?: App, message?: string) {

        console.log(eventName);

        const span = this.beginTrace(eventName, app);

        if (message) {

            span.log({
                message,
            });
        }

        span.finish();
    }

    public beginTrace(eventName: string, app?: App) {

        return this.tracer.startSpan(eventName, {
            tags: this.buildDefaultTags(app),
        });
    }

    protected buildLogMessage(message: any, app: App = null): string[] {

        const messageLines = _.isString(message)
            ? message.split("\n")
            : [message];

        const logLinePrefix = this.buildDefaultTags(app);

        return _.map(messageLines, (messageLine) => `${logLinePrefix}${messageLine}`);
    }

    protected buildDefaultTags(app: App) {

        return {
            "framework": "protoculture",
            "bundle": this.bundle.name,
            "app": app ? app.name : null,
        };
    }
}
