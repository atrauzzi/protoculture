import "./Data/Authorization/Bearer";
import "./Data/Authorization/Oauth2";
import mitt from "mitt";
import { ServiceProvider } from "./ServiceProvider";
import { BaseApp } from "./App";
import { protocultureSymbols, ApiConnection } from ".";
import { ApiConnections } from "./Data/ApiConnections";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(protocultureSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.bundle.container
            .bind(protocultureSymbols.EventBus)
            .toConstantValue(new mitt());

        this.makeInjectable(ApiConnections);
        this.bindConstructor(protocultureSymbols.ApiConnections, ApiConnections);
        this.bindConstructorParameter([protocultureSymbols.ApiConfiguration], ApiConnections, 0);
    }
}
