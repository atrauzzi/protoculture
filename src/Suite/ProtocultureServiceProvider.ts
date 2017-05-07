import * as _ from "lodash";
import { symbols, ServiceProvider, BaseApp, Environment } from "../index";
import { suiteSymbols, Platform } from "./index";


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

                return _.mapKeys(environment, (key: string) => 
                    // ToDo: I'm not aware of any way to tell lodash to return an environment here.
                    _.camelCase(key)) as Environment;
            })
            .inSingletonScope()
        ;
    }
}
