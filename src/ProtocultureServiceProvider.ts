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
            .bind(protocultureSymbols.MessageBus)
            .toConstantValue(new mitt());

        this.makeInjectable(ApiConnections);
        this.bindConstructor(protocultureSymbols.ApiConnections, ApiConnections);
        this.bindConstructorParameter([protocultureSymbols.ApiConfiguration], ApiConnections, 0);


        // this.configureApiConnection((context) => {
            
        //     const configuration = context.container.get<NativeConfig>(reactNativeSymbols.Configuration);
            
        //     return _.merge(apiConfiguration, {
        //         axiosConfiguration: _.merge(defaultAxiosConfiguration, {
        //             baseURL: configuration.API_BASE_URI,
        //         }),
        //         routes: {
        //             "authenticate": {
        //                 data: {
        //                     "client_id": configuration.API_CLIENT_ID,
        //                     "client_secret": configuration.API_CLIENT_SECRET,
        //                 },
        //             },
        //         },
        //     });
        // });

    }
}
