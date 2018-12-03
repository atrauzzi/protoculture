import * as Yup from "yup";
import { AxiosRequestConfig } from "axios";


export enum Method {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete",
}

export enum Authorization {
    Bearer = 0,
}

export interface ServerRoute<ResponseDataType = any, PathType = any, QueryType = any, DataType = any> {

    name: string;
    method: Method | string;
    path: string;
    query?: any;
    data?: ResponseDataType;
    parameters?: string[];

    validators?: {
        path?(): Yup.Schema<PathType>;
        query?(): Yup.Schema<QueryType>;
        data?(): Yup.Schema<DataType>;
    };
}

export interface ServerRoutes {

    [routeName: string]: ServerRoute;
}

export interface ConnectionConfiguration<Routes extends ServerRoutes> {

    axiosConfiguration?: AxiosRequestConfig;
    routes?: Routes;
    authorization?: {
        type: Authorization,
        data: any,
    };
}

export const defaultAxiosConfiguration: AxiosRequestConfig = {

    withCredentials: true,
};
