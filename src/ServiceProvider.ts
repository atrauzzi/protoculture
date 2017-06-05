import * as _ from "lodash";
import {appSymbols, StaticApp} from "./App";
import {symbols, StaticPlatform, Platform} from "./index";
import {Bundle} from "./Bundle";
import {decorate, injectable, multiInject, inject, Container, interfaces} from "inversify";


export interface StaticServiceProvider<ServiceProviderType extends ServiceProvider> {

    new(bundle: Bundle): ServiceProviderType;
}

export abstract class ServiceProvider {

    protected static readonly decoratedTypes: {[key: string]: any[]} = {};

    public static addDecoratedType(key: string, constructor: any) {

        if (!ServiceProvider.decoratedTypes[key]) {

            ServiceProvider.decoratedTypes[key] = [];
        }

        ServiceProvider.decoratedTypes[key].push(constructor);
    }

    public static getDecoratedTypes<T>(key: string) {

        return ServiceProvider.decoratedTypes[key] || [];
    }

    protected bundle: Bundle;

    public constructor(bundle: Bundle) {

        this.bundle = bundle;
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

        this.bundle.container.bind(symbols.AvailablePlatform)
            .to(platform);
    }

    protected bindApp<App extends StaticApp<any>>(app: App) {

        this.makeInjectable(app);

        return this.bindConstructor<App>(appSymbols.App, app);
    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }

    protected bindConstructor<Type>(symbol: symbol, staticType: {new(...args: any[]): Type}): interfaces.BindingWhenOnSyntax<Type> {

        return this.bundle.container.bind<Type>(symbol)
            .to(staticType);
    }

    protected bindConstructorParameter(symbol: symbol | symbol[], staticType: any, position: number) {

        if (_.isArray(symbol)) {

            decorate(multiInject(symbol[0]), staticType, position);
        }
        else {
            decorate(inject(symbol as symbol), staticType, position);
        }
    }
}
