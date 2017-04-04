import {BaseSuite} from "../Suite";


export interface AppStatic<App extends BaseApp> {

    new(): App;
}

export abstract class BaseApp {

    protected suite: BaseSuite;

    public abstract get name(): string;

    protected abstract async onRun(): Promise<void>;

    public constructor() {

    }

    public get working(): boolean {

        return false;
    }

    public async run(suite: BaseSuite) {

        this.suite = suite;

        await this.onRun();
    }
}
