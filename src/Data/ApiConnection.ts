import _ from "lodash";
import axios, { AxiosInstance } from "axios";
import { ConnectionConfiguration, ServerRoute, AuthorizationType, Authorization } from "./ApiConfiguration";
import { AxiosRequestConfig } from "axios";


type ConfiguredRouteKey<Configuration extends ConnectionConfiguration<any>> = keyof Configuration["routes"];

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

        const request = this.axios.request<ResponseDataType>(configuration);
        const response = await request;

        return response.data;
    }

    public setAuthorization<AuthorizationData extends Authorization>(type: AuthorizationData["type"], authorization: AuthorizationData) {

        this.configuration.authorizations[type as string] = authorization;
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
            this.createAxiosAuthorizationConfiguration(route.authorizationType),
            extraConfiguration,
        );
    }

    private createAxiosAuthorizationConfiguration(authorizationType: AuthorizationType) {

        const typePart = _.chain(authorizationType)
            .camelCase()
            .upperFirst();

        const configurationMethod = `createAxios${typePart}AuthorizationConfiguration`;

        const authorization = this.configuration.authorizations[authorizationType];

        if (this[configurationMethod]) {

            return this[configurationMethod](authorization);
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

