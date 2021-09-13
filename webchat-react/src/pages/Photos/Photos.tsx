import React, {useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {Paper, Button, Divider, IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link} from "react-router-dom";
import {Comment} from "../../components/Comment";
import {faShare} from '@fortawesome/free-solid-svg-icons'
import CloseIcon from '@material-ui/icons/Close';
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';
import Scrollbars from "react-custom-scrollbars";
import avatar from '../../assets/images/avatar2.jpg';
import avatar2 from '../../assets/images/deadinside400.jpg';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        paper: {
            display: 'flex',
            height: 600,
            padding: 24,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        scrollbars: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        imageItem: {
            position: 'relative',
            width: 'auto',
            height: 250,
            cursor: 'pointer',
            margin: 5,
            [theme.breakpoints.down('sm')]: {
                height: 100,
            }
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
        },
        backdropImgSection: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            background: '#222222',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        friendBlockLink: {
            color: '#2a5885',
            fontSize: 13,
            maxWidth: 460,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer'
            }
        },
        btnClose: {
            display: 'block',
            position: 'absolute',
            right: 0,
            top: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        btnCloseMobile: {
            display: 'none',
            [theme.breakpoints.down('sm')]: {
                display: 'block',
                position: 'absolute',
                right: 0,
                top: 0,
            }
        }
    }),
);

export const Photos = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClose = (event: any) => {
        if (event.target.classList.contains('MuiBackdrop-root'))
            setOpen(false);
    };
    const handleCloseBtn = (event: any) => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    const ImageItem = ({img}: {img: any}) => {
        return (
            <div className={classes.imageItem} onClick={handleToggle}>
                <img src={img} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
            </div>
        );
    }

    const ProfileBlock = ({firstName, lastName, addedDate, avatarSrc}: {firstName: string, lastName: string, addedDate: string, avatarSrc: any}) => {
        return (
            <div style={{display: 'flex', margin: 10}}>
                <Link to="/Profile?#userId">
                    <Avatar alt="Remy Sharp" src={avatarSrc} style={{width: 40, height: 40}} />
                </Link>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 15}}>
                    <Link to="/Profile?#userId" className={classes.friendBlockLink}>{firstName} {lastName}</Link>
                    <div style={{fontSize: 12, color: '#939393'}}>{addedDate}</div>
                </div>
            </div>
        );
    };

    const ImageSection = ({title, children}: {title: string, children?: JSX.Element | JSX.Element[]}) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{marginLeft: 5, marginBottom: 12, fontSize: 14, fontWeight: 500, color: '#626d7a'}}>{title}</div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Paper variant="outlined" className={classes.paper}>
                <Scrollbars className={classes.scrollbars}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <ImageSection title="2021">
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                        </ImageSection>
                        <ImageSection title="2020">
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar2}/>
                        </ImageSection>
                    </div>
                </Scrollbars>
            </Paper>
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <IconButton className={classes.btnClose} onClick={handleCloseBtn}>
                    <CloseIcon style={{width: 30, height: 30, color: 'white'}}/>
                </IconButton>
                <div style={{width: 'auto', height: 'auto', borderRadius: 4, border: '1px solid #251a1a', background: 'white'}}>
                    <div style={{display: 'flex'}}>
                        <div className={classes.backdropImgSection}>
                            <img src={avatar2} style={{margin: 75}} alt=""/>
                            <Button disableElevation style={{position: 'absolute', right: 0, bottom: 0,color: 'white', textTransform: 'none', fontSize: 13, fontWeight: 400, width: 100, height: 30, margin: 5}}>Delete</Button>
                        </div>
                        <div style={{minWidth: 310, position: 'relative'}}>
                            <ProfileBlock firstName="Faust" lastName="King" addedDate="20 October" avatarSrc={avatar}/>
                            <IconButton className={classes.btnCloseMobile} onClick={handleCloseBtn}>
                                <CloseIcon style={{width: 20, height: 20, color: 'black'}}/>
                            </IconButton>
                            <Divider/>
                            <div style={{display: 'flex', margin: 10}}>
                                <Button>
                                    <FavoriteIcon style={{width: 26, height: 26, color: '#FF3347'}}/>
                                    <div style={{marginLeft: 5, alignSelf: 'center', color: 'rgb(109 109 109)', fontSize: 14}}>99</div>
                                </Button>
                                <Button style={{marginLeft: 10}}>
                                    <FontAwesomeIcon icon={faShare} style={{width: 24, height: 24, color: 'rgb(109 109 109)'}}/>
                                </Button>
                            </div>
                            <Divider/>
                            <Scrollbars style={{height: 275, color: 'black'}}>
                                <Comment userId="faustKing"
                                              firstName="Faust"
                                              lastName="King"
                                              addedDate="2 years ago"
                                              avatarSrc={avatar}
                                              message={'My first comment'}
                                              commentId="4070707"
                                              isLiked
                                              likeCount={100}
                                              reply={{userId: 'deadinside', firstName: 'Kaneki', lastName: 'Ken', commentId: '255050'}}
                                />
                            </Scrollbars>
                            <Divider/>
                            <div style={{margin: 10}}>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Your comment"
                                    multiline
                                    rows={4}
                                    fullWidth={true}
                                />
                                <Button style={{marginTop: 10}}>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Backdrop>
        </div>
    );
};
