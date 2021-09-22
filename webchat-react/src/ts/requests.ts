import {environment} from "./environment";

export type RequestType = {
    url: string
    method: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null,
}
export type RequestMethod = {
    url: string,
    headers: HeadersInit | undefined,
    body?: BodyInit | undefined | null
}

export async function request({url, method, headers, body}: RequestType) {
    return await fetch(environment.apiUrl + url, {
        method: method,
        headers: headers,
        body: body
    });
}
export async function get({url, headers}: RequestMethod) {
    return await request({url, headers, body: null, method: "get"});
}
export async function post({url, headers, body}: RequestMethod) {
    return await request({url, headers, body, method: "post"});
}
export async function update({url, headers, body}: RequestMethod) {
    return await request({url, headers, body, method: "update"});
}
export async function patch({url, headers, body}: RequestMethod) {
    return await request({url, headers, body, method: "patch"});
}
export async function deleteRequest({url, headers, body}: RequestMethod) {
    return await request({url, headers, body, method: "delete"});
}
