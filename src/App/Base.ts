import {Suite} from "../Suite";
import {LogLevel} from "../Log";


export interface StaticApp<AppType extends App> {

    new(): AppType;
}

export abstract class App {

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

    protected log(message: any, level: LogLevel = null) {

        this.suite.logger.log(message, this, level);
    }
}
