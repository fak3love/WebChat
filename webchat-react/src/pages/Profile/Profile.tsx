import React, {useEffect, useReducer, useRef} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link} from "react-router-dom";
import {Button, Divider, Avatar, Paper, Tooltip} from "@material-ui/core";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {faWrench} from '@fortawesome/free-solid-svg-icons'
import DialogContentText from '@material-ui/core/DialogContentText';
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {LoadingScreen} from "../../components/LoadingScreen";
import {getUserId, isEmptyStorage} from "../../ts/authorization";
import {ImageViewer} from "../../components/ImageViewer";
import {Sections} from "./Sections";
import {MainInformation} from "./MainInformation";
import {UnderAvatar} from "./UnderAvatar";
import {
    getProfile,
    getUserProfileByJsonText,
    getVisitorId,
    goToAuthorization, handleAddFriend, handleDeleteAvatar, handleFileSelect, handleRemoveFriend, handleUpdateStatus,
    isVisitor,
    tryRedirectByOk
} from "./utils";
import "./Profile.css";
import {initialState, init, reducer} from "./reducer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        square: {
            width: 205,
            height: '275px'
        },
        tooltip: {
            background: 'rgba(0,0,0,0.7)'
        },
        arrow: {
            color: 'rgba(0,0,0,0.7)'
        },
        btnUpdateAvatar: {
            position: 'absolute',
            fontSize: 12,
            color: 'white',
            width: '100%',
            height: 25,
            bottom: 0,
            borderRadius: 0,
            textTransform: 'none',
            background: 'rgb(58 58 58 / 70%)'
        },
        btnStatusRoot: {
            padding: '2px 8px',
            fontSize: 13,
            marginTop: 5,
            textTransform: 'none',
            fontWeight: 400,
            width: '100%',
            justifyContent: 'left',
            borderRadius: 0,
            overflowWrap: 'anywhere',
            minHeight: 22
        },
        btnStatusLabel: {
            display: 'block',
            height: 22,
            textAlign: 'left'
        },
        btnChangeStatusRoot: {
            color: '#4986cc',
            fontSize: 14,
            background: 'transparent',
            textTransform: 'none',
            fontWeight: 400,
            marginLeft: -4,
            padding: '2px 4px'
        },
        dialogTitleRoot: {
            padding: '8px 16px'
        },
        dialogContentRoot: {
            padding: '4px 16px'
        }
    }),
);

