import _ from "lodash";
import axios, { AxiosInstance } from "axios";
import { ConnectionConfiguration, ServerRoute, Authorization } from "./ApiConfiguration";
import { AxiosRequestConfig } from "axios";


export type ConfiguredRouteKey<Configuration extends ConnectionConfiguration<any>> = keyof Configuration["routes"];

export class ApiConnection<Configuration extends ConnectionConfiguration<any>> {

    private axios: AxiosInstance = null;

    public constructor(
        private configuration: Configuration
    ) {

        this.axios = axios;
    }

    public call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, extraConfiguration?: Partial<AxiosRequestConfig>): Promise<ResponseDataType>;
    public call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, routeParameters?: any, extraConfiguration?: Partial<AxiosRequestConfig>): Promise<ResponseDataType>;
    public async call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, routeParametersOrConfig?: any|Partial<AxiosRequestConfig>, extraConfiguration?: Partial<AxiosRequestConfig>) {

        const route = this.getRoute(name);

        const configuration = this.createAxiosRequestConfiguration(
            route,
            routeParametersOrConfig,
            extraConfiguration || routeParametersOrConfig
        );

        const request = this.axios.request(configuration);
        const response = await request;

        return response.data;
    }

    public setAuthorization(type: Authorization, data: any) {

        this.configuration.authorization = {
            type,
            data,
        };
    }

    public getRoute(name: ConfiguredRouteKey<Configuration>): ServerRoute {

        const route = this.configuration.routes[name];

        if (route) {

            return route as ServerRoute;
        }

        throw new Error(`Route ${name} is not defined.`);
    }

    private createAxiosRequestConfiguration(route: ServerRoute, parameters: any, extraConfiguration: Partial<AxiosRequestConfig> = {}): AxiosRequestConfig {

        const url = this.templatePathParameters(route, parameters);

        return _.merge(
            this.configuration.axiosConfiguration,
            {
                url,
                method: route.method,
                params: route.query,
                data: route.data,
            },
            this.createAxiosAuthorizationConfiguration(),
            extraConfiguration,
        );
    }

    private createAxiosAuthorizationConfiguration() {

        switch (_.get(this.configuration, "authorization.type")) {

            case Authorization.Bearer:
                return this.createAxiosBearerAuthorizationConfiguration();

            default:
                return {};
        }
    }

    private createAxiosBearerAuthorizationConfiguration() {

        return {

            headers: {
                "authorization": `Bearer ${this.configuration.authorization.data}`,
            },
        };
    }

    private templatePathParameters(route: ServerRoute, parameters: any) {

        return !!route.parameters
            ? route.parameters.reduce(
                (previousPath, parameter) =>
                    previousPath.replace(`{${parameter}}`, parameters[parameter]),
                route.path
            )
            : route.path;
    }
}

