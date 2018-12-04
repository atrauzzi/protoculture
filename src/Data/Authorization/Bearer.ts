import { AuthorizationType, Authorization } from "../ApiConfiguration";


declare module "../ApiConfiguration" {

    export enum AuthorizationType {
        Bearer = "bearer",
    }

    export interface ConfiguredAuthorizations {
        "bearer": BearerAuthorization;
    }
}

export interface BearerAuthorization extends Authorization {
    type: AuthorizationType.Bearer;
    token: string;
}