export const Profile = () => {
    const classes = useStyles();
    const mainUserId: any = getUserId();
    const inputUpdatePhotoRef = useRef<any>();
    const inputAddPhotoRef = useRef<any>();
    const inputStatusRef = useRef<any>();

    /* eslint-disable */
    const [state, dispatch] = useReducer(reducer, initialState);

    console.log(state);

    const handleUpdatePhoto = () => {
        inputUpdatePhotoRef.current.click();
    };
    const handleAddPhoto = () => {
        inputAddPhotoRef.current.click();
    };

    useEffect(() => {
        if (isEmptyStorage())
            goToAuthorization();

        const visitor = isVisitor();
        const visitorId = getVisitorId();

        const handleResponse = (response: any) => {
            tryRedirectByOk(response.ok, visitor);

            response.text().then(async (text: string) => {
                dispatch({type: 'hideLoading'});
                dispatch({type: 'updateUser', payload: getUserProfileByJsonText(text, visitor)})
            });
        }

        if (!visitor) {
            getProfile(mainUserId).then(handleResponse);
            return;
        }

        getProfile(mainUserId, visitorId).then(handleResponse);
    }, []);

    if (state.loading)
        return <LoadingScreen open={state.loading}/>

    return (
        <React.Fragment>
            <div className={classes.sectionDesktop}>
                <Paper variant='outlined' className="avatarPaper">
                    <div className="btnAvatarBlock" style={{cursor: state.user.avatar !== undefined ? 'pointer' : 'default'}}>
                        <Avatar variant="square" className={classes.square} src={state.user.avatar?.src} onClick={state.user.avatar !== undefined ? () => dispatch({type: 'showViewer'}) : undefined}/>
                        <Tooltip title="Delete photo" arrow classes={classes}>
                            <div className="btnDeleteAvatar" style={{visibility: !state.user.visitor && state.user.avatar !== undefined ? 'visible' : 'collapse'}} onClick={() => handleDeleteAvatar(state, dispatch)}>
                                <FontAwesomeIcon icon={faTimes} className="deleteAvatarIcon"/>
                            </div>
                        </Tooltip>
                        <Button className={classes.btnUpdateAvatar} style={{visibility: !state.user.visitor ? 'visible' : 'collapse'}} disableTouchRipple={false} onClick={() => {inputUpdatePhotoRef.current.value = null; handleUpdatePhoto();}}>
                            Update photo
                        </Button>
                        <input ref={inputUpdatePhotoRef} type="file" className="displayNone" onChange={event => handleFileSelect(event, true, state, dispatch)}/>
                    </div>
                    <UnderAvatar mainUserId={mainUserId} userId={state.user.id} visitor={state.user.visitor} friendStatus={state.user.friendStatus} handleAddFriend={() => handleAddFriend(state, dispatch)} handleRemoveFriend={() => handleRemoveFriend(state, dispatch)}/>
                </Paper>
                <div className="infoSection">
                    <Paper variant="outlined" className="infoSectionPaper">
                        <div className="infoSectionUser">
                            <div className="infoSectionName">{state.user.firstName} {state.user.lastName}</div>
                            <div className="infoSectionOnline">{state.user.onlineStatus}</div>
                        </div>
                        {!state.user.visitor ?
                            <Button classes={{root: classes.btnStatusRoot, label: classes.btnStatusLabel}} disableTouchRipple onClick={() => dispatch({type: 'showDialog'})}>
                                {state.user.status}
                            </Button> :
                            <div className={classes.btnStatusRoot}>
                                {state.user.status}
                            </div>
                        }
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <MainInformation birthday={state.user.birthday} gender={state.user.gender} city={state.user.city} languages={state.user.languages}/>
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <Sections userId={state.user.id} friends={state.user.friends} followers={state.user.followers} subscriptions={state.user.subscriptions} photos={state.user.photos} visitor={state.user.visitor}/>
                    </Paper>
                    <Paper variant="outlined" className="photoPaper" style={{display: state.user.visitor ? 'none' : 'flex'}} onClick={() => {inputAddPhotoRef.current.value = null; handleAddPhoto();}}>
                        <AddAPhotoIcon style={{width: 27, height: 27, color: 'rgb(70 107 142)'}}/>
                        <div className="photoText">Add photos</div>
                        <input ref={inputAddPhotoRef} type="file" style={{display: 'none'}} onChange={event => handleFileSelect(event, false, state, dispatch)}/>
                    </Paper>
                </div>
                <Dialog open={state.openDialog} onClose={() => dispatch({type: 'hideDialog'})} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" classes={{root: classes.dialogTitleRoot}}>Your status</DialogTitle>
                    <DialogContent classes={{root: classes.dialogContentRoot}}>
                        <DialogContentText>
                            Write any information about yourself, or information about your mood :)
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Status"
                            type="email"
                            fullWidth
                            inputProps={{ref: inputStatusRef}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => dispatch({type: 'hideDialog'})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={async () => {dispatch({type: 'hideDialog'}); await handleUpdateStatus((inputStatusRef.current as HTMLInputElement)?.value, state, dispatch)}} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className={classes.sectionMobile}>
                <Link to="/Settings" className="mobileSettingsLink">
                    <FontAwesomeIcon icon={faWrench} className="mobileSettingsIcon"/>
                </Link>
                <Paper variant='outlined' className="mobilePaper">
                    <div className="mobileInfoSection">
                        <Avatar src={state.user.avatar?.src} style={{width: 70, height: 70, alignSelf: 'center'}}/>
                        <div className="mobileInfoBlock">
                            <div className="mobileInfoName">{state.user.firstName} {state.user.lastName}</div>
                            <div className="mobileInfoOnline">{state.user.onlineStatus}</div>
                        </div>
                    </div>
                    <div className="mobileStatusSection">
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" className="mobileStatusIcon">
                            <g fill="none" fillRule="evenodd">
                                <path d="M0 0h20v20H0z"/>
                                <path d="M17.5 5.25a.75.75 0 00-.74-.75H3.24a.74.74 0 00-.74.75c0 .41.34.75.74.75h13.52c.4 0 .74-.33.74-.75zm0 5a.75.75 0 00-.74-.75H3.24a.74.74 0 00-.74.75c0 .41.34.75.74.75h13.52c.4 0 .74-.33.74-.75zm-15 5c0 .41.34.75.76.75h8.98a.75.75 0 00.76-.75.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75z" fill="#99a2ad" fill-rule="nonzero"/>
                            </g>
                        </svg>
                        <div className="mobileStatusBlock">
                            <div>{state.user.status}</div>
                            <Button classes={{root: classes.btnChangeStatusRoot}} style={{display: state.user.visitor ? 'none' : 'block'}} onClick={() => dispatch({type: 'showDialog'})}>Change status</Button>
                        </div>
                    </div>
                    <Divider style={{margin: '10px 0'}}/>
                    <MainInformation isMobile={true} languages={state.user.languages} city={state.user.city} gender={state.user.gender} birthday={state.user.birthday}/>
                    <Divider style={{margin: '10px 0'}}/>
                    <Sections isMobile={true} userId={state.user.id} friends={state.user.friends} followers={state.user.followers} subscriptions={state.user.subscriptions} photos={state.user.photos} visitor={state.user.visitor}/>
                </Paper>
            </div>
            <ImageViewer userId={state.user.id} photoId={state.user.avatar?.slug} isOpen={state.openViewer} closeClick={() => dispatch({type: 'hideViewer'})}/>
        </React.Fragment>
    );
};