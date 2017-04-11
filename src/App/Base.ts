import {Suite} from "../Suite";
//import {LogLevel} from "../Log";


export interface StaticApp<AppType extends App> {

    new(): AppType;
}

export abstract class App {

    protected suite: Suite;

    public abstract get name(): string;

    protected abstract async onRun(): Promise<void>;

    public get working(): boolean {

        return false;
    }

    public async run(suite: Suite) {

        this.suite = suite;

        await this.onRun();
    }

    protected log(message: any) {

        this.suite.logger.log(message, this, null);
    }
}
