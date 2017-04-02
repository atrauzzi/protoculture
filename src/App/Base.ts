import {ServiceProvider} from "../ServiceProvider";
import {ServiceProviderStatic} from "../ServiceProviderStatic";
import {Suite} from "../Suite";


export abstract class Base<State> {

    protected abstract get name(): string;

    public static get serviceProviders(): ServiceProviderStatic<ServiceProvider>[] {

        return [];
    };

    protected abstract async onRun(): Promise<void>;

    public get working(): boolean {

        return false;
    }

    protected suite: Suite;

    public constructor(suite: Suite) {

        this.suite = suite;
    }

    public async run() {

        // ToDo: Dispatch an action.

        await this.onRun();
    }
}