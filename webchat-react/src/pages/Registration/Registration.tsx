import React, {useEffect, useState} from 'react';
import "./Registration.css";
import {ShowErrors} from "../../components/ShowErrors";
import {Button, Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import {checkToken, register} from "../../utils/fetch-authorize";
import {validateEmail, validateName, validatePassword, validateUserName} from "../../utils/validators";

type TryValidateDataType = {
    userName: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
}

export const Registration = () => {
    const [opacity, setOpacity] = useState<number>(0);
    const [userNameErrors, setUserNameErrors] = useState<string[]>([]);
    const [emailErrors, setEmailErrors] = useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [firstNameErrors, setFirstNameErrors] = useState<string[]>([]);
    const [lastNameErrors, setLastNameErrors] = useState<string[]>([]);

    const showValidateErrors = ({userName, password, email, firstName, lastName}: TryValidateDataType) => {
        let userNameMessages = validateUserName({value: userName});
        let passwordMessages = validatePassword({value: password});
        let emailMessages = validateEmail({value: email});
        let firstNameMessages = validateName({value: firstName});
        let lastNameMessages = validateName({value: lastName});

        if (userNameMessages.length === 0 && passwordMessages.length === 0 && emailMessages.length === 0 && firstNameMessages.length === 0 && lastNameMessages.length === 0)
            return false;

        setUserNameErrors(userNameMessages);
        setPasswordErrors(passwordMessages);
        setEmailErrors(emailMessages);
        setFirstNameErrors(firstNameMessages);
        setLastNameErrors(lastNameMessages);
        return true;
    }

    const registerHandler = async (event: any) => {
        const form: any = document.forms.namedItem("registration");
        const formData = new FormData(form);
        const userName = formData.get("userName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const saveMe = formData.get("saveMe") !== null;

        if (showValidateErrors({userName, email, password, firstName, lastName}))
            return;

        const {status, json} = await register({userName, password, email, firstName, lastName, saveToStorage: saveMe});

        if (status === 200) {
            window.location.href = "/Profile";
            return;
        }

        const userNameString = json[0].startsWith("Username") ? json[0] : "";
        const emailString = json[0].startsWith("Email") ? json[0] : json[1];

        setUserNameErrors([userNameString]);
        setEmailErrors([emailString]);
        setPasswordErrors(json.Password);
        setFirstNameErrors(json.FirstName);
        setLastNameErrors(json.LastName);
    }

    useEffect(() => {
        checkToken().then(result => {
            if (result) {
                document.location.href = "/Profile";
                return;
            }

            setOpacity(100);
        });
    }, []);

    return (
        <div className="Registration" style={{opacity: opacity}}>
            <div className="Registration__box">
                <h3 className="Registration__title">WebChat - Registration</h3>
                <form name="registration" className="Registration__form" method="post" action="javascript:void(0)">
                    <ShowErrors>
                        {userNameErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="userName" className="Registration__textBox" id="standard-required" label="Username"/>
                    <ShowErrors>
                        {emailErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="email" className="Registration__textBox" id="standard-required" label="Email"/>
                    <ShowErrors>
                        {passwordErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="password" className="Registration__textBox" id="standard-required" label="Password"/>
                    <ShowErrors>
                        {firstNameErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="firstName" className="Registration__textBox" id="standard-required" label="First Name"/>
                    <ShowErrors>
                        {lastNameErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="lastName" className="Registration__textBox" id="standard-required" label="Last Name"/>
                    <FormControlLabel className="Registration__checkBoxSaveMe"
                                      control={<Checkbox name="saveMe" color="default" />}
                                      label="Save me"
                    />
                    <div className="Registration__buttons">
                        <Button id="btnLogin" className="Registration__btnLogin" type="submit" variant="outlined" color="primary" onClick={()=>{window.location.href = "/Authorization";}}>Login</Button>
                        <Button id="btnRegister" className="Registration__btnRegistration" type="submit" variant="contained" color="primary" onClick={registerHandler}>Registration</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
