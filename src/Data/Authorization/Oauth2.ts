import * as moment from "moment";
import { ApiConnection } from "../ApiConnection";
import { AuthorizationType, ConnectionConfiguration, Authorization } from "../ApiConfiguration";


declare module "../ApiConfiguration" {

    export enum AuthorizationType {
        Oauth2 = "oauth2",
    }

    export interface ConfiguredAuthorizations {
        "oauth2": Oauth2Authorization;
    }
}

export enum Oauth2TokenType {
    Bearer = "bearer",
}

export interface Oauth2AccessToken {
    value: string;
    type: Oauth2TokenType;
    expiresIn?: string;
    expiresAt?: moment.Moment;
}

export interface Oauth2Authorization<ConnectionConfigurationType extends ConnectionConfiguration<any> = any> extends Authorization {
    type: AuthorizationType.Oauth2;
    accessToken: Oauth2AccessToken;
    refreshToken?: string;
    refreshConnection?: ApiConnection<ConnectionConfigurationType>;
    refreshRouteName?: keyof ConnectionConfigurationType["routes"];
}
