import {get} from "../../ts/requests";
import {headers} from "../../ts/authorization";

export async function getFamiliars(actionName: string, userId: string | null | undefined) {
    const response = await get({url: `UserFriends/${actionName}/${userId}`, headers: headers});

    if (response.ok) {
        const json = await response.json();
        const arr = [];

        for (let familiar of json) {
            arr.push({
                userId: familiar.id,
                firstName: familiar.firstName,
                lastName: familiar.lastName,
                isOnline: familiar.isOnline,
                avatar: familiar.avatar,
                modifiedDate: familiar.modifiedDate
            });
        }

        return arr;
    }
}