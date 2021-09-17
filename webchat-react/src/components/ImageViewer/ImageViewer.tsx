import React, {useRef, useState} from 'react';
import {Button, Divider, IconButton, Tooltip} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import avatar2 from "../../assets/images/deadinside400.jpg";
import avatar from "../../assets/images/avatar2.jpg";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faCheckCircle, faPaperPlane, faShare, faTimes, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Scrollbars from "react-custom-scrollbars";
import {Comment} from "../Comment";
import TextField from "@material-ui/core/TextField";
import Backdrop from "@material-ui/core/Backdrop";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {AttachedImage} from "../AttachedImage";
import {Likebar} from "../Likebar";
import {nanoid} from "nanoid";
import {CommentType} from "../Comment/Comment";
import {getTimeDurationByDate} from "../../utils/dates";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('xs')]: {
                height: 500,
            }
        },
        paper: {
            height: '100%',
            maxHeight: 700,
            borderRadius: 4,
            margin: '0 20px',
            border: '1px solid #251a1a',
            background: 'white',
            [theme.breakpoints.down('md')]: {
                width: '100%'
            }
        },
        scrollbars: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('xs')]: {
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
            padding: '20px',
            [theme.breakpoints.down('xs')]: {
                padding: '10px 0',
            },
            [theme.breakpoints.down('sm')]: {
                padding: 20
            }
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
        },
        inputRoot: {
            padding: 10,
            fontSize: 13
        },
        infoSection: {
            display: 'flex',
            flexDirection: 'column',
            width: 400,
            minWidth: 310,
            position: 'relative',
            [theme.breakpoints.down('md')]: {
                width: '100%'
            }
        }
    }),
);

const useInputStyles = makeStyles(() =>
    createStyles({
        root: {
            "& $notchedOutline": {
                borderWidth: 0
            },
            "&:hover $notchedOutline": {
                borderWidth: 0
            },
            "&$focused $notchedOutline": {
                borderWidth: 0
            }
        },
        focused: {},
        notchedOutline: {}
    }),
);

export type ImageViewerType = {
    userId: string,
    photoId: any,
    isOpen: boolean,
    closeClick: any
}

