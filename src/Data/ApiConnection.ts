import _ from "lodash";
import moment from "moment";
import axios, { AxiosInstance } from "axios";
import { ConnectionConfiguration, ServerRoute, AuthorizationType, Authorization } from "./ApiConfiguration";
import { AxiosRequestConfig } from "axios";
import { Oauth2AccessToken, Oauth2Authorization } from "./Authorization/Oauth2";
import { BearerAuthorization } from "./Authorization/Bearer";


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

        const request = this.axios.request(configuration);
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
            this.createAxiosAuthorizationConfiguration(),
            extraConfiguration,
        );
    }

    private createAxiosAuthorizationConfiguration() {

        switch (_.get(this.configuration, "authorization.type") as AuthorizationType) {

            case AuthorizationType.Bearer:
                return this.createAxiosBearerAuthorizationConfiguration();

            case AuthorizationType.Oauth2:
                return this.createAxiosOauth2AuthorizationConfiguration();

            default:
                return {};
        }
    }

    private createAxiosBearerAuthorizationConfiguration() {

        if (this.configuration.authorizations[AuthorizationType.Bearer]) {

            return {
                headers: {
                    "authorization": `Bearer ${this.configuration.authorizations.bearer.token}`,
                },
            };
        }
    }

    private async createAxiosOauth2AuthorizationConfiguration(): Promise<AxiosRequestConfig> {

        const now = new Date();
       
        const authorization = this.configuration.authorizations[AuthorizationType.Oauth2];
        
        const expiresAt = authorization.accessToken.expiresAt ? moment(authorization.accessToken.expiresAt) : null;
        const expired = expiresAt ? expiresAt.isBefore(now) : null;

        if (
            !_.isNull(expiresAt) 
            && expired
            && authorization.refreshToken
            && authorization.refreshConnection
        ) {

            this.configuration.authorizations[AuthorizationType.Oauth2] = {
                ...this.configuration.authorizations[AuthorizationType.Oauth2],
                accessToken: await this.refreshToken(authorization),
            } as Oauth2Authorization;           
        }
        else if (expired) {

            throw new Error("Token expired.");
        }
       
        return {
            headers: {
                "authorization": `Bearer ${this.configuration.authorizations[AuthorizationType.Oauth2].accessToken.value}`,
            },
        };
    }

    private async refreshToken(authorization: Oauth2Authorization): Promise<Oauth2AccessToken> {

        const refreshRouteName = authorization.refreshRouteName || "refresh";

        const response = await authorization.refreshConnection.call(refreshRouteName, {
            data: {
                "grant_type": "refresh_token",
                "refresh_token": authorization.refreshToken,
            },
        });

        return {
            value: response.access_token,
            expiresAt: moment().add(response.expires_in, "seconds"),
            expiresIn: response.expires_in,
            type: response.token_type,
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

