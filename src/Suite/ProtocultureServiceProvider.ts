import {ServiceProvider} from "../";
import {suiteSymbols} from "../Suite";
import {App} from "../App";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(App);

        this.makeInjectable(this.suite);

        this.suite.container.bind(suiteSymbols.Suite)
            .toConstantValue(this.suite);
    }
}
