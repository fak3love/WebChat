import React, {useEffect, useState} from 'react';
import {Button, Paper} from "@material-ui/core";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Link, Stack} from "@mui/material";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {RadioProps} from "@material-ui/core/Radio";
import clsx from "clsx";
import {validateEmail, validateLogin, validateName, validatePassword, validateUserName} from "../../utils/validators";
import {authorize, register} from "../../utils/fetch-authorize";
import {LoadingScreen} from "../../components/LoadingScreen";
import {isEmptyStorage} from "../../ts/authorization";
import {goToProfile} from "../../utils/common";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        icon: {
            borderRadius: '50%',
            width: 14,
            height: 14,
            boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
            backgroundColor: '#f5f8fa',
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
            '$root.Mui-focusVisible &': {
                outline: '2px auto rgba(19,124,189,.6)',
                outlineOffset: 2,
            },
            'input:hover ~ &': {
                backgroundColor: '#rgb(27 146 216)',
            },
            'input:disabled ~ &': {
                boxShadow: 'none',
                background: 'rgba(206,217,224,.5)',
            },
        },
        checkedIcon: {
            backgroundColor: 'rgb(27 146 216)',
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
            '&:before': {
                display: 'block',
                width: 14,
                height: 14,
                backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
                content: '""',
            },
            'input:hover ~ &': {
                backgroundColor: 'rgb(27 146 216)',
            },
        }
    }),
);

function StyledRadio(props: RadioProps) {
    const classes = useStyles();

    return (
        <Radio
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            {...props}
        />
    );
}

