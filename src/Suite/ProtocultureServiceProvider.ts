import { symbols, ServiceProvider, BaseApp, Environment } from "../index";
import {suiteSymbols, Platform} from "./index";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.suite.container.bind(suiteSymbols.Suite)
            .toConstantValue(this.suite);

        this.suite.container
            .bind<Environment<any>>(symbols.Environment)
            .toDynamicValue((context) => context
                .container
                .get<Platform>(symbols.CurrentPlatform)
                .environment
            )
        ;
    }
}
