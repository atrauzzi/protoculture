import _ from "lodash";
import { Context } from "inversify/dts/planning/context";
import { decorate, injectable, multiInject, inject, Container } from "inversify";
import { Bundle, App, protocultureSymbols, ConnectionConfiguration, ServerRoutes } from "./index";


interface AppConstructor<AppType extends App> {

    new(...args: any[]): AppType;
}

export interface StaticServiceProvider {

    new(bundle: Bundle): ServiceProvider;
}

export abstract class ServiceProvider {

    public static addDecoratedType(key: string, constructor: any) {

        if (!ServiceProvider.decoratedTypes[key]) {

            ServiceProvider.decoratedTypes[key] = [];
        }

        ServiceProvider.decoratedTypes[key].push(constructor);
    }

    public static getDecoratedTypes<T>(key: string) {

        return ServiceProvider.decoratedTypes[key] || [];
    }

    protected static readonly decoratedTypes: {[key: string]: any[]} = {};

    public bundle: Bundle;

    public constructor(bundle: Bundle) {

        this.bundle = bundle;
    }

    public async boot(): Promise<void> {

        // Optional, override this in subtype.
    }

    public async bootChild(container: Container): Promise<void> {

        // Optional, override this in subtype.
    }

    protected configureApiConnection<RoutesType extends ServerRoutes>(configurationOrFactory: ConnectionConfiguration<RoutesType> | ((context: Context) => ConnectionConfiguration<RoutesType>)) {

        const binding = this.bundle.container.bind(protocultureSymbols.ApiConfiguration);

        return _.isFunction(configurationOrFactory)
            ? binding.toDynamicValue(configurationOrFactory)
            : binding.toConstantValue(configurationOrFactory);
    }

    protected bindApp<AppType extends AppConstructor<any>>(app: AppType) {

        this.makeInjectable(app);

        return this.bindConstructor<AppType>(protocultureSymbols.App, app);
    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }

    protected bindConstructor<Type>(symbol: symbol, staticType: {new(...args: any[]): Type}) {

        return this.bundle.container.bind<Type>(symbol)
            .to(staticType)
            .inSingletonScope();
    }

    protected bindConstructorParameter(symbol: symbol | symbol[], staticType: any, position: number) {

        if (_.isArray(symbol)) {

            decorate(multiInject(symbol[0]) as ParameterDecorator, staticType, position);
        }
        else {

            decorate(inject(symbol) as ParameterDecorator, staticType, position);
        }
    }
}
