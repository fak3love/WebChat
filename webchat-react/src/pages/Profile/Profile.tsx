import React, {useRef, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Avatar, Paper, Tooltip, Button, Divider} from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link} from "react-router-dom";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {faWrench} from '@fortawesome/free-solid-svg-icons'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import avatar2 from "../../assets/images/avatar2.jpg";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Scrollbars from "react-custom-scrollbars";

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
            width: '100%',
            height: '275px'
        },
        btnEdit: {
            display: 'block',
            marginTop: 15,
            width: '100%',
            height: 30,
            background: '#e5ebf1',
            color: '#55677d',
            textAlign: 'center',
            lineHeight: '30px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: 12.5
        },
        btnAvatarBlock: {
            position: 'relative',
            cursor: 'pointer'
        },
        btnDeleteAvatar: {
            position: 'absolute',
            right: 0,
            top: 0,
            background: 'rgba(0,0,0,0.4)',
            width: 20,
            height: 20,
            cursor: 'pointer'
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
        tooltip: {
            background: 'rgba(0,0,0,0.7)'
        },
        arrow: {
            color: 'rgba(0,0,0,0.7)'
        }
    }),
);

const useStatusButtonStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '2px 8px',
            fontSize: 13,
            marginTop: 5,
            textTransform: 'none',
            fontWeight: 400,
            width: '100%',
            justifyContent: 'left',
            borderRadius: 0,
            overflowWrap: 'anywhere'
        }
    }),
);
const useChangeStatusButtonStyles = makeStyles(() =>
    createStyles({
        root: {
            color: '#4986cc',
            fontSize: 14,
            background: 'transparent',
            textTransform: 'none',
            fontWeight: 400,
            marginLeft: -4,
            padding: '2px 4px'
        }
    }),
);

const useStatusDialogTitleStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '8px 16px'
        }
    }),
);

const useStatusDialogContentStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '4px 16px'
        }
    }),
);

