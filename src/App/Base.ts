import {ServiceProvider} from "../ServiceProvider";
import {ServiceProviderStatic} from "../ServiceProviderStatic";


export abstract class Base<State> {

    protected abstract get name(): string;

    public abstract get serviceProviders(): ServiceProviderStatic<ServiceProvider>[];

    public constructor() {

    }

    public async boot(): Promise<void> {

    }

    public async run() {


        // ToDo: Dispatch an action.
        return null;
    }
}