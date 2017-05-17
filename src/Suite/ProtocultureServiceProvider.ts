import * as _ from "lodash";
import { symbols, ServiceProvider, BaseApp, Environment } from "../index";
import { suiteSymbols, Platform } from "./index";
import { Dictionary } from "lodash";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.suite.container.bind(suiteSymbols.Suite)
            .toConstantValue(this.suite);

        this.suite.container
            .bind<Environment>(symbols.Environment)
            .toDynamicValue(context => {
                
                const environment = context
                    .container
                    .get<Platform>(symbols.CurrentPlatform)
                    .environment;

                return _.reduce(environment, (prev: Dictionary<string>, value: string, key: string) => {
                    
                    prev = _.isObject(prev) ? prev : {};
                    
                    prev[_.camelCase(key)] = value;

                    return prev;
                }) as Environment;
            })
            .inSingletonScope()
        ;
    }
}
