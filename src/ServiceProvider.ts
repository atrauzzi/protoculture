import _ from "lodash";
import { Context } from "inversify/dts/planning/context";
import { decorate, injectable, multiInject, inject, Container, interfaces } from "inversify";
import { Bundle, App, protocultureSymbols, ConnectionConfiguration, ServerRoutes } from "./index";
import { ConnectionConfigurations } from "./Data/ApiConnections";


interface AppConstructor<AppType extends App> {

    new(...args: any[]): AppType;
}

export interface StaticServiceProvider {

    new(bundle: Bundle): ServiceProvider;
}

export abstract class ServiceProvider {

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

    protected configureApiConnection(factory: ((context: Context) => Partial<ConnectionConfigurations>)): interfaces.BindingWhenOnSyntax<{}>;
    protected configureApiConnection(
        name: string,
        configuration: Partial<ConnectionConfiguration<any>>,
    ): interfaces.BindingWhenOnSyntax<{}>;
    protected configureApiConnection(
        configurationOrFactoryOrName: string | Partial<ConnectionConfiguration<any>> | ((context: Context) => Partial<ConnectionConfigurations>),
        configurationOrFactory?: Partial<ConnectionConfiguration<any>> | ((context: Context) => Partial<ConnectionConfigurations>)
    ): interfaces.BindingWhenOnSyntax<{}> {

        const name = _.isString(configurationOrFactoryOrName)
            ? configurationOrFactoryOrName
            : "";

        const configuration = configurationOrFactory || configurationOrFactoryOrName;

        const binding = this.bundle.container.bind(protocultureSymbols.ApiConfiguration);

        return _.isFunction(configuration)
            ? binding.toDynamicValue(configuration)
            : binding.toConstantValue({
                [name]: configuration,
            });
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

    protected bindConstructorParameter(symbol: symbol | symbol[], staticType: any, position: number, tag: string = null) {

        if (_.isArray(symbol)) {

            decorate(multiInject(symbol[0]) as ParameterDecorator, staticType, position);
        }
        else {

            decorate(inject(symbol) as ParameterDecorator, staticType, position);
        }
    }
}
