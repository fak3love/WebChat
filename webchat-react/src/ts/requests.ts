export type RequestType = {
    url: string
    method: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null,
}
export type GetType = {
    url: string,
    headers: HeadersInit | undefined,
}
export type PostType = {
    url: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null
}
export type UpdateType = {
    url: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null
}
export type PatchType = {
    url: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null
}
export type DeleteType = {
    url: string,
    headers: HeadersInit | undefined,
    body: BodyInit | undefined | null
}

export async function request({url, method, headers, body}: RequestType) {
    return await fetch(url, {
        method: method,
        headers: headers,
        body: body
    });
}
export async function get({url, headers}: GetType) {
    return await request({url, headers, body: null, method: "get"});
}
export async function post({url, headers, body}: PostType) {
    return await request({url, headers, body, method: "post"});
}
export async function update({url, headers, body}: UpdateType) {
    return await request({url, headers, body, method: "update"});
}
export async function patch({url, headers, body}: PatchType) {
    return await request({url, headers, body, method: "patch"});
}
export async function deleteRequest({url, headers, body}: DeleteType) {
    return await request({url, headers, body, method: "delete"});
}
