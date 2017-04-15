import {symbols, ServiceProvider, BaseApp} from "../index";
import {suiteSymbols, Platform} from "./index";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.suite.container.bind(suiteSymbols.Suite)
            .toConstantValue(this.suite);

        this.suite.container
            .bind(symbols.Environment)
            .toDynamicValue((context) => context
                .container
                .get<Platform>(symbols.CurrentPlatform)
                .environment
            )
        ;
    }
}
