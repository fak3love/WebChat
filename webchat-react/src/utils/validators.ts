export type BaseValidatorType = {
    value: string
}

export function validateUserName({value}: BaseValidatorType) {
    if (value.length < 6 || value.length > 20)
        return ["Minimum username length 6 Maximum length 20 characters"];

    if (!/^[a-zA-Z0-9]+$/.test(value))
        return ["English letters and numbers are allowed"];

    return [];
}
export function validateEmail({value}: BaseValidatorType) {
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.toLowerCase()))
        return ["Invalid email"];

    return [];
}
export function validatePassword({value}: BaseValidatorType) {
    if (value.length < 8 || value.length > 20)
        return ["Minimum password length 8 Maximum length 20 characters"];

    if (!(!!/[A-Z]/.exec(value) && !!/[a-z]/.exec(value) && !!/[0-9]/.exec(value)))
        return ["Upper and lower case characters must be specified", "You must specify numbers in passwords"];

    return [];
}
export function validateName({value}: BaseValidatorType) {
    if (value.length < 2 || value.length > 40)
        return ["Minimum name length 2 Maximum length 40 characters"];

    if (!/^[a-zA-Z\-]+$/.test(value))
        return ["Invalid name"];

    return [];
}