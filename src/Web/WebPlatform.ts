import * as _ from "lodash";
import * as platform from "platform";
import { Platform } from "../Platform";
import { LogLevel } from "../Log/LogLevel";
import { Environment } from "../Environment";
import { Method, requestJson } from "../CreateRequest";
import { Bundle, reduxSymbols } from "../index";
import { domReady } from "./DomReady";


export class WebPlatform implements Platform {

    public name = "web";

    public bundle: Bundle;

    protected env: Partial<Environment>;

    public async boot() {

        await domReady();

        this.bindInitialState();
    }

    public get current() {

        return !!platform.ua;
    }

    public get environment(): Environment {

        return null;
    }

    public log(messageLines: string[], level: LogLevel) {

        _.forEach(messageLines, (messageLine) => this.logLine(messageLine, level));
    }

    public logLine(messageLine: string, level: LogLevel) {

        const levelName = `${LogLevel[level]} -`;
        const logMessage = `${levelName} ${messageLine}`;

        switch (level) {

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

    protected bindInitialState() {

        const initialState = this.findInitialState();

        this.bundle.container.bind(reduxSymbols.InitialState)
            .to(initialState)
            .inSingletonScope();
    }

    protected findInitialState() {

        const stateElement = document.getElementsByName("state")[0];

        try {

            return JSON.parse(stateElement.getAttribute("content"));
        }
        catch (error) {

            return null;
        }
    }
}
