import mitt from "mitt";
import { ServiceProvider } from "./ServiceProvider";
import { BaseApp } from "./App";
import { protocultureSymbols } from ".";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(protocultureSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.bundle.container
            .bind(protocultureSymbols.MessageBus)
            .toConstantValue(new mitt());
    }
}
