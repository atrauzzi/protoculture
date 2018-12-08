import { ConnectionConfiguration } from "../ApiConfiguration";
import { ApiConnection } from "../ApiConnection";
import { AxiosRequestConfig } from "axios";


declare module "../ApiConfiguration" {

    export interface ConfiguredAuthorizations {
        "bearer": BearerAuthorization;
    }
}

declare module "../ApiConnection" {

    export interface ApiConnection<Configuration extends ConnectionConfiguration<any>> {

        setAuthorization(type: "bearer", authorization: BearerAuthorization): void;
        createAxiosBearerAuthorizationConfiguration(authorization: BearerAuthorization): Promise<Partial<AxiosRequestConfig>>;
    }
}

export interface BearerAuthorization {
    token: string;
}

ApiConnection.prototype.createAxiosBearerAuthorizationConfiguration = async function (this: ApiConnection<any>, authorization: BearerAuthorization) {

    return {
        headers: {
            "authorization": `Bearer ${authorization.token}`,
        },
    };
}
