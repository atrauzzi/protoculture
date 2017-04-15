import * as _ from "lodash";
import {appSymbols, StaticApp} from "./App";
import {symbols, StaticPlatform, Platform} from "./index";
import {Suite} from "./Suite";
import {decorate, injectable, multiInject, inject, Container} from "inversify";


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

    protected bindPlatform<PlatformType extends Platform>(platform: StaticPlatform<PlatformType>) {

        this.makeInjectable(platform);

        this.suite.container.bind(symbols.AvailablePlatform)
            .to(platform);
    }

    protected bindApp<App extends StaticApp<any>>(app: App, identifier?: symbol): void {

        this.bindConstructor<App>(appSymbols.App, app);

        if(identifier) {

            this.bindConstructor(identifier, app);
        }
    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }

    protected makePropertyInjectable(target: any, property: string, typeSymbol: symbol, typeValue: any = null) {

        const metadata: any = {
            key: typeSymbol
        };

        if(typeValue) {
            metadata.value = typeValue
        }

        //tagProperty(target, property, metadata);
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
