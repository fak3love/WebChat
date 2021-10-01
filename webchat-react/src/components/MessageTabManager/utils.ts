import {getVisitorId, isVisitor} from "../../utils/common";

export function getTabs(str: string) {
    const userTabsExpression = str.match(/peers=\d*(_\d*)*/i);
    let userTabs: string[] = [];

    if (userTabsExpression !== null)
        userTabs = userTabsExpression[0].replace('peers=', '').split('_');

    return userTabs.filter(tab => tab !== '');
}
export function getPeers(str: string) {
    const userTabsExpression = str.match(/peers=\d*(_\d*)*/i);

    if (userTabsExpression !== null)
        return userTabsExpression[0];

    return '';
}
export function getSelectedTabUserId() {
    if (isVisitor('/Messages'))
        return getVisitorId();

    return undefined;
}
export function tryAddPeerByUserId(userId: string) {
    const hasPeer = document.location.search.match(new RegExp(`(peers=${userId})|(_${userId})`, 'i')) !== null;
    const hasBody = new RegExp('\\??&?peers=', 'i').test(document.location.search);

    if (!hasPeer && hasBody)
        return document.location.search + "_" + userId;

    if (!hasPeer && !hasBody)
        return document.location.search + "?peers=" + userId;

    return document.location.search;
}
export function showTabs(str: string) {
    return str.startsWith('/Messages');
}
export function isSelectedAllChats(str: string) {
    return str === '' || (/tab=chats/i).test(str) || !(/tab=unread/i).test(str);
}
export function isSelectedUnread(str: string) {
    return (/tab=unread/i).test(str);
}