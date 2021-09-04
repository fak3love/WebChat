import React, {useEffect, useState} from 'react';
import {authorize, checkToken} from "../../utils/fetch-authorize";
import {Button, Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import {validateEmail, validatePassword, validateUserName} from "../../utils/validators";
import {ShowErrors} from "../../components/ShowErrors";
import "./Authorization.css";

type TryValidateDataType = {
    login: string,
    password: string
}

export const Authorization = () => {
    const [opacity, setOpacity] = useState<number>(0);
    const [loginErrors, setLoginErrors] = useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const showValidateErrors = ({login, password}: TryValidateDataType) => {
        let loginMessages = validateUserName({value: login});
        let passwordMessages = validatePassword({value: password});

        if (loginMessages.length > 0)
            loginMessages = validateEmail({value: login});

        if (loginMessages.length === 0 && passwordMessages.length === 0)
            return false;

        setLoginErrors(loginMessages.length > 0 ? ["Invalid username or email"] : []);
        setPasswordErrors(passwordMessages);
        return true;
    }

    const loginHandler = async (event: any) => {
        const form: any = document.forms.namedItem("authorization");
        const formData = new FormData(form);
        const login = formData.get("login") as string;
        const password = formData.get("password") as string;
        const saveMe = formData.get("saveMe") !== null;

        if (showValidateErrors({login, password}))
            return;

        const {status} = await authorize({login, password, saveToStorage: saveMe});

        if (status === 200) {
            window.location.href = "/Profile";
            return;
        }

        if (status === 401) {
            setLoginErrors(["Invalid username, email or password"]);
            setPasswordErrors([]);
            return;
        }
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
        <div className="Authorization" style={{opacity: opacity}}>
            <div className="Authorization__box">
                <h3 className="Authorization__title">WebChat - Login</h3>
                <form name="authorization" className="Authorization__form" method="post" action="javascript:void(0)">
                    <ShowErrors>
                        {loginErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="login" className="Authorization__textBox" id="standard-required" label="Username or email"/>
                    <ShowErrors>
                        {passwordErrors?.map(error => {return <span>{error}</span>})}
                    </ShowErrors>
                    <TextField name="password" className="Authorization__textBox" id="standard-required" label="Password"/>
                    <FormControlLabel className="Authorization__checkBoxSaveMe"
                                      control={<Checkbox name="saveMe" color="default" />}
                                      label="Save me"
                    />
                    <div className="Authorization__buttons">
                        <Button id="btnLogin" className="Authorization__btnLogin" type="submit" variant="outlined" color="primary" onClick={loginHandler}>Login</Button>
                        <Button id="btnRegister" className="Authorization__btnRegistration" type="submit" variant="contained" color="primary" onClick={()=>{window.location.href = "/Registration";}}>Registration</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
