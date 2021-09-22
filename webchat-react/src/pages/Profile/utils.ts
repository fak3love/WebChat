import {getUserId, headers, logout} from "../../ts/authorization";
import moment from "moment";
import {deleteRequest, get, patch, post} from "../../ts/requests";
import {FriendStatuses} from "./reducer";

export function isVisitor() {return document.location.pathname !== '/Profile'}
export function getVisitorId() {return document.location.pathname.split('/').pop()}
export function goToProfile() {document.location.pathname = "/Profile"}
export function goToAuthorization() {
    logout();
    document.location.pathname = "/Authorization";
}
export function tryRedirectByOk(ok: boolean, visitor: boolean) {
    if (!ok) {
        if (!visitor) {
            goToAuthorization();
            return;
        }

        goToProfile();
    }
}
export function getUserProfileByJsonText(text: string, visitor: boolean) {
    const json =  JSON.parse(text);

    return {
        visitor: visitor,
        id: json.id.toString(),
        firstName: json.firstName,
        lastName: json.lastName,
        gender: json.gender,
        status: json.statusMessage,
        birthday: json.birthday,
        city: json.city,
        avatar: json.avatarSlug !== null ? {slug: json.avatarSlug, src: json.avatar} : undefined,
        friends: json.friendCount,
        followers: json.followerCount,
        subscriptions: json.subscriptionCount,
        languages: json.languages,
        photos: json.photoCount,
        onlineStatus: moment().subtract(5, 'minutes') <= moment(json.lastActionDate) ? 'online' : moment(json.lastActionDate).calendar(),
        friendStatus: json.friendStatus !== null ? {
            initiatorId: json.friendStatus.initiatorUserId.toString(),
            targetId: json.friendStatus.targetUserId.toString(),
            status: json.friendStatus.statusId
        } : undefined
    }
}
export function getProfile(userId: string, targetUserId?: string) {
    return get({url: targetUserId === undefined ? `UserProfiles/Get/${userId}` : `UserProfiles/Get/${targetUserId}/${userId}`, headers: headers});
}
export function handleFileSelect(event: any, isAvatar: boolean, state: any, dispatch: any) {
    const reader = new FileReader();

    reader.readAsArrayBuffer((event.target.files as any)[0]);

    reader.onload = async (file: any) => {
        const imageBaseString = btoa(
            new Uint8Array(file.target.result)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const response = await post({url: 'UserPhotos/UploadPhoto', headers: headers, body: JSON.stringify({isAvatar: isAvatar, imageBaseString: imageBaseString})});

        if (response.status === 201)
            dispatch({type: 'updateUser', payload: {...state.user, avatar: isAvatar ? {slug: await response.text(), src: 'data:image/png;base64, ' + imageBaseString} : state.user.avatar, photos: state.user.photos + 1}})
    }
}
export async function handleDeleteAvatar(state: any, dispatch: any) {
    const handleDeleteAvatarResponse = await deleteRequest({url: 'UserPhotos/RemovePhoto', headers: headers, body: JSON.stringify({photoSlug: state.user.avatar?.slug})});
    const getResponse = await get({url: 'UserPhotos/GetAvatar', headers: headers})
    let slug: string = '';
    let src: string = '';

    if (handleDeleteAvatarResponse.ok && getResponse.ok) {
        slug = await getResponse.text();
        src = 'data:image/png;base64, ' + (await (await get({url: `UserPhotos/GetPhotoBaseString/${slug}`, headers: headers})).text());
    }

    if (handleDeleteAvatarResponse.ok)
        dispatch({type: 'updateUser', payload: {...state.user, avatar: slug !== '' ? {slug: slug, src: src} : undefined, photos: state.user.photos - 1}});
}
export async function handleUpdateStatus(statusValue: any, state: any, dispatch: any) {
    const patchResponse = await patch({url: 'UserProfiles/Patch', headers, body: JSON.stringify([{op: 'replace', path: '/statusMessage', value: statusValue}])});

    if (patchResponse.ok)
        dispatch({type: 'updateUser', payload: {...state.user, status: statusValue === undefined ? '' : statusValue}});
}
export async function handleAddFriend(state: any, dispatch: any) {
    const mainUserId = getUserId();
    const postResponse = await post({url: 'UserFriends/AddFriend', headers: headers, body: JSON.stringify({targetId: state.user.id})});

    let handleAddFriendFriends = state.user.friends;
    let handleAddFriendFollowers = state.user.followers;
    let handleAddFriendSubscriptions = state.user.subscriptions;

    if (state.user.friendStatus !== undefined) {
        handleAddFriendFriends++;
        handleAddFriendSubscriptions--;
    }
    else
        handleAddFriendFollowers++;

    if (postResponse.ok) {
        dispatch({type: 'updateUser', payload: {
                ...state.user,
                friends: handleAddFriendFriends,
                followers: handleAddFriendFollowers,
                subscriptions: handleAddFriendSubscriptions,
                friendStatus: state.user.friendStatus === undefined ? {
                    initiatorId: mainUserId,
                    targetId: state.user.id.toString(),
                    status: FriendStatuses.followerTarget
                } : {
                    ...state.user.friendStatus,
                    status: FriendStatuses.friends
                }
            }});
    }
}
export async function handleRemoveFriend(state: any, dispatch: any) {
    const mainUserId = getUserId();
    const handleRemoveFriendResponse = await deleteRequest({url: 'UserFriends/RemoveFriend', headers: headers, body: JSON.stringify({targetId: state.user.id})});

    let friends = state.user.friends;
    let followers = state.user.followers;
    let subscriptions = state.user.subscriptions;

    if (state.user.friendStatus?.status === FriendStatuses.friends) {
        friends--;
        subscriptions++;
    }
    else
        followers--;

    if (handleRemoveFriendResponse.ok) {
        dispatch({type: 'updateUser', payload: {
                ...state.user,
                friends: friends,
                followers: followers,
                subscriptions: subscriptions,
                friendStatus: state.user.friendStatus?.status === FriendStatuses.friends ? {
                    ...state.user.friendStatus,
                    status: state.user.friendStatus.initiatorId === mainUserId ? FriendStatuses.targetFollower : FriendStatuses.followerTarget
                } : undefined
            }});
    }
}