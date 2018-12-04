import _ from "lodash";
import moment from "moment";
import { ApiConnection } from "../ApiConnection";
import { AuthorizationType, ConnectionConfiguration, Authorization } from "../ApiConfiguration";
import { AxiosRequestConfig } from "axios";


declare module "../ApiConfiguration" {

    export enum AuthorizationType {
        Oauth2 = "oauth2",
    }

    export interface ConfiguredAuthorizations {
        "oauth2": Oauth2Authorization;
    }
}

declare module "../ApiConnection" {

    export interface ApiConnection<Configuration extends ConnectionConfiguration<any>> {

        setAuthorization(type: "oauth2", authorization: Oauth2Authorization): void;
        createAxiosOauth2AuthorizationConfiguration(authorization: Oauth2Authorization): Promise<Partial<AxiosRequestConfig>>;
    }
}

export enum Oauth2TokenType {
    Bearer = "bearer",
}

export interface Oauth2AccessToken {
    value: string;
    type: Oauth2TokenType;
    expiresIn?: number;
    expiresAt?: moment.Moment;
}

export interface Oauth2Response {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}

export interface Oauth2Authorization<ConnectionConfigurationType extends ConnectionConfiguration<any> = any> extends Authorization {
    type: AuthorizationType.Oauth2;
    accessToken: Oauth2AccessToken;
    refreshToken?: string;
    refreshConnection?: ApiConnection<ConnectionConfigurationType>;
    refreshRouteName?: keyof ConnectionConfigurationType["routes"];
}

ApiConnection.prototype.createAxiosOauth2AuthorizationConfiguration = async function (this: ApiConnection<any>, authorization: Oauth2Authorization) {

    const now = new Date();
   
    const expired = authorization.accessToken.expiresAt ? authorization.accessToken.expiresAt.isBefore(now) : null;

    if (
        !_.isNull(authorization.accessToken.expiresAt) 
        && expired
        && authorization.refreshToken
        && authorization.refreshConnection
    ) {

        this.setAuthorization(AuthorizationType.Oauth2, {
            ...authorization,
            accessToken: await refreshToken(authorization),
        });
    }
    else if (expired) {

        throw new Error("Token expired.");
    }
   
    return {
        headers: {
            "authorization": `Bearer ${authorization.accessToken.value}`,
        },
    };
}

async function refreshToken(authorization: Oauth2Authorization): Promise<Oauth2AccessToken> {

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
