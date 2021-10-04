export function encryptEmail(email: string | undefined | null) {
    if (email !== undefined && email !== null) {
        const findIndex = email.indexOf('@');
        const name = email.slice(0, findIndex);
        const host = email.slice(findIndex);

        return name[0] + name[1] + "***" + host;
    }

    return '';
}
export function getWithCapitalLetter(str: string | undefined | null) {
    if (str !== undefined && str != null)
        return str[0].toUpperCase() + str.slice(1);

    return '';
}