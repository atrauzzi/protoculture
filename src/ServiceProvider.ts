import {decorate, injectable, Container} from "inversify";
import {Suite} from "./Suite";
import {appSymbols, AppStatic} from "./App";


export interface StaticServiceProvider<ServiceProviderType extends ServiceProvider> {

    new(suite: Suite): ServiceProviderType;
}

export abstract class ServiceProvider {

    protected suite: Suite;

    public constructor(suite: Suite) {

        this.suite = suite;
    }

    public abstract async boot(suite: Suite): Promise<void>;

    public async bootChild(container: Container): Promise<void> {

    }

    protected bindApp<App extends AppStatic<any>>(app: App): void {

        this.makeInjectable(app);

        this.suite.container.bind<App>(appSymbols.App)
            .to(app);
    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }
}
