import { ServiceProvider } from "../index";
import axios, { AxiosRequestConfig } from "axios";
import { defaultAxiosConfiguration } from "../Domain/ApiConfiguration";


export class ProtocultureDataServiceProvider extends ServiceProvider {

    public async boot() {

        this.bundle.container
            .bind(dataSymbols.axiosConfiguration)
            .toConstantValue(defaultAxiosConfiguration);

        this.bundle.container
            .bind(dataSymbols.axios)
            .toFactory((context) =>
                axios.create(context.container.get<AxiosRequestConfig>(dataSymbols.axiosConfiguration)));
    }
}

export const dataSymbols = {

    axios: Symbol("axios"),
    axiosConfiguration: Symbol("AxiosConfiguration"),
};
