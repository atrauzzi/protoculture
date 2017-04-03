import {ServiceProviderConstructor} from "../ServiceProvider";


export abstract class Base<State> {

    public abstract get name(): string;

    public static get serviceProviders(): ServiceProviderConstructor[] {

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