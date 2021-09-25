import {headers, logout} from "../../ts/authorization";
import moment from "moment";
import {get} from "../../ts/requests";
import {goToAuthorization, goToProfile} from "../../utils/common";

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