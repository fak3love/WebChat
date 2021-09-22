export function validateUserName(value: string) {
    if (value.length < 6 || value.length > 20)
        return "Username length must be 6-20 characters";

    if (!/^[a-zA-Z0-9]+$/.test(value))
        return "Allow only English letters and numbers";

    return "";
}
export function validateEmail(value: string) {
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.toLowerCase()))
        return "Invalid email";

    return ""
}
export function validateLogin(value: string) {
    if (value.length < 6 || value.length > 20)
        return "Username or email length must be 6-20 characters";

    return "";
}
export function validatePassword(value: string) {
    if (value.length < 8 || value.length > 20)
        return "Password length must be 8-20 characters";

    if (!(!!/[A-Z]/.exec(value) && !!/[a-z]/.exec(value)))
        return "Upper and lower case characters must be specified";

    if (!/[0-9]/.exec(value))
        return "You must specify numbers in passwords";

    return "";
}
export function validateName(value: string) {
    if (value.length < 2 || value.length > 40)
        return "Name length must be 2-40 characters";

    if (!/^[a-zA-Z\-]+$/.test(value))
        return "Invalid name";

    return "";
}