export const Profile = () => {
    const classes = useStyles();
    const statusButtonClasses = useStatusButtonStyles();
    const changeStatusButtonClasses = useChangeStatusButtonStyles();
    const statusDialogTitleClasses = useStatusDialogTitleStyles();
    const statusDialogContentClasses = useStatusDialogContentStyles();
    const [visibility, setVisibility] = useState<'visible' | 'collapse'>('collapse');
    const [open, setOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<any>(avatar2);
    const inputUpdatePhotoRef = useRef<any>();
    const inputAddPhotoRef = useRef<any>();

    const handleUpdatePhoto = () => {
        inputAddPhotoRef.current.click();
    };
    const handleAddPhoto = () => {
        inputAddPhotoRef.current.click();
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const Section = ({name, count}: {name: string, count: number}) => {
        return (
            <div style={{padding: '15px 7px', cursor: 'pointer', minWidth: 60}}>
                <div style={{textAlign: 'center', color: '#2A5885', fontSize: 19}}>{count}</div>
                <div style={{textAlign: 'center', fontSize: 13, color: '#626d7a'}}>{name}</div>
            </div>
        );
    }
    const Property = ({name, value}: {name: string, value: string}) => {
        return (
            <div style={{display: 'flex', margin: '5px 0'}}>
                <div style={{minWidth: 165, color: '#818c99', fontSize: 13}}>{name}:</div>
                <div style={{color: '#2a5885', fontSize: 13}}>{value}</div>
            </div>
        );
    }
    const MainInformation = ({isMobile}: {isMobile?: boolean}) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: isMobile ? 0 : 8}}>
                <Property name="Birthday" value="October 20"/>
                <Property name="City" value="Tokyo"/>
                <Property name="Languages" value="Japanese, Korean, Russian, English"/>
            </div>
        );
    }
    const Sections = ({isMobile}: {isMobile?: boolean}) => {
        return (
            <div style={{display: 'flex', padding: isMobile ? 0 : '0 20px', justifyContent: 'center', margin: isMobile ? '-10px 0 -15px 0' : -15}}>
                <Section name="friends" count={49}/>
                <Section name="followers" count={13}/>
                <Section name="photos" count={14}/>
                <Section name="reactions" count={10}/>
            </div>
        );
    }
    const RecommendationBlock = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Avatar src={avatarSrc} style={{width: 50, height: 50, alignSelf: 'center', marginTop: 10}}/>
                <div style={{display: 'flex', flexDirection: 'column', alignSelf: 'center', padding: 5}}>
                    <div style={{fontSize: 14, overflow: 'hidden', textAlign: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: 100}}>Faust</div>
                    <div style={{fontSize: 12, color: '#909499', textAlign: 'center'}}>online</div>
                </div>
                <Link to="/Profile" style={{position: 'absolute', width: 110, height: '100%'}}/>
            </div>
        );
    }
    const RecommendationSection = () => {
        return (
            <React.Fragment>
                <div style={{color: '#6d7885', fontSize: 13, textTransform: 'uppercase', fontWeight: 500, paddingBottom: 10}}>Recommendations</div>
                <Scrollbars style={{width: '100%', height: 101, paddingBottom: 10}} autoHide>
                    <div style={{display: 'flex'}}>
                        <RecommendationBlock/>
                        <RecommendationBlock/>
                        <RecommendationBlock/>
                        <RecommendationBlock/>
                        <RecommendationBlock/>
                    </div>
                </Scrollbars>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className={classes.sectionDesktop}>
                <Paper variant='outlined' style={{minWidth: 205, height: 'max-content', background: 'white', padding: 15}}>
                    <div className={classes.btnAvatarBlock} onMouseMove={() => {setVisibility('visible')}} onMouseLeave={() => {setVisibility('collapse')}}>
                        <Avatar variant="square" className={classes.square} src={avatarSrc}/>
                        <Tooltip title="Delete photo" arrow classes={classes}>
                            <div className={classes.btnDeleteAvatar} style={{visibility: avatarSrc !== null ? visibility : 'collapse'}} onClick={() => {setAvatarSrc(null);}}>
                                <FontAwesomeIcon icon={faTimes} style={{width: 12, height: 12, color: 'white', margin: 4}}/>
                            </div>
                        </Tooltip>
                        <Button className={classes.btnUpdateAvatar} style={{visibility: visibility}} disableTouchRipple={false} onClick={handleUpdatePhoto}>Update photo</Button>
                        <input ref={inputUpdatePhotoRef} type="file" style={{display: 'none'}}/>
                    </div>
                    <Link to="/Profile" className={classes.btnEdit}>Edit</Link>
                </Paper>
                <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <Paper variant="outlined" style={{height: 'max-content', padding: 15, marginLeft: 15}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{fontSize: 19, marginLeft: 8, overflow: 'hidden', maxWidth: '100%'}}>Faust King</div>
                            <div style={{color: '#939393', fontSize: 12.5, minWidth: 50, textAlign: 'right'}}>online</div>
                        </div>
                        <Button classes={statusButtonClasses} disableTouchRipple={true} onClick={handleClickOpen}>
                            I'm tired..
                        </Button>
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <MainInformation/>
                        <Divider style={{margin: '14px 0 14px 8px'}}/>
                        <Sections/>
                    </Paper>
                    <Paper variant="outlined" style={{display: 'flex', height: 'max-content', justifyContent: 'center', padding: 25.5, marginLeft: 15, marginTop: 15, cursor: 'pointer'}} onClick={handleAddPhoto}>
                        <AddAPhotoIcon style={{width: 27, height: 27, color: 'rgb(70 107 142)'}}/>
                        <div style={{marginLeft: 10, fontSize: 13, color: '#2a5885', alignSelf: 'center'}}>Add photos</div>
                        <input ref={inputAddPhotoRef} type="file" style={{display: 'none'}}/>
                    </Paper>
                </div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" classes={statusDialogTitleClasses}>Your status</DialogTitle>
                    <DialogContent classes={statusDialogContentClasses}>
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className={classes.sectionMobile}>
                <Link to="/Settings" style={{position: 'absolute', right: 0, padding: 10}}>
                    <FontAwesomeIcon icon={faWrench} style={{width: 20, height: 20, color: '#495057'}}/>
                </Link>
                <Paper variant='outlined' style={{background: 'white', padding: 15}}>
                    <div style={{display: 'flex'}}>
                        <Avatar src={avatarSrc} style={{width: 70, height: 70, alignSelf: 'center'}}/>
                        <div style={{display: 'flex', flexDirection: 'column', alignSelf: 'center', padding: 15}}>
                            <div style={{fontSize: 18, overflow: 'hidden', overflowWrap: 'anywhere'}}>Faust King</div>
                            <div style={{fontSize: 14, color: '#909499'}}>online</div>
                        </div>
                    </div>
                    <div style={{display: 'flex', fontSize: 15, marginTop: 15}}>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" style={{padding: '0 12px 0 0'}}>
                            <g fill="none" fill-rule="evenodd">
                                <path d="M0 0h20v20H0z"/>
                                <path d="M17.5 5.25a.75.75 0 00-.74-.75H3.24a.74.74 0 00-.74.75c0 .41.34.75.74.75h13.52c.4 0 .74-.33.74-.75zm0 5a.75.75 0 00-.74-.75H3.24a.74.74 0 00-.74.75c0 .41.34.75.74.75h13.52c.4 0 .74-.33.74-.75zm-15 5c0 .41.34.75.76.75h8.98a.75.75 0 00.76-.75.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75z" fill="#99a2ad" fill-rule="nonzero"/>
                            </g>
                        </svg>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>I'm tired..</div>
                            <Button classes={changeStatusButtonClasses} onClick={handleClickOpen}>Change status</Button>
                        </div>
                    </div>
                    <Divider style={{margin: '10px 0'}}/>
                    <MainInformation isMobile={true}/>
                    <Divider style={{margin: '10px 0'}}/>
                    <Sections isMobile={true}/>
                </Paper>
                <Paper variant='outlined' style={{background: 'white', padding: 10, marginTop: 15}}>
                    <RecommendationSection/>
                </Paper>
            </div>
        </React.Fragment>
    );
};