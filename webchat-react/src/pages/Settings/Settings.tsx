import React, {useEffect, useRef, useState} from 'react';
import "./Settings.css";
import {Divider, Paper} from "@material-ui/core";
import {MessageTab} from "../../components/MessageTab";
import {useHistory} from 'react-router-dom'
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {SettingsItem} from "./SettingsItem";
import {range} from "../../utils/array";
import {encryptEmail, getWithCapitalLetter} from "./utils";
import moment from "moment";
import {get} from "../../ts/requests";
import {headers} from "../../ts/authorization";
import {
    handleChangePassword,
    handleSaveAddress, handleSaveBirthday,
    handleSaveFirstName, handleSaveGender, handleSaveLanguages,
    handleSaveLastName, handleSavePlace,
    handleSaveUserName
} from "./handlers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'column',
                minWidth: 225,
                marginLeft: 15,
                height: 'max-content',
                padding: '6px 0'
            }
        }
    }),
);

export const Settings = () => {
    const classes = useStyles();
    const history = useHistory();
    const [showGeneral, setShowGeneral] = useState<boolean>(true);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [locationSearch, setLocationSearch] = useState<string>('?');
    const [generalData, setGeneralData] = useState<{userName: string, lastUpdatePassword: string, email: string}>();
    const [editData, setEditData] = useState<{firstName: string, lastName: string, gender: string, birthday?: string, country?: string, city?: string, languages: string[]}>();
    const [selectedMonth, setSelectedMonth] = useState<{name: string, days: number}>(months[0]);
    const [selectedCountry, setSelectedCountry] = useState<{name: string, cities: string[]}>(countries[0]);

    const inputChangePasswordOldRef = useRef<any>();
    const inputChangePasswordNewRef = useRef<any>();
    const inputChangePasswordRepeatRef = useRef<any>();
    const inputChangeEmailRef = useRef<any>();
    const inputChangeUserNameRef = useRef<any>();

    useEffect(() => {
        Promise.all([
            get({url: 'Account/GetGeneral', headers: headers}),
            get({url: 'UserProfiles/GetGeneral', headers: headers})
        ]).then(async response => {
            setGeneralData(await response[0].json());
            setEditData(await response[1].json());
        });
    }, []);

    useEffect(() => {
        return history.listen((location) => {
            setLocationSearch(location.search);
        });
    }, [history]);

    useEffect(() => {
        const actualLocation = locationSearch === '?' ? document.location.search : locationSearch;

        if (actualLocation === '') {
            setShowGeneral(true);
            setShowEdit(false);
            return;
        }
        if (actualLocation === '?tab=personal') {
            setShowGeneral(false);
            setShowEdit(true);
            return;
        }
    }, [locationSearch]);

    return (
        <div className="Settings">
            <Paper variant='outlined' className="Settings__content">
                <div style={{display: showGeneral ? 'flex' : 'none', flexDirection: 'column'}}>
                    <div style={{fontSize: 16, background: '#FAFBFC', padding: 20}}>General</div>
                    <Divider/>
                    <SettingsItem leftText="Password" middleText={moment(generalData?.lastUpdatePassword).fromNow()} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Current password</div>
                                <input ref={inputChangePasswordOldRef} type="password" className="Settings__textField"/>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>New password</div>
                                <input ref={inputChangePasswordNewRef} type="password" className="Settings__textField"/>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Repeat new password</div>
                                <input ref={inputChangePasswordRepeatRef} type="password" className="Settings__textField"/>
                            </div>
                            <input type="button" className="Settings__button" value="Change password" onClick={() => handleChangePassword(inputChangePasswordOldRef.current.value, inputChangePasswordNewRef.current.value, inputChangePasswordRepeatRef.current.value)}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Email" middleText={encryptEmail(generalData?.email)} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Email</div>
                                <div style={{color: 'black'}}>{encryptEmail(generalData?.email)}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>New address</div>
                                <input ref={inputChangeEmailRef} type="text" className="Settings__textField"/>
                            </div>
                            <input type="button" className="Settings__button" value="Save address" onClick={() => handleSaveAddress(inputChangeEmailRef.current.value)}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Username" middleText={generalData?.userName} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Username</div>
                                <div style={{color: 'black'}}>{generalData?.userName}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>New username</div>
                                <input ref={inputChangeUserNameRef} type="text" className="Settings__textField"/>
                            </div>
                            <input type="button" className="Settings__button" value="Save username" onClick={() => handleSaveUserName(inputChangeUserNameRef.current.value)}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Language" middleText="English" disabled={true} showBottomBorder={true}/>
                </div>
                <div style={{display: showEdit ? 'flex' : 'none', flexDirection: 'column'}}>
                    <div style={{fontSize: 16, background: '#FAFBFC', padding: 20}}>Basic info</div>
                    <Divider/>
                    <SettingsItem leftText="First name" middleText={editData?.firstName} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>First name</div>
                                <div style={{color: 'black'}}>{editData?.firstName}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>New first name</div>
                                <input type="text" className="Settings__textField"/>
                            </div>
                            <input type="button" className="Settings__button" value="Save first name" onClick={handleSaveFirstName}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Last name" middleText={editData?.lastName} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Last name</div>
                                <div style={{color: 'black'}}>{editData?.lastName}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>New last name</div>
                                <input type="text" className="Settings__textField"/>
                            </div>
                            <input type="button" className="Settings__button" value="Save last name" onClick={handleSaveLastName}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Gender" middleText={getWithCapitalLetter(editData?.gender)} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Gender</div>
                                <div style={{color: 'black'}}>{getWithCapitalLetter(editData?.gender)}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Select your gender</div>
                                <select className="Settings__select" defaultValue={editData?.gender}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <input type="button" className="Settings__button" value="Save gender" onClick={handleSaveGender}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Birthday" middleText={editData !== undefined && editData.birthday !== null ? moment(editData?.birthday).format('LL') : 'not specified'} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Birthday</div>
                                <div style={{color: 'black'}}>{editData !== undefined && editData.birthday !== null ? moment(editData?.birthday).format('LL') : 'not specified'}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Select your date</div>
                                <select className="Settings__selectMini" defaultValue={editData !== undefined && editData.birthday !== null ? months[moment(editData.birthday).month()].name : 'January'} onChange={(event: any) => setSelectedMonth(months.find(month => month.name === event.target.value)!)}>
                                    {months.map(month => <option key={month.name} value={month.name}>{month.name}</option>)}
                                </select>
                                <select className="Settings__selectMini" defaultValue={editData !== undefined && editData.birthday !== null ? moment(editData?.birthday).day() : 1}>
                                    {range({start: 1, end: selectedMonth.days + 1}).map(item => <option key={item}>{item}</option>)}
                                </select>
                                <select className="Settings__selectMini" defaultValue={editData !== undefined && editData.birthday !== null ? moment(editData?.birthday).year() : new Date().getFullYear() - 14}>
                                    {range({start: new Date().getFullYear() - 119, end: new Date().getFullYear() - 13}).map(value => <option key={value} value={value}>{value}</option>)}
                                </select>
                            </div>
                            <input type="button" className="Settings__button" value="Save birthday" onClick={handleSaveBirthday}/>
                        </div>
                    }/>
                    <SettingsItem leftText="Place" middleText={editData !== undefined && editData.country !== null  && editData.city !== null ? getWithCapitalLetter(editData?.country) + ", " + getWithCapitalLetter(editData?.city) : 'not specified'} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Your place</div>
                                <div style={{color: 'black'}}>{editData !== undefined && editData.country !== null  && editData.city !== null ? getWithCapitalLetter(editData?.country) + ", " + getWithCapitalLetter(editData?.city) : 'not specified'}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Select your place</div>
                                <select className="Settings__selectMini" defaultValue={editData !== undefined ? editData.country?.toLowerCase() : ''} onChange={(event: any) => setSelectedCountry(countries.find(country => country.name === event.target.value)!)}>
                                    {countries.map(country => <option key={country.name} value={country.name.toLowerCase()}>{country.name}</option>)}
                                </select>
                                <select className="Settings__selectMini" defaultValue={editData !== undefined ? editData.city?.toLowerCase() : ''}>
                                    {selectedCountry.cities.map(item => <option key={item} value={item.toLowerCase()}>{item}</option>)}
                                </select>
                            </div>
                            <input type="button" className="Settings__button" value="Save your place" onClick={handleSavePlace}/>
                        </div>
                    }/>
                    <SettingsItem showBottomBorder={true} leftText="Languages" middleText={editData !== undefined && editData.languages.length > 0 ? editData.languages.map(language => getWithCapitalLetter(language)).join(', ') : 'not specified'} hiddenContent={
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: 13, color: '#2a5885'}}>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Languages</div>
                                <div style={{color: 'black', maxWidth: 275}}>{editData !== undefined && editData.languages.length > 0 ? editData.languages.map(language => getWithCapitalLetter(language)).join(', ') : 'not specified'}</div>
                            </div>
                            <div style={{display: 'flex', padding: '0 0 10px 0'}}>
                                <div style={{width: 155, alignSelf: 'center'}}>Enter languages</div>
                                <input type="text" className="Settings__textField" placeholder="English, Japanese, Russian"/>
                            </div>
                            <input type="button" className="Settings__button" value="Save languages" onClick={handleSaveLanguages}/>
                        </div>
                    }/>
                </div>
            </Paper>
            <Paper variant='outlined' style={{display: document.body.offsetWidth > 600 ? 'flex' : 'none'}} className={classes.paper}>
                <MessageTab title="General" selected={showGeneral} onClick={() => history.push(`/Settings`)}/>
                <MessageTab title="Basic info" selected={showEdit} onClick={() => history.push(`/Settings?tab=personal`)}/>
            </Paper>
        </div>
    );
};

const months = [
    {name: 'January', days: 31},
    {name: 'February', days: 29},
    {name: 'March', days: 31},
    {name: 'April', days: 30},
    {name: 'May', days: 31},
    {name: 'June', days: 30},
    {name: 'July', days: 31},
    {name: 'August', days: 31},
    {name: 'September', days: 30},
    {name: 'October', days: 31},
    {name: 'November', days: 30},
    {name: 'December', days: 31},
]
const countries = [
    {name: 'Japan', cities: ['Tokyo', 'Kyoto']},
    {name: 'Korea', cities: ['Seoul', 'Busan']}
]