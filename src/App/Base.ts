import {Suite} from "../Suite";


export interface StaticApp<AppType extends App> {

    new(): AppType;
}

export abstract class App {

    protected suite: Suite;

    public abstract get name(): string;

    protected abstract async onRun(): Promise<void>;

    public constructor() {

    }

    public get working(): boolean {

        return false;
    }

    public async run(suite: Suite) {

        this.suite = suite;

        await this.onRun();
    }
}
