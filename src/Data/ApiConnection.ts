import _ from "lodash";
import axios, { AxiosInstance } from "axios";
import { ConnectionConfiguration, ServerRoute, Method } from "./ApiConfiguration";
import { AxiosRequestConfig } from "axios";
import { stringify as queryStringify } from "qs";


type ConfiguredRouteKey<Configuration extends ConnectionConfiguration<any>> = keyof Configuration["routes"];

export class ApiConnection<Configuration extends ConnectionConfiguration<any>> {

    public axios: AxiosInstance = null;

    public constructor(
        private configuration: Configuration
    ) {
        this.axios = axios;
    }

    public call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, extraConfiguration?: Partial<AxiosRequestConfig>): Promise<ResponseDataType>;
    public call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, routeParameters?: any, extraConfiguration?: Partial<AxiosRequestConfig>): Promise<ResponseDataType>;
    public async call<ResponseDataType = any>(name: ConfiguredRouteKey<Configuration>, routeParametersOrConfig?: any|Partial<AxiosRequestConfig>, extraConfiguration?: Partial<AxiosRequestConfig>) {

        const route = this.getRoute(name);

        const configuration = await this.createAxiosRequestConfiguration(
            route,
            routeParametersOrConfig,
            extraConfiguration || routeParametersOrConfig
        );

        const request = this.axios.request<ResponseDataType>(configuration);
        const response = await request;

        return response.data;
    }

    // todo: https://github.com/axios/axios/issues/1624#issuecomment-408867227
    public getUri(name: ConfiguredRouteKey<Configuration>, routeParameters?: any) {

        const route = this.getRoute(name);
        const path = this.templatePathParameters(route, routeParameters);

        return `//${this.configuration.axiosConfiguration.baseURL}/${path}`;
    }

    public setAuthorization(type: string, authorization?: any | null) {

        const key = `authorizations.${type}`;

        if (authorization) {

            _.set(this.configuration, key, authorization);
        }
        else {

            _.unset(this.configuration, key);
        }
    }

    public getRoute(name: ConfiguredRouteKey<Configuration>): ServerRoute {

        const route = this.configuration.routes[name];

        if (route) {

            return route as ServerRoute;
        }

        throw new Error(`Route ${name} is not defined.`);
    }

    private async createAxiosRequestConfiguration(route: ServerRoute, parameters: any, extraConfiguration: Partial<AxiosRequestConfig> = {}): Promise<AxiosRequestConfig> {

        const url = this.templatePathParameters(route, parameters);

        const configuration = _.merge(
            _.cloneDeep(this.configuration.axiosConfiguration),
            route.axiosConfiguration || {},
            {
                url,
                method: route.method,
                params: route.query,
                data: route.data,
            },
            route.authorizationType ? await this.createAxiosAuthorizationConfiguration(route.authorizationType) : {},
            extraConfiguration,
        );

        if (configuration.method === Method.GET) {
           
            configuration.url = `${configuration.url}?${queryStringify(configuration.params)}`;

            delete configuration.params;
        }

        return configuration;
    }

    private async createAxiosAuthorizationConfiguration(authorizationType: string) {

        const typePart = _.chain(authorizationType)
            .camelCase()
            .upperFirst();

        const configurationMethod = `createAxios${typePart}AuthorizationConfiguration`;

        const authorization = this.configuration.authorizations[authorizationType];

        if (this[configurationMethod]) {

            return await this[configurationMethod](authorization);
        }

        return {};
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

