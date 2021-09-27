import React, {useContext, useEffect, useRef, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {LoadingScreen} from "../../components/LoadingScreen";
import {getUserId, headers, isEmptyStorage} from "../../ts/authorization";
import {ImageViewer} from "../../components/ImageViewer";
import {Sections} from "./Sections";
import {MainInformation} from "./MainInformation";
import {UnderAvatar} from "./UnderAvatar";
import {deleteRequest, get, patch, post} from "../../ts/requests";
import {
    getProfile,
    getUserProfileByJsonText,
    tryRedirectByOk
} from "./utils";
import {Button, Divider, Avatar, Paper, Tooltip} from "@material-ui/core";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import DialogContentText from '@material-ui/core/DialogContentText';
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import "./Profile.css";
import {getVisitorId, goToAuthorization, goToProfile, isVisitor} from "../../utils/common";
import {LayoutContext} from "../../components/Layout/Layout";

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

export enum FriendStatuses {
    friends = 1,
    followerTarget = 2,
    targetFollower = 3
}
export type FriendStatus = {
    initiatorId: string,
    targetId: string,
    status: FriendStatuses
}
type User = {
    visitor: boolean,
    id: string,
    firstName: string,
    lastName: string,
    status: string | null,
    gender: string,
    birthday: string | null,
    city: string | null,
    languages: string[],
    avatar: {slug: string, src: string} | undefined,
    onlineStatus: string,
    friends: number,
    followers: number,
    subscriptions: number,
    photos: number,
    friendStatus: FriendStatus | undefined
}
const defaultUser: User = {
    visitor: true,
    id: '1',
    firstName: 'FirstName',
    lastName: 'LastName',
    status: 'Status message',
    gender: 'Male',
    birthday: null,
    city: null,
    languages: ['Language1', 'Language2', 'Language3'],
    avatar: undefined,
    onlineStatus: 'online',
    friends: 49,
    followers: 13,
    subscriptions: 33,
    photos: 11,
    friendStatus: undefined
}

export const Profile = () => {
    const classes = useStyles();
    const mainUserId: any = getUserId();
    const inputUpdatePhotoRef = useRef<any>();
    const inputAddPhotoRef = useRef<any>();
    const inputStatusRef = useRef<any>();

    const layoutValue = useContext(LayoutContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openViewer, setOpenViewer] = useState<boolean>(false);
    const [user, setUser] = useState<User>(defaultUser);

    const handleUpdatePhoto = () => {
        inputUpdatePhotoRef.current.click();
    };
    const handleAddPhoto = () => {
        inputAddPhotoRef.current.click();
    };

    const handleFileSelect = async (event: any, isAvatar: boolean) => {
        const reader = new FileReader();

        reader.readAsArrayBuffer((event.target.files as any)[0]);

        reader.onload = async (file: any) => {
            const imageBaseString = btoa(
                new Uint8Array(file.target.result)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const response = await post({url: 'UserPhotos/UploadPhoto', headers: headers, body: JSON.stringify({isAvatar: isAvatar, imageBaseString: imageBaseString})});

            if (response.status === 201) {
                const src = 'data:image/png;base64, ' + imageBaseString;

                setUser({
                    ...user,
                    avatar: isAvatar ? {
                        slug: await response.text(),
                        src: src,
                    } : user.avatar,
                    photos: user.photos + 1
                });

                if (isAvatar)
                    layoutValue.updateHeader(user.firstName, user.lastName, src);
            }
        }
    }
    const handleDeleteAvatar = async () => {
        const handleDeleteAvatarResponse = await deleteRequest({url: 'UserPhotos/RemovePhoto', headers: headers, body: JSON.stringify({photoSlug: user.avatar?.slug})});

        if (handleDeleteAvatarResponse.ok)
            handleUpdateAvatar();
    }
    const handleUpdateAvatar = async () => {
        const response = await get({url: `UserPhotos/GetAvatar/${mainUserId}`, headers: headers});

        let slug: string = '';
        let src: string = '';

        if (response.ok) {
            slug = await response.text();
            src = 'data:image/png;base64, ' + (await (await get({url: `UserPhotos/GetPhotoBaseString/${slug}`, headers: headers})).text());
        }

        setUser({
            ...user,
            avatar: slug !== '' ? {slug: slug, src: src} : undefined,
            photos: user.photos - 1
        });

        layoutValue.updateHeader(user.firstName, user.lastName, src);
    }
    const handleUpdateStatus = async (statusValue: any) => {
        const patchResponse = await patch({url: 'UserProfiles/Patch', headers, body: JSON.stringify([{op: 'replace', path: '/statusMessage', value: statusValue}])});

        if (patchResponse.ok)
            setUser({
                ...user,
                status: statusValue === undefined ? '' : statusValue
            });
    }
    const handleAddFriend = async () => {
        const postResponse = await post({url: 'UserFriends/AddFriend', headers: headers, body: JSON.stringify({targetId: user.id})});

        let friends = user.friends;
        let followers = user.followers;
        let subscriptions = user.subscriptions;

        if (user.friendStatus !== undefined) {
            friends++;
            subscriptions--;
        }
        else
            followers++;

        if (postResponse.ok) {
            setUser({
                ...user,
                friends: friends,
                followers: followers,
                subscriptions: subscriptions,
                friendStatus: user.friendStatus === undefined ? {
                    initiatorId: mainUserId,
                    targetId: user.id.toString(),
                    status: FriendStatuses.followerTarget
                } : {
                    ...user.friendStatus,
                    status: FriendStatuses.friends
                }
            });
        }
    }
    const handleRemoveFriend = async () => {
        const handleRemoveFriendResponse = await deleteRequest({url: 'UserFriends/RemoveFriend', headers: headers, body: JSON.stringify({targetId: user.id})});

        let friends = user.friends;
        let followers = user.followers;
        let subscriptions = user.subscriptions;

        if (user.friendStatus?.status === FriendStatuses.friends) {
            friends--;
            subscriptions++;
        }
        else
            followers--;

        if (handleRemoveFriendResponse.ok) {
            setUser({
                ...user,
                friends: friends,
                followers: followers,
                subscriptions: subscriptions,
                friendStatus: user.friendStatus?.status === FriendStatuses.friends ? {
                    ...user.friendStatus,
                    status: user.friendStatus.initiatorId === mainUserId ? FriendStatuses.targetFollower : FriendStatuses.followerTarget
                } : undefined
            });
        }
    }
    const handleDeletedAvatar = (slug: string) => {
        setOpenViewer(false);
        handleUpdateAvatar();
    }

    useEffect(() => {
        if (isEmptyStorage()) {
            goToAuthorization();
            return;
        }

        if (document.location.pathname === '/') {
            goToProfile();
            return;
        }

        const visitor = isVisitor('/Profile')
        const visitorId = getVisitorId();

        const handleResponse = (response: any) => {
            tryRedirectByOk(response.ok, visitor);

            response.text().then(async (text: string) => {
                setLoading(false);
                setUser(getUserProfileByJsonText(text, visitor));
            });
        }

        if (!visitor) {
            getProfile(mainUserId).then(handleResponse);
            return;
        }

        getProfile(mainUserId, visitorId).then(handleResponse);
    }, []);

    if (loading)
        return <LoadingScreen open={loading}/>

    return (
        <React.Fragment>
            <div className={classes.sectionDesktop}>
                <Paper variant='outlined' className="avatarPaper">
                    <div className="btnAvatarBlock" style={{cursor: user.avatar !== undefined ? 'pointer' : 'default'}}>
                        <Avatar variant="square" className={classes.square} src={user.avatar?.src} onClick={user.avatar !== undefined ? () => setOpenViewer(true) : undefined}/>
                        <Tooltip title="Delete photo" arrow classes={classes}>
                            <div className="btnDeleteAvatar" style={{visibility: !user.visitor && user.avatar !== undefined ? 'visible' : 'collapse'}} onClick={() => handleDeleteAvatar()}>
                                <FontAwesomeIcon icon={faTimes} className="deleteAvatarIcon"/>
                            </div>
                        </Tooltip>
                        <Button className={classes.btnUpdateAvatar} style={{visibility: !user.visitor ? 'visible' : 'collapse'}} disableTouchRipple={false} onClick={() => {inputUpdatePhotoRef.current.value = null; handleUpdatePhoto();}}>
                            Update photo
                        </Button>
                        <input ref={inputUpdatePhotoRef} type="file" className="displayNone" onChange={event => handleFileSelect(event, true)}/>
                    </div>
                    <UnderAvatar mainUserId={mainUserId} userId={user.id} visitor={user.visitor} friendStatus={user.friendStatus} handleAddFriend={() => handleAddFriend()} handleRemoveFriend={() => handleRemoveFriend()}/>
                </Paper>
                <div className="infoSection">
                    <Paper variant="outlined" className="infoSectionPaper">
                        <div className="infoSectionUser">
                            <div className="infoSectionName">{user.firstName} {user.lastName}</div>
                            <div className="infoSectionOnline">{user.onlineStatus}</div>
                        </div>
                        {!user.visitor ?
                            <Button classes={{root: classes.btnStatusRoot, label: classes.btnStatusLabel}} disableTouchRipple onClick={() => setOpenDialog(true)}>
                                {user.status}
                            </Button> :
                            <div className={classes.btnStatusRoot}>
                                {user.status}
                            </div>
                        }
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <MainInformation birthday={user.birthday} gender={user.gender} city={user.city} languages={user.languages}/>
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <Sections userId={user.id} friends={user.friends} followers={user.followers} subscriptions={user.subscriptions} photos={user.photos} visitor={user.visitor}/>
                    </Paper>
                    <Paper variant="outlined" className="photoPaper" style={{display: user.visitor ? 'none' : 'flex'}} onClick={() => {inputAddPhotoRef.current.value = null; handleAddPhoto();}}>
                        <AddAPhotoIcon style={{width: 27, height: 27, color: 'rgb(70 107 142)'}}/>
                        <div className="photoText">Add photo</div>
                        <input ref={inputAddPhotoRef} type="file" style={{display: 'none'}} onChange={event => handleFileSelect(event, false)}/>
                    </Paper>
                </div>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
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
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {setOpenDialog(false); handleUpdateStatus((inputStatusRef.current as HTMLInputElement)!.value)}} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className={classes.sectionMobile}>
                <Paper variant='outlined' className="mobilePaper">
                    <div className="mobileInfoSection">
                        <Avatar src={user.avatar?.src} style={{width: 70, height: 70, alignSelf: 'center'}} onClick={() => handleUpdatePhoto()}/>
                        <div className="mobileInfoBlock">
                            <div className="mobileInfoName">{user.firstName} {user.lastName}</div>
                            <div className="mobileInfoOnline">{user.onlineStatus}</div>
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
                            <div>{user.status}</div>
                            <Button classes={{root: classes.btnChangeStatusRoot}} style={{display: user.visitor ? 'none' : 'block'}} onClick={() => setOpenDialog(true)}>Change status</Button>
                        </div>
                    </div>
                    <Divider style={{margin: '10px 0'}}/>
                    <MainInformation isMobile={true} languages={user.languages} city={user.city} gender={user.gender} birthday={user.birthday}/>
                    <Divider style={{margin: '10px 0'}}/>
                    <Sections isMobile={true} userId={user.id} friends={user.friends} followers={user.followers} subscriptions={user.subscriptions} photos={user.photos} visitor={user.visitor}/>
                    <Divider style={{margin: '14px 0'}}/>
                    <UnderAvatar mainUserId={mainUserId} userId={user.id} visitor={user.visitor} friendStatus={user.friendStatus} handleAddFriend={handleAddFriend} handleRemoveFriend={handleRemoveFriend}/>
                </Paper>
            </div>
            <ImageViewer userId={isVisitor('/Profile') ? getVisitorId() : mainUserId} viewPhoto={user.avatar !== undefined ? {...user.avatar} : undefined} isOpen={openViewer} closeClick={() => setOpenViewer(false)} onDeleted={handleDeletedAvatar}/>
        </React.Fragment>
    );
};