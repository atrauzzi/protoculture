import {ServiceProvider} from "../ServiceProvider";
import {suiteSymbols} from "../Suite";
import {logSymbols} from "./";
import {LogService} from "./LogService";


export class LogServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindConstructorParameter(suiteSymbols.Suite, LogService, 0);
        this.bindConstructorParameter(suiteSymbols.Environment, LogService, 1);
        this.bindConstructorParameter(suiteSymbols.CurrentPlatform, LogService, 3);

        this.bindConstructor<LogService>(logSymbols.LogService, LogService);
    }
}