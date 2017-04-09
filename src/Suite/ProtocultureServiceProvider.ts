import {symbols, ServiceProvider} from "../";
import {suiteSymbols, Platform} from "./";
import {App} from "../App";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(App);

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
