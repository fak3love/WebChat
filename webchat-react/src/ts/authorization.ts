export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
}

export function isEmptyStorage(): boolean {return localStorage.getItem('token') === null && sessionStorage.getItem('token') === null;}
export function getToken(): string | null {
    let token = localStorage.getItem('token');

    if (token === null)
        token = sessionStorage.getItem('token');

    return token;
}
export function getUserId(): string | null {
    let userId = localStorage.getItem('userId');

    if (userId === null)
        userId = sessionStorage.getItem('userId');

    return userId;
}
export function setToken(token: string, saveToStorage: boolean = false) {
    if (saveToStorage)
        localStorage.setItem('token', token);

    localStorage.setItem('token', token);
}
export function setUserId(userId: string, saveToStorage: boolean = false) {
    if (saveToStorage)
        localStorage.setItem('userId', userId);

    localStorage.setItem('userId', userId);
}
export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
}