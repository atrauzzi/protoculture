import mitt from "mitt";
import { ServiceProvider } from "./ServiceProvider";
import { BaseApp } from "./App";
import { protocultureSymbols, ApiConnection } from ".";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(protocultureSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.bundle.container
            .bind(protocultureSymbols.MessageBus)
            .toConstantValue(new mitt());

        this.makeInjectable(ApiConnection);
        this.bindConstructor(protocultureSymbols.ApiConnection, ApiConnection);
        this.bindConstructorParameter(protocultureSymbols.ApiConfiguration, ApiConnection, 0);
    }
}
