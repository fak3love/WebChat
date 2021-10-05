import {isEmptyOrSpaces} from "../../utils/validators";

export function getFilteredMessages(chats: any, filterText: any) {
    const isEmpty = isEmptyOrSpaces(filterText);

    return document.location.search.includes('tab=unread') ? chats.filter((chat: any) => chat.isUnread && chat.sender === 'target' && (isEmpty || chat.lastMessage.toLowerCase().includes(filterText.toLowerCase()))) :
        chats.filter((chat: any) => (isEmpty || chat.lastMessage.toLowerCase().includes(filterText.toLowerCase())));
}