export const ImageViewer = ({userId, photoId, isOpen = false, closeClick}: ImageViewerType) => {
    const classes = useStyles();
    const inputClasses = useInputStyles();

    const [attachedImages, setAttachedImages] = useState<Array<{src: any, uniqueKey: string}>>([]);
    const [replaying, setReplaying] = useState<{commentId: string, firstName: string} | null>(null);
    const [user, setUser] = useState<{firstName: string, lastName: string, avatarSrc: any, liked: boolean}>({firstName: 'Faust', lastName: 'King', avatarSrc: avatar, liked: false});
    const [photo, setPhoto] = useState<{src: any, createdDate: string, likes: number, editable: boolean, comments: Array<CommentType>}>({
        src: avatar2,
        createdDate: getTimeDurationByDate({startDate: new Date('2021.09.17 19:07'), endDate: new Date(), include: 'onlyDate'}),
        likes: 0,
        editable: true,
        comments: [
            {
                commentId: '1',
                userId: '1',
                firstName: 'test',
                lastName: 'test',
                addedDate: '2021.09.17',
                attachedImages: [avatar2],
                isLiked: false,
                likeCount: 5,
                message: 'test',
                avatarSrc: avatar, replyClick: handleReplyClick, reply: undefined}
        ]
    });

    const inputAttachImgRef = useRef<any>();

    const handleUndoReplyingClick = () => {
        setReplaying(null);
        setAttachedImages([]);
    }
    const handleFileSelect = (event: any) => {
        const files: Array<Blob> = event.target.files;
        const reader = new FileReader();
        const images: Array<{src: any, uniqueKey: string}> = [...attachedImages];
        let i = 0;

        reader.readAsDataURL(files[i]);

        reader.onload = (file) => {
            images.push({src: file.target?.result, uniqueKey: nanoid()});

            i++;
            if (i < files.length)
                reader.readAsDataURL(files[i]);
            else
                setAttachedImages(images);
        }
    }
    const handleUnpinImage = (event: any) => {
        const key = event.target.closest('.attachedImg').dataset.imagekey;

        setAttachedImages(attachedImages.filter(img => img.uniqueKey !== key));
    }
    function handleReplyClick(commentId: string, firstName: string) {
        setAttachedImages([]);
        setReplaying({commentId: commentId, firstName: firstName});
    }
    const handleSendComment = () => {
        if (replaying !== null) {
            //send replaying comment;
        }

        //send new comment;
    }

    return (
        <Backdrop className={`${classes.backdrop} backdrop`} open={isOpen} onClick={(event: any) => {
            if (!event.target.classList.contains('backdrop-close') && !event.target.classList.contains('backdrop'))
                return;

            closeClick();
        }}>
            <IconButton className={`${classes.btnClose} backdrop-close`} onClick={closeClick}>
                <CloseIcon style={{width: 30, height: 30, color: 'white'}}/>
            </IconButton>
            <div className={classes.paper}>
                <div style={{display: 'flex', height: '100%', maxWidth: 1300}}>
                    <div className={classes.backdropImgSection}>
                        <div style={{display: 'flex', justifyContent: 'center', height: '100%', padding: '20px 20px 5px 20px'}}>
                            <img src={photo?.src} style={{maxWidth: '100%', alignSelf: 'center'}} alt={photo?.src}/>
                        </div>
                        <div style={{display: 'flex', minHeight: 40, flexDirection: 'row-reverse', padding: '10px 20px'}}>
                            <IconButton style={{display: photo?.editable ? 'block' : 'none', background: '#ffffff0f'}}>
                                <FontAwesomeIcon icon={faTrashAlt} style={{width: 18, height: 18, color: 'rgb(147, 147, 147)'}}/>
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.infoSection}>
                        <div style={{display: 'flex', margin: 10}}>
                            <Link to={`/Profile/${userId}`}>
                                <Avatar alt="Remy Sharp" src={user?.avatarSrc} style={{width: 40, height: 40}} />
                            </Link>
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 15}}>
                                <Link to="/Profile?#userId" className={classes.friendBlockLink}>{user?.firstName} {user?.lastName}</Link>
                                <div style={{fontSize: 12, color: '#939393'}}>{photo?.createdDate}</div>
                            </div>
                        </div>
                        <IconButton className={classes.btnCloseMobile}>
                            <CloseIcon style={{width: 20, height: 20, color: 'black'}}/>
                        </IconButton>
                        <Divider/>
                        <div style={{display: 'flex', margin: 10}}>
                            <Likebar btnWidth={36} btnHeight={36} iconWidth={24} iconHeight={24} likeCount={photo?.likes} isLiked={user?.liked} fontSize={13}/>
                            <IconButton style={{marginLeft: 10, width: 36, height: 36}} disableTouchRipple>
                                <svg style={{width: 22, height: 22, color: 'rgb(166 172 183)'}} aria-hidden="true" focusable="false" data-prefix="far" data-icon="share" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-share fa-w-18 fa-2x">
                                    <path fill="currentColor" d="M561.938 190.06L385.94 14.107C355.79-16.043 304 5.327 304 48.047v80.703C166.04 132.9 0 159.68 0 330.05c0 73.75 38.02 134.719 97.63 173.949 37.12 24.43 85.84-10.9 72.19-54.46C145.47 371.859 157.41 330.2 304 321.66v78.28c0 42.64 51.73 64.15 81.94 33.94l175.997-175.94c18.751-18.74 18.751-49.14.001-67.88zM352 400V272.09c-164.521 1.79-277.44 33.821-227.98 191.61C88 440 48 397.01 48 330.05c0-142.242 160.819-153.39 304-154.02V48l176 176-176 176z"/>
                                </svg>
                            </IconButton>
                        </div>
                        <Divider/>
                        <Scrollbars style={{color: 'black', height: '100%'}}>
                            {photo?.comments.map(comment =>
                                <Comment userId={comment.userId}
                                         firstName={comment.firstName}
                                         lastName={comment.lastName}
                                         addedDate={comment.addedDate}
                                         avatarSrc={comment.avatarSrc}
                                         message={comment.message}
                                         commentId={comment.commentId}
                                         isLiked={comment.isLiked}
                                         likeCount={comment.likeCount}
                                         attachedImages={comment.attachedImages}
                                         reply={comment.reply}
                                         replyClick={handleReplyClick}
                                />
                            )}
                        </Scrollbars>
                        <Divider/>
                        <Scrollbars style={{display: attachedImages.length > 0 ? 'block' : 'none', height: 325}}>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                {attachedImages.map(img => <AttachedImage key={img.uniqueKey} src={img.src} uniqueKey={img.uniqueKey} maxHeight={100} unpinClick={handleUnpinImage}/>)}
                            </div>
                        </Scrollbars>
                        <div style={{display: 'flex', minHeight: 'max-content', padding: 0}}>
                            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                <TextField placeholder="Leave a comment..." multiline fullWidth maxRows={6} variant="outlined" style={{margin: 8}} InputProps={{classes: inputClasses, className: classes.inputRoot, id: "input-message"}}/>
                            </div>
                            <Tooltip title="Undo replying" arrow>
                                <Button disableTouchRipple={true} style={{display: replaying !== null ? 'grid' : 'none', minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={handleUndoReplyingClick}>
                                    <FontAwesomeIcon icon={faTimes} style={{width: 18, height: 18, color: '#A6ACB7'}}/>
                                </Button>
                            </Tooltip>
                            <Tooltip title="Attach a photo" arrow>
                                <Button disableTouchRipple={true} style={{minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={() => {inputAttachImgRef.current.value = null; inputAttachImgRef.current.click()}}>
                                    <FontAwesomeIcon icon={faCamera} style={{width: 18, height: 18, color: '#A6ACB7'}}/>
                                    <input ref={inputAttachImgRef} style={{display: 'none'}} type="file" multiple={true} accept="image/*" onChange={handleFileSelect}/>
                                </Button>
                            </Tooltip>
                            <Tooltip title={'Send a comment'} arrow>
                                <Button disableTouchRipple={true} style={{minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={handleSendComment}>
                                    <FontAwesomeIcon icon={faPaperPlane} style={{width: 18, height: 18, color: '#A6ACB7'}}/>
                                </Button>
                            </Tooltip>
                        </div>
                        <div style={{display: replaying !== null ? 'block' : 'none', margin: '0 15px 15px 15px', fontSize: 13, color: '#828282'}}>
                            replying to <span style={{color: '#2a5885'}}>{replaying?.firstName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Backdrop>
    );
};
