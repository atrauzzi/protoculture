import * as _ from "lodash";
import {decorate, injectable, Container, multiInject, inject} from "inversify";
import {Suite} from "./Suite";
import {appSymbols, StaticApp} from "./App";
import {suiteSymbols} from "./Suite";
import {StaticPlatform} from "./Suite/Platform";


export interface StaticServiceProvider<ServiceProviderType extends ServiceProvider> {

    new(suite: Suite): ServiceProviderType;
}

export abstract class ServiceProvider {

    protected suite: Suite;

    public constructor(suite: Suite) {

        this.suite = suite;
    }

    public async boot(): Promise<void> {

        // Optional, override this in subtype.
    }

    public async bootChild(container: Container): Promise<void> {

        // Optional, override this in subtype.
    }

    //
    // Utilities

    protected bindPlatform<Platform extends StaticPlatform<any>>(platform: Platform) {

        this.makeInjectable(platform);

        this.suite.container.bind<Platform>(suiteSymbols.AvailablePlatform)
            .to(platform);
    }

    protected bindApp<App extends StaticApp<any>>(app: App): void {

        this.bindConstructor<App>(appSymbols.App, app);
    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }

    protected bindConstructor<Type>(symbol: symbol, staticType: {new(...args: any[]): Type}) {

        this.makeInjectable(staticType);

        this.suite.container.bind<Type>(symbol)
            .to(staticType);
    }

    protected bindConstructorParameter(symbol: symbol | symbol[], staticType: any, position: number) {

        if(_.isArray(symbol)) {

            decorate(multiInject(symbol[0]), staticType, position);
        }
        else {
            decorate(inject(symbol as symbol), staticType, position);
        }
    }
}
