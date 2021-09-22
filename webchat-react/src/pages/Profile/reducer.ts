export enum FriendStatuses {
    friends = 1,
    followerTarget = 2,
    targetFollower = 3
}
export type FriendStatusType = {
    initiatorId: string,
    targetId: string,
    status: FriendStatuses
}
export type User = {
    visitor: boolean,
    id: string,
    firstName: string,
    lastName: string,
    status: string | null,
    gender: string,
    birthday: string | null,
    city: string | null,
    languages: string[],
    avatar: {slug: string, src: string} | undefined,
    onlineStatus: string,
    friends: number,
    followers: number,
    subscriptions: number,
    photos: number,
    friendStatus: FriendStatusType | undefined
}

export function reducer(state: any, action: any) {
    switch (action.type) {
        case 'showLoading': return {...state, loading: true};
        case 'hideLoading': return {...state, loading: false};
        case 'showViewer': return {...state, openViewer: true};
        case 'hideViewer': return {...state, openViewer: false};
        case 'showDialog': return {...state, openDialog: true};
        case 'hideDialog': return {...state, openDialog: false};
        case 'updateUser': return {...state, user: action.payload};
        default:
            return state;
    }
}

export function init() {
    return {
        loading: true,
        openViewer: false,
        openDialog: false,
        user: {
            visitor: true,
            id: '1',
            firstName: 'FirstName',
            lastName: 'LastName',
            status: 'Status message',
            gender: 'Male',
            birthday: null,
            city: null,
            languages: ['Language1', 'Language2', 'Language3'],
            avatar: undefined,
            onlineStatus: 'online',
            friends: 49,
            followers: 13,
            subscriptions: 33,
            photos: 11,
            friendStatus: undefined
        } as User
    }
}
export const initialState = {
    loading: true,
    openViewer: false,
    openDialog: false,
    user: {
        visitor: true,
        id: '1',
        firstName: 'FirstName',
        lastName: 'LastName',
        status: 'Status message',
        gender: 'Male',
        birthday: null,
        city: null,
        languages: ['Language1', 'Language2', 'Language3'],
        avatar: undefined,
        onlineStatus: 'online',
        friends: 49,
        followers: 13,
        subscriptions: 33,
        photos: 11,
        friendStatus: undefined
    }
}