export const Authorization = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [loginError, setLoginError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [loginServerResponse, setLoginServerResponse] = useState<string>('');

    const [registrationEmailError, setRegistrationEmailError] = useState<string>('');
    const [registrationUserNameError, setRegistrationUserNameError] = useState<string>('');
    const [registrationPasswordError, setRegistrationPasswordError] = useState<string>('');
    const [registrationFirstNameError, setRegistrationFirstNameError] = useState<string>('');
    const [registrationLastNameError, setRegistrationLastNameError] = useState<string>('');
    const [registrationServerResponse, setRegistrationServerResponse] = useState<Array<string>>([]);

    const handleLoginClick = async () => {
        const form = new FormData(document.forms[0]);
        const login = form.get('login');
        const password = form.get('password');

        const loginError = validateLogin(login as string);
        const passwordError = validatePassword(password as string);

        if (loginError === '' && passwordError === '') {
            const {status} = await authorize({login: login as string, password: password as string, saveToStorage: false});

            if (status === 200) {
                goToProfile();
                return;
            }

            if (status === 401)
                setLoginServerResponse('Incorrect username or password');

            return;
        }

        setLoginError(loginError);
        setPasswordError(passwordError);
    }
    const handleRegistrationClick = async () => {
        const form = new FormData(document.forms[1]);
        const email = form.get('email');
        const userName = form.get('username');
        const password = form.get('password');
        const firstName = form.get('firstName');
        const lastName = form.get('lastName');
        const gender = form.get('gender');

        const emailError = validateEmail(email as string);
        const userNameError = validateUserName(userName as string);
        const passwordError = validatePassword(password as string);
        const firstNameError = validateName(firstName as string);
        const lastNameError = validateName(lastName as string);

        if (emailError === '' && userNameError === '' && passwordError === '' && firstNameError === '' && lastNameError === '') {
            const {status, json} = await register({userName: userName as string, email: email as string, password: password as string, firstName: firstName as string, lastName: lastName as string, gender: gender as string, saveToStorage: false});

            if (status === 200) {
                goToProfile();
                return;
            }

            if (status === 400)
                setRegistrationServerResponse(json);

            return;
        }

        setRegistrationEmailError(emailError);
        setRegistrationUserNameError(userNameError);
        setRegistrationPasswordError(passwordError);
        setRegistrationFirstNameError(firstNameError);
        setRegistrationLastNameError(lastNameError);
    }

    useEffect(() => {
        if (!isEmptyStorage()) {
            goToProfile();
            return;
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        setLoginServerResponse('');
    }, [loginError, passwordError]);

    useEffect(() => {
        setRegistrationServerResponse([]);
    }, [registrationEmailError, registrationUserNameError, registrationPasswordError, registrationFirstNameError, registrationLastNameError]);

    if (loading)
        return <LoadingScreen open={loading}/>

    return (
        <Stack spacing={2} direction="column" style={{alignItems: 'end', marginBottom: 15}}>
            <Paper variant='outlined' style={{height: 'max-content', width: '100%', maxWidth: 321, background: 'white'}}>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    style={{margin: 25}}
                >
                    <span style={{display: loginServerResponse === '' ? 'none' : 'block', textAlign: 'center', color: '#d32f2f', fontSize: 12, marginTop: -5, marginBottom: 10}}>{loginServerResponse}</span>
                    <Stack spacing={2} direction="column">
                        <TextField
                            name="login"
                            error={loginError !== ''}
                            id="outlined-error-helper-text"
                            placeholder="Username or email"
                            helperText={loginError}
                            inputProps={{style: {padding: '6px 12px 8px'}}}
                            onChange={() => setLoginError('')}
                        />
                        <TextField
                            name="password"
                            error={passwordError !== ''}
                            id="outlined-error-helper-text"
                            placeholder="Password"
                            helperText={passwordError}
                            type="password"
                            inputProps={{style: {padding: '6px 12px 8px'}}}
                            onChange={() => setPasswordError('')}
                        />
                        <Stack spacing={2} direction="row">
                            <Button variant="outlined" style={{textTransform: 'none', fontWeight: 400, width: 100, height: 35}} disableTouchRipple onClick={handleLoginClick}>Sign in</Button>
                            <Link href="#" style={{alignSelf: 'center', fontSize: 13, textDecoration: 'none'}}>
                                Forgot your password?
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
            <Paper variant='outlined' style={{height: 'max-content', width: '100%', maxWidth: 321, background: 'white'}}>
                <div style={{margin: 25}}>
                    <Stack spacing={0.5} direction="column" style={{textAlign: 'center', marginBottom: 25}}>
                        <span style={{fontSize: 20}}>First time here?</span>
                        <span style={{fontSize: 13, color: '#626d7a'}}>Sign up for WebChat</span>
                    </Stack>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <Stack spacing={1} direction="column">
                            {registrationServerResponse.map(message => <div style={{color: '#d32f2f', fontSize: 12, marginTop: -5, marginBottom: 10, textAlign: 'center'}}>{message}</div>)}
                        </Stack>
                        <Stack spacing={2} direction="column">
                            <FormLabel component="legend" style={{fontSize: 13, color: '#818c99', marginBottom: -5}}>Your login</FormLabel>
                            <TextField
                                name="email"
                                error={registrationEmailError !== ''}
                                id="outlined-error-helper-text"
                                placeholder="Email"
                                helperText={registrationEmailError}
                                inputProps={{style: {padding: '6px 12px 8px'}}}
                                onChange={() => setRegistrationEmailError('')}
                            />
                            <TextField
                                name="username"
                                error={registrationUserNameError !== ''}
                                id="outlined-error-helper-text"
                                placeholder="Username"
                                helperText={registrationUserNameError}
                                inputProps={{style: {padding: '6px 12px 8px'}}}
                                onChange={() => setRegistrationUserNameError('')}
                            />
                            <TextField
                                name="password"
                                error={registrationPasswordError !== ''}
                                id="outlined-error-helper-text"
                                placeholder="Password"
                                helperText={registrationPasswordError}
                                type="password"
                                inputProps={{style: {padding: '6px 12px 8px'}}}
                                onChange={() => setRegistrationPasswordError('')}
                            />
                            <FormLabel component="legend" style={{fontSize: 13, color: '#818c99', marginBottom: -5}}>Your name</FormLabel>
                            <TextField
                                name="firstName"
                                error={registrationFirstNameError !== ''}
                                id="outlined-error-helper-text"
                                placeholder="Your first name"
                                helperText={registrationFirstNameError}
                                inputProps={{style: {padding: '6px 12px 8px'}}}
                                onChange={() => setRegistrationFirstNameError('')}
                            />
                            <TextField
                                name="lastName"
                                error={registrationLastNameError !== ''}
                                id="outlined-error-helper-text"
                                placeholder="Your last name"
                                helperText={registrationLastNameError}
                                inputProps={{style: {padding: '6px 12px 8px'}}}
                                onChange={() => setRegistrationLastNameError('')}
                            />
                            <FormControl component="fieldset">
                                <FormLabel component="legend" style={{fontSize: 13, color: '#818c99'}}>Gender</FormLabel>
                                <RadioGroup row aria-label="gender" defaultValue="female" name="gender">
                                    <FormControlLabel value="female" control={<StyledRadio />} label={<span style={{fontSize: 13}}>Female</span>}/>
                                    <FormControlLabel value="male" control={<StyledRadio />} label={<span style={{fontSize: 13}}>Male</span>} />
                                </RadioGroup>
                            </FormControl>
                            <Stack spacing={2} direction="row">
                                <Button variant="outlined" style={{textTransform: 'none', fontWeight: 400, width: '100%', height: 35}} disableTouchRipple onClick={handleRegistrationClick}>Registration</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </div>
            </Paper>
        </Stack>
    );
};
