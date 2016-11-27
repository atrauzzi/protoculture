import "fetch";
import * as _ from "lodash";
import * as cookie from "cookie";


// ToDo: Reenable query strings.

export class Method {
    public static Get = "GET";
    public static Post = "POST";
    public static Delete = "DELETE";
}

export enum ContentType {
    Json,
    Urlencoded,
    Multipart,
}

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
    _.each(data, formData.append)
    return formData;
}

export function createRequest(
    uri: string,
    queryStringData: any = null,
    data: any = null,
    method: string = Method.Get,
    contentType: ContentType = ContentType.Json,
    csrf: string = null,
) {

    const headers = {
        "Accept": "application/json",
    };

    // let queryString: string;
    let body: string|FormData;

    // if(queryStringData) {
    //     queryString = asUrlEncoded(data);
    //     uri = uri + "?" + queryString;
    // }

    if(data && method === Method.Post) {
        switch (contentType) {
            case ContentType.Json:
                body = asJson(data);
                headers["Content-Type"] = "application/json";
                break;
            // case ContentType.Urlencoded:
            //     body = asUrlEncoded(data);
            //     headers["Content-Type"] = "application/x-www-form-urlencoded";
            //     break;
            case ContentType.Multipart:
                body = asMultipart(data);
                headers["Content-Type"] = "multipart/form-data";
                break;
        }
    }

    if(csrf) {
        headers["X-CSRF-TOKEN"] = csrf;
    }
    else if(document.cookie) {

        let cookies = cookie.parse(document.cookie);

        if(cookies["XSRF-TOKEN"]) {
            headers["X-XSRF-TOKEN"] = cookies["XSRF-TOKEN"];
        }

    }

    return fetch(uri, {
        method: method,
        headers: new Headers(headers),
        body: body,
        credentials: "include",
    })

}