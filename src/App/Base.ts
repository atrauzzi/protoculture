import {ServiceProvider} from "../ServiceProvider";
import {ServiceProviderStatic} from "../ServiceProviderStatic";


export abstract class Base<State> {

    public abstract get name(): string;

    public static get serviceProviders(): ServiceProviderStatic<ServiceProvider>[] {

        return [];
    };

    protected abstract async onRun(): Promise<void>;

    public get working(): boolean {

        return false;
    }

    public async run() {

        await this.onRun();
    }
}