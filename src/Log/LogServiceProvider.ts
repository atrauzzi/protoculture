import {ServiceProvider} from "../ServiceProvider";
import {symbols} from "../";
import {suiteSymbols} from "../Suite";
import {logSymbols, LogService} from "./";


export class LogServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindConstructor<LogService>(logSymbols.LogService, LogService);

        this.bindConstructorParameter(suiteSymbols.Suite, LogService, 0);
        this.bindConstructorParameter(symbols.Environment, LogService, 1);
        this.bindConstructorParameter(symbols.CurrentPlatform, LogService, 2);
    }
}