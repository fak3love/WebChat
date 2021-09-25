import {logout} from "../ts/authorization";

export function goToProfile() {document.location.pathname = "/Profile"}
export function goToAuthorization() {
    logout();
    document.location.pathname = "/Authorization";
}
export function isVisitor(path: string) {return document.location.pathname !== path}
export function getVisitorId() {return document.location.pathname.split('/').pop()}