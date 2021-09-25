import {get} from "../../ts/requests";
import {headers} from "../../ts/authorization";

export async function getProfileHeader() {
    const response = await get({url: 'UserProfiles/GetHeader', headers: headers});

    if (response.ok) {
        const json = await response.json();

        return {
            firstName: json.firstName,
            lastName: json.lastName,
            avatar: json.avatar
        }
    }
}