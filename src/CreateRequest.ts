import * as _ from "lodash";
// import * as cookie from "cookie";


// ToDo: Reenable query strings.
// https://github.com/aurelia/fetch-client/issues/71
// https://github.com/Microsoft/TypeScript/issues/12517

export const Method = {
    Get: "GET",
    Post: "POST",
    Delete: "DELETE",
};

export const ContentType = {
    Json: "application/json",
    Urlencoded: "application/x-www-form-urlencoded",
    Multipart: "multipart/form-data",
};

function asJson(data: any) {

    return JSON.stringify(data);
}

// function asUrlEncoded(data: any) {
//     const params = new URLSearchParams();
//     _.each(data, params.set);
//     return params;
// }

function asMultipart(data: any) {

    const formData = new FormData();
    _.each(data, formData.append);

    return formData;
}

export interface RequestOptions {

    method?: string;
    contentType?: string;

    data?: any;
    query?: any;

    csrf?: string;

    accept?: string;

    username?: string;
    password?: string;
}

export async function createRequest<ResponseData>(uri: string, options: Partial<RequestOptions> = {}) {

    const defaultOptions: Partial<RequestOptions> = {
        method: Method.Get,
        contentType: ContentType.Json,
        accept: ContentType.Json,
    };

    options = _.merge(defaultOptions, options);

    const headers: any = {
        accept: options.accept,
    };

    // let queryString: string;
    let body: string|FormData;

    // if(queryStringData) {
    //     queryString = asUrlEncoded(data);
    //     uri = uri + "?" + queryString;
    // }

    if (options.username) {

        const usernamePasswordPair = options.password
            ? `${options.username}:${options.password}`
            : `${options.username}`;

        const encoded = btoa(usernamePasswordPair);

        const authorizationHeader = `Basic ${encoded}`;

        headers.authorization = authorizationHeader;
    }

    if (options.data && options.method === Method.Post) {

        switch (options.contentType) {

            case ContentType.Json:
                body = asJson(options.data);
                headers["Content-Type"] = "application/json";
                break;

            // case ContentType.Urlencoded:
            //     body = asUrlEncoded(data);
            //     headers["Content-Type"] = "application/x-www-form-urlencoded";
            //     break;

            case ContentType.Multipart:
                body = asMultipart(options.data);
                headers["Content-Type"] = "multipart/form-data";
                break;
        }
    }

    // if(csrf) {
    //     headers["x-csrf-token"] = csrf;
    // }
    // else if(document.cookie) {

    //     let cookies = cookie.parse(document.cookie);

    //     if(cookies["xsrf-token"]) {
    //         headers["x-xsrf-token"] = cookies["xsrf-token"];
    //     }

    // }

    return await fetch(uri, {
        method: options.method,
        headers: new Headers(headers),
        body,
        credentials: "include",
    });
}

export async function requestJson<RequestData>(uri: string, options: Partial<RequestOptions> = {}): Promise<RequestData> {

    options.contentType = ContentType.Json;
    options.accept = ContentType.Json;

    const request = await createRequest(uri, options);

    return await request.json();
}
