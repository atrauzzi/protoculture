import {Suite} from "../Suite";


export interface AppStatic<App extends BaseApp> {

    new(): App;
}

export abstract class BaseApp {

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
