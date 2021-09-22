import {post} from "../ts/requests";
import {setToken, setUserId} from "../ts/authorization";

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
    gender: string,
    saveToStorage: boolean
}

export async function authorize({login, password, saveToStorage}: AuthorizeType) {
    const body: BodyInit = JSON.stringify({login, password});
    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    const response = await post({url: "account/login", headers: headers, body: body});
    const json = JSON.parse(await response.text());

    if (response.ok) {
        if (response.ok) {
            setToken(json.token, saveToStorage);
            setUserId(json.id, saveToStorage);
        }
    }

    return {status: response.status, json};
}
export async function register({userName, password, email, firstName, lastName, gender, saveToStorage}: RegisterType) {
    const body: BodyInit = JSON.stringify({userName, password, email, firstName, lastName, gender});

    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    const response = await post({url: "account/register", headers: headers, body: body});
    const json = JSON.parse(await response.text());

    if (response.ok) {
        setToken(json.token, saveToStorage);
        setUserId(json.id, saveToStorage);
    }

    return {status: response.status, json};
}