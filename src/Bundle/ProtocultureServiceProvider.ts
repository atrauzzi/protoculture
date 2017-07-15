import * as _ from "lodash";
import { symbols, ServiceProvider, BaseApp, Environment } from "../index";
import { bundleSymbols, Platform } from "./index";
import { Dictionary } from "lodash";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(bundleSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.bundle.container
            .bind<Environment>(symbols.Environment)
            .toDynamicValue((context) => {

                const environment = context
                    .container
                    .get<Platform>(symbols.CurrentPlatform)
                    .environment;

                return _.reduce(environment, (previous: Dictionary<string>, value: string, key: string) => {

                    previous = _.isObject(previous) ? previous : {};

                    previous[_.camelCase(key)] = value;

                    return previous;
                }) as Environment;
            })
            .inSingletonScope()
        ;
    }
}
