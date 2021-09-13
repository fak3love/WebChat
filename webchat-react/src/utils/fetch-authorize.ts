import {post} from "../ts/requests";
import {environment} from "../ts/environment";

export type AuthorizeType = {
    login: string | undefined,
    password: string | undefined,
    saveToStorage: boolean
}
export type RegisterType = {
    userName: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    saveToStorage: boolean
}

export async function checkToken() {
    const token = sessionStorage.getItem("token") !== null ? sessionStorage.getItem("token") : localStorage.getItem("token");

    if (token === null)
        return false;

    const headers: HeadersInit = {
        "Access-Control-Allow-Headers": "*",
        "Accept": "application/json",
        "Authorization": "Bearer " + token
    };

    return (await post({url: environment.apiUrl + "account/checkToken", headers: headers, body: undefined})).ok;
}
export async function authorize({login, password, saveToStorage}: AuthorizeType) {
    const body: BodyInit = JSON.stringify({login, password});
    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    const response = await post({url: environment.apiUrl + "account/login", headers: headers, body: body});
    const json = JSON.parse(await response.text());

    if (response.ok) {
        const token = json.token;

        if (saveToStorage)
            localStorage.setItem("token", token);

        sessionStorage.setItem("token", token);
    }

    return {status: response.status, json};
}
export async function register({userName, password, email, firstName, lastName, saveToStorage}: RegisterType) {
    const body: BodyInit = JSON.stringify({userName, password, email, firstName, lastName});

    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    const response = await post({url: environment.apiUrl + "account/register", headers: headers, body: body});
    const json = JSON.parse(await response.text());

    if (response.ok) {
        const token = json.token;

        if (saveToStorage)
            localStorage.setItem("token", token);

        sessionStorage.setItem("token", token);
    }

    return {status: response.status, json};
}
export function logout() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
}