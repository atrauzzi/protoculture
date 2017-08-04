import * as _ from "lodash";
import { bundleSymbols, Platform } from "./index";
import { Dictionary } from "lodash";
import { ServiceProvider } from "../ServiceProvider";
import { BaseApp } from "../App/Base";
import { Environment } from "../Environment";
import { symbols } from "../index";


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
