import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Radio, { RadioProps } from '@material-ui/core/Radio';
import {Divider, IconButton, Paper} from "@material-ui/core";
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import {UserBlock} from "../../components/UserBlock";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {CheckBox} from "../../components/CheckBox";
import {range} from "../../utils/array";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputBase from "@material-ui/core/InputBase";
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SearchIcon from "@material-ui/icons/Search";
import MenuItem from '@material-ui/core/MenuItem';
import Scrollbars from "react-custom-scrollbars";
import avatar1 from "../../assets/images/avatar2.jpg";
import avatar2 from "../../assets/images/deadinside400.jpg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            display: 'flex',
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'transparent',
            width: '100%',
        },
        searchIcon: {
            height: '100%',
            pointerEvents: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#93A3BC',
            padding: 8
        },
        searchParameters: {
            padding: 8
        },
        inputRoot: {
            width: '100%',
            fontSize: 13
        },
        inputInput: {
            width: '100%',
            paddingRight: 16
        },
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
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        menuPaper: {
            maxHeight: 260
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

const listAgeFrom = range({start: 14, end: 80}).map(x => <MenuItem value={x} style={{fontSize: 13}}>from {x}</MenuItem>);
const listAgeTo = range({start: 14, end: 80}).map(x => <MenuItem value={x} style={{fontSize: 13}}>to {x}</MenuItem>);

export const Search = () => {
    const classes = useStyles();

    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [cityDisabled, setCityDisabled] = useState<boolean>(true);
    const [showParameters, setShowParameters] = useState<boolean>(false);

    const handleChangeAgeFrom = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAgeFrom(event.target.value as string);
    };
    const handleChangeAgeTo = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAgeTo(event.target.value as string);
    };
    const handleChangeCountry = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCountry(event.target.value as string);

        if (event.target.value !== 0) {
            setCityDisabled(false);
            return;
        }

        setCityDisabled(true);
    };
    const handleChangeCity = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCity(event.target.value as string);
    };

    return (
        <Paper variant='outlined' style={{height: 'max-content', background: 'white', marginBottom: 15}}>
                <div className={classes.search}>
                    <SearchIcon className={classes.searchIcon} />
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                    <IconButton style={{position: 'absolute', right: 0, top: 0, width: 32, height: 32, margin: 4}} onClick={() => setShowParameters(!showParameters)}>
                        <FontAwesomeIcon icon={faAngleDown} style={{width: 20, height: 20, color: '#99A2AD'}}/>
                    </IconButton>
                </div>
                <Divider/>
                <div className={classes.searchParameters} style={{display: showParameters ? 'block' : 'none'}}>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <FormControl component="fieldset" style={{margin: '8px 16px'}}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>Gender</FormLabel>
                            <RadioGroup defaultValue="any" aria-label="gender" name="customized-radios">
                                <FormControlLabel value="female" control={<StyledRadio />} label={<span style={{fontSize: 13}}>Female</span>}/>
                                <FormControlLabel value="male" control={<StyledRadio />} label={<span style={{fontSize: 13}}>Male</span>}/>
                                <FormControlLabel value="any" control={<StyledRadio />} label={<span style={{fontSize: 13}}>Any</span>}/>
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset" style={{margin: '8px 16px'}}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>Relationship</FormLabel>
                            <CheckBox text="With photo"/>
                            <CheckBox text="Online now"/>
                        </FormControl>
                        <FormControl style={{margin: '8px 16px'}} className={classes.formControl}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>Country</FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={country}
                                onChange={handleChangeCountry}
                                style={{fontSize: 13, marginTop: 2}}
                                disableUnderline
                            >
                                <MenuItem value={0} style={{fontSize: 13}}>Select a country</MenuItem>
                                <MenuItem value={1} style={{fontSize: 13}}>Japan</MenuItem>
                                <MenuItem value={2} style={{fontSize: 13}}>Korea</MenuItem>
                                <MenuItem value={3} style={{fontSize: 13}}>USA</MenuItem>
                                <MenuItem value={4} style={{fontSize: 13}}>Russia</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{margin: '8px 16px'}} className={classes.formControl} disabled={cityDisabled}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>City</FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={city}
                                onChange={handleChangeCity}
                                style={{fontSize: 13, marginTop: 2}}
                                disableUnderline
                            >
                                <MenuItem value={0} style={{fontSize: 13}}>Select a city</MenuItem>
                                <MenuItem value={1} style={{fontSize: 13}}>Tokyo</MenuItem>
                                <MenuItem value={2} style={{fontSize: 13}}>Seoul</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{margin: '8px 16px'}} className={classes.formControl}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>Age from</FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={ageFrom}
                                onChange={handleChangeAgeFrom}
                                style={{fontSize: 13, marginTop: 2}}
                                disableUnderline
                                MenuProps={{classes: {paper: classes.menuPaper}}}
                            >
                                <MenuItem value={0} style={{fontSize: 13}}>From</MenuItem>
                                {listAgeFrom}
                            </Select>
                        </FormControl>
                        <FormControl style={{margin: '8px 16px'}} className={classes.formControl}>
                            <FormLabel component="legend" style={{fontSize: 13, fontWeight: 600, color: 'rgba(0, 0, 0, 0.54)'}}>Age to</FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={ageTo}
                                onChange={handleChangeAgeTo}
                                style={{fontSize: 13, marginTop: 2}}
                                disableUnderline
                                MenuProps={{classes: {paper: classes.menuPaper}}}
                            >
                                <MenuItem value={0} style={{fontSize: 13}}>To</MenuItem>
                                {listAgeTo}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Divider style={{display: showParameters ? 'block' : 'none'}}/>
                <Scrollbars style={{height: 500}} autoHide>
                    <div style={{display: 'flex', flexDirection: 'column', padding: 15}}>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info="I'm tired.."/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                        <Divider style={{margin: '15px -15px'}}/>
                        <UserBlock userId="faust" firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info="1000-7?"/>
                    </div>
                </Scrollbars>
            </Paper>
    );
};
