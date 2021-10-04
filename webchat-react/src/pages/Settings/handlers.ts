import {isEmptyOrSpaces} from "../../utils/validators";
import {put} from "../../ts/requests";
import {headers} from "../../ts/authorization";

export const handleChangePassword = async (oldPassword: any, newPassword: any, newPasswordRepeat: any) => {
    if (isEmptyOrSpaces(oldPassword) || isEmptyOrSpaces(newPassword) || isEmptyOrSpaces(newPasswordRepeat) || newPassword !== newPasswordRepeat)
        return;

    const response = await put({url: 'Account/Update', headers: headers, body: JSON.stringify({currentPassword: oldPassword, newPassword: newPassword})});

    if (response.ok)
        alert('The password was changed successfully!');
    else
        alert('There were errors while updating the password!');
}
export const handleSaveAddress = async (email: any) => {
    if (isEmptyOrSpaces(email))
        return;

    const response = await put({url: 'Account/Update', headers: headers, body: JSON.stringify({email: email})});

    if (response.ok)
        alert('The email was changed successfully!');
    else
        alert('There were errors while updating the email!');
}
export const handleSaveUserName = async (userName: any) => {
    if (isEmptyOrSpaces(userName))
        return;

    const response = await put({url: 'Account/Update', headers: headers, body: JSON.stringify({userName: userName})});

    if (response.ok)
        alert('The username was changed successfully!');
    else
        alert('There were errors while updating the username!');
}
export const handleSaveFirstName = () => {

}
export const handleSaveLastName = () => {

}
export const handleSaveGender = () => {

}
export const handleSaveBirthday = () => {

}
export const handleSavePlace = () => {

}
export const handleSaveLanguages = () => {

}