import {Suite} from "../Suite";
import {LogLevel} from "../Log/LogLevel";


export interface StaticApp<AppType extends App> {

    new(...args: any[]): AppType;
}

export interface App {

    readonly name: string;

    readonly working: boolean;

    // ToDo: Shift over to property/setter injection - https://github.com/inversify/InversifyJS/issues/531
    suite: Suite;

    run(): Promise<void>;
}

// Provided as a reference.  If you don't mind calling `super()`, feel free to use it!
export abstract class BaseApp implements App {

    private _suite: Suite;

    public abstract get name(): string;

    // ToDo: Shift over to property/setter injection - https://github.com/inversify/InversifyJS/issues/531
    public set suite(suite: Suite) {

        this._suite = suite;
    }

    // ToDo: Once property/setter injection is done, make this protected.
    public get suite(): Suite {

        return this._suite;
    }

    public get working(): boolean {

        return false;
    }

    public async run() {

        throw new Error("Not implemented!");
    }

    protected log(message: any, level: LogLevel = LogLevel.Info) {

        this.suite.logger.log(message, this, level);
    }
}