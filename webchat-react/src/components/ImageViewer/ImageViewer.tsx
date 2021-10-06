import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, IconButton, Tooltip} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faPaperPlane, faTimes, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
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
import {deleteRequest, get, post} from "../../ts/requests";
import {getUserId, headers} from "../../ts/authorization";
import moment from "moment";
import {isEmptyOrSpaces} from "../../utils/validators";

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
        },
        backdropImgWrapper: {
            display: 'flex',
            height: '100%',
            maxWidth: 1300
        },
        backdropImgBlock: {
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            padding: '0 40px'
        },
        backdropImg: {
            maxWidth: '90%',
            maxHeight: '90%',
            alignSelf: 'center'
        },
        infoWrapper: {
            display: 'flex',
            margin: 10
        },
        infoName: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            marginLeft: 15
        },
        infoCreatedDate: {
            fontSize: 12,
            color: '#939393'
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
    userId: string | undefined | null,
    viewPhoto: {src: string, slug: string} | undefined,
    isOpen: boolean,
    closeClick: any,
    onDeleted: any
}

const defaultPhoto = {
    slug: '',
    createdDate: '',
    likes: 0,
    liked: false,
    editable: false
}

export const ImageViewer = ({userId, viewPhoto, isOpen, closeClick, onDeleted}: ImageViewerType) => {
    const classes = useStyles();
    const inputClasses = useInputStyles();

    const [attachedImages, setAttachedImages] = useState<Array<{src: any, uniqueKey: string}>>([]);
    const [replaying, setReplaying] = useState<{commentId: string, firstName: string} | null>(null);
    const [user, setUser] = useState<{firstName: string, lastName: string, avatar: string}>();
    const [styleInfo, setStyleInfo] = useState<object>({filter: 'blur(8px)', pointerEvents: 'none'});
    const [loadFrom, setLoadFrom] = useState<number>(0);
    const [hasNoComments, setHasNoComments] = useState<boolean>(false);
    const [lockLoading, setLockLoading] = useState<boolean>(false);
    const [disabledControls, setDisabledControl] = useState<boolean>(false);

    const [photo, setPhoto] = useState<{slug: string, createdDate: string, likes: number, liked: boolean, editable: boolean}>(defaultPhoto);
    const [comments, setComments] = useState<CommentType[]>([]);

    const inputCommentRef = useRef<any>();
    const inputAttachImgRef = useRef<any>();
    const scrollbarRef = useRef<any>();

    const handleUndoReplyingClick = () => {
        setReplaying(null);
        setAttachedImages([]);
        inputCommentRef.current.value = null;
    }
    const handleFileSelect = (event: any) => {
        const files: Array<Blob> = event.target.files;
        const reader = new FileReader();
        const images: Array<{src: any, uniqueKey: string}> = [...attachedImages];
        let i = 0;

        reader.readAsArrayBuffer(files[i]);

        reader.onload = (file: any) => {
            const imageBaseString = btoa(
                new Uint8Array(file.target.result)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            images.push({src: 'data:image/png;base64, ' + imageBaseString, uniqueKey: nanoid()});

            i++;
            if (i < files.length)
                reader.readAsArrayBuffer(files[i]);
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
        inputCommentRef.current.value = `${firstName}, `;
        inputCommentRef.current.focus();
    }
    const handleSendComment = async () => {
        if (attachedImages.length > 10 || (attachedImages.length === 0 && isEmptyOrSpaces(inputCommentRef.current.value)))
            return;

        setDisabledControl(true);

        const response = await post({url: 'UserPhotoComments/WriteComment', headers: headers, body: JSON.stringify({
                replyCommentId: replaying?.commentId,
                photoSlug: viewPhoto?.slug,
                messageText: inputCommentRef.current.value,
                messagePhotos: attachedImages.map(img => img.src)
            })});

        if (response.ok) {
            const json = await response.json();

            setComments(comments.concat({
                userId: json.userId,
                commentId: json.commentId,
                firstName: json.firstName,
                lastName: json.lastName,
                avatar: json.avatar,
                createdDate: json.createdDate,
                likes: 0,
                liked: false,
                message: json.message,
                attachedImages: attachedImages.length > 0 ? attachedImages.map(img => img.src) : [],
                reply: json.reply
            } as CommentType));

            setLoadFrom(loadFrom + 1);
            setAttachedImages([]);
            setReplaying(null);
            inputCommentRef.current.value = null;
            scrollbarRef.current.scrollToBottom();
        }

        setDisabledControl(false);
    }
    const handleChangeLike = async (liked: boolean) => {
        let response: Response;

        if (liked)
            response = await post({url: 'UserPhotos/LikePhoto', headers: headers, body: JSON.stringify({photoSlug: viewPhoto?.slug})});
        else
            response = await deleteRequest({url: 'UserPhotos/RemoveLike', headers: headers, body: JSON.stringify({photoSlug: viewPhoto?.slug})});

        if (response.ok)
            setPhoto({...photo, liked: liked, likes: liked ? photo.likes + 1 : (photo.likes - 1 >= 0 ? photo.likes - 1 : 0)});
    }
    const handleDeletePhoto = async () => {
        const response = await deleteRequest({url: 'UserPhotos/RemovePhoto', headers: headers, body: JSON.stringify({photoSlug: viewPhoto?.slug})});

        if (response.ok)
            onDeleted(viewPhoto?.slug);
    }
    const handleDeleteComment = async (commentId: string) => {
        await deleteRequest({url: 'UserPhotoComments/RemoveComment', headers: headers, body: JSON.stringify({commentId: commentId})});

        setComments(comments.filter(comment => comment.commentId !== commentId));
    }
    const handleShowReply = (commentId: string, replyCommentId: string) => {
        const commentDiv: any = document.getElementById(commentId);
        const replyCommentDiv: any = document.getElementById(replyCommentId);
        const scrollTop = commentDiv.scrollTop;

        replyCommentDiv.style.background = '#F0F2F5';

        setTimeout(() => {
            replyCommentDiv.style.background = 'transparent';
        }, 2000);

        scrollbarRef.current.scrollToTop(scrollTop);
    }

    const loadComments = async () => {
        if (lockLoading)
            return;

        setLockLoading(true);
        const response = await get({url: `UserPhotoComments/GetByPhotoSlug/${viewPhoto?.slug}?loadFrom=${loadFrom + 20}`, headers: headers});

        if (response.ok) {
            setComments(comments.concat(await response.json()));
            setLoadFrom(loadFrom + 20);
        }

        if (response.status === 404)
            setHasNoComments(true);

        setLockLoading(false);
    }

    useEffect(() => {
        if (viewPhoto !== undefined && viewPhoto.slug !== photo.slug) {
            setHasNoComments(false);
            setLoadFrom(0);
            setStyleInfo({filter: 'blur(8px)', pointerEvents: 'none'});

            Promise.all([
                get({url: `UserProfiles/GetHeader/${userId}`, headers: headers}),
                get({url: `UserPhotos/GetPhotoInfo/${getUserId()}/${viewPhoto?.slug}`, headers: headers}),
                get({url: `UserPhotoComments/GetByPhotoSlug/${viewPhoto?.slug}?loadFrom=0`, headers: headers})
            ]).then(async response => {
                if (response[0].ok && response[1].ok) {
                    setUser(await response[0].json());
                    setPhoto(await response[1].json());
                }

                if (response[2].ok)
                    setComments(await response[2].json());
                else if (response[2].status === 404) {
                    setComments([]);
                    setHasNoComments(true);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewPhoto]);

    useEffect(() => {
        if (photo !== defaultPhoto)
            setStyleInfo({filter: 'none', pointerEvents: 'auto'});
    }, [photo]);

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
                <div className={classes.backdropImgWrapper}>
                    <div className={classes.backdropImgSection}>
                        <div className={classes.backdropImgBlock}>
                            <img src={viewPhoto?.src} className={classes.backdropImg} alt={viewPhoto?.slug}/>
                        </div>
                    </div>
                    <div className={classes.infoSection} style={styleInfo}>
                        <div className={classes.infoWrapper}>
                            <Link to={getUserId() === userId ? '/Profile' : `/Profile/${userId}`} onClick={closeClick}>
                                <Avatar alt="Remy Sharp" src={user?.avatar} style={{width: 40, height: 40}} />
                            </Link>
                            <div className={classes.infoName}>
                                <Link to={getUserId() === userId ? '/Profile' : `/Profile/${userId}`} className={classes.friendBlockLink} onClick={closeClick}>{user?.firstName} {user?.lastName}</Link>
                                <div className={classes.infoCreatedDate}>{moment(photo?.createdDate).format('LL')}</div>
                            </div>
                        </div>
                        <IconButton className={classes.btnCloseMobile} onClick={closeClick}>
                            <CloseIcon style={{width: 20, height: 20, color: 'black'}}/>
                        </IconButton>
                        <Divider/>
                        <div style={{display: 'flex', margin: 10}}>
                            <Likebar btnWidth={36} btnHeight={36} iconWidth={24} iconHeight={24} likeCount={photo?.likes} isLiked={photo?.liked} fontSize={13} onChange={handleChangeLike}/>
                            <Tooltip title="Share" arrow>
                                <IconButton style={{marginLeft: 10, width: 36, height: 36}} disableTouchRipple>
                                    <svg style={{width: 22, height: 22, color: 'rgb(166 172 183)'}} aria-hidden="true" focusable="false" data-prefix="far" data-icon="share" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-share fa-w-18 fa-2x">
                                        <path fill="currentColor" d="M561.938 190.06L385.94 14.107C355.79-16.043 304 5.327 304 48.047v80.703C166.04 132.9 0 159.68 0 330.05c0 73.75 38.02 134.719 97.63 173.949 37.12 24.43 85.84-10.9 72.19-54.46C145.47 371.859 157.41 330.2 304 321.66v78.28c0 42.64 51.73 64.15 81.94 33.94l175.997-175.94c18.751-18.74 18.751-49.14.001-67.88zM352 400V272.09c-164.521 1.79-277.44 33.821-227.98 191.61C88 440 48 397.01 48 330.05c0-142.242 160.819-153.39 304-154.02V48l176 176-176 176z"/>
                                    </svg>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                                <IconButton style={{display: photo?.editable ? 'flex' : 'none', position: 'absolute', right: 12, width: 36, height: 36}} disableTouchRipple onClick={handleDeletePhoto}>
                                    <FontAwesomeIcon icon={faTrashAlt} style={{width: 18, height: 18, color: 'rgb(166 172 183)'}}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Divider/>
                        <Scrollbars ref={scrollbarRef} style={{color: 'black', height: '100%'}} onScrollFrame={value => {
                            if (value.top >= 0.8 && !hasNoComments)
                                loadComments();
                        }}>
                            {comments.map(comment =>
                                <Comment key={comment.commentId}
                                         userId={comment.userId}
                                         commentId={comment.commentId}
                                         firstName={comment.firstName}
                                         lastName={comment.lastName}
                                         avatar={comment.avatar}
                                         createdDate={comment.createdDate}
                                         likes={comment.likes}
                                         liked={comment.liked}
                                         message={comment.message}
                                         attachedImages={comment.attachedImages}
                                         reply={comment.reply}
                                         editable={photo.editable}
                                         deleteClick={handleDeleteComment}
                                         replyClick={handleReplyClick}
                                         showReplyClick={handleShowReply}
                                />
                            )}
                        </Scrollbars>
                        <Divider/>
                        <Scrollbars style={{display: attachedImages.length > 0 ? 'block' : 'none', height: 325}}>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                {attachedImages.map(img => <AttachedImage disabled={disabledControls} key={img.uniqueKey} src={img.src} uniqueKey={img.uniqueKey} maxHeight={100} unpinClick={handleUnpinImage}/>)}
                            </div>
                        </Scrollbars>
                        <div style={{display: 'flex', minHeight: 'max-content', padding: 0}}>
                            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                <TextField placeholder="Leave a comment..." disabled={disabledControls} multiline fullWidth maxRows={6} variant="outlined" style={{margin: 8}} InputProps={{classes: inputClasses, className: classes.inputRoot, id: "input-message"}} inputRef={inputCommentRef}/>
                            </div>
                            <Tooltip title="Undo replying" arrow>
                                <Button disableTouchRipple={true} disabled={disabledControls} style={{display: replaying !== null ? 'grid' : 'none', minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={handleUndoReplyingClick}>
                                    <FontAwesomeIcon icon={faTimes} style={{width: 18, height: 18, color: '#A6ACB7'}}/>
                                </Button>
                            </Tooltip>
                            <Tooltip title="Attach a photo" arrow>
                                <Button disableTouchRipple={true} disabled={disabledControls} style={{minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={() => {inputAttachImgRef.current.value = null; inputAttachImgRef.current.click()}}>
                                    <FontAwesomeIcon icon={faCamera} style={{width: 18, height: 18, color: '#A6ACB7'}}/>
                                    <input ref={inputAttachImgRef} style={{display: 'none'}} type="file" multiple={true} accept="image/*" onChange={handleFileSelect}/>
                                </Button>
                            </Tooltip>
                            <Tooltip title={'Send a comment'} arrow>
                                <Button disableTouchRipple={true} disabled={disabledControls} style={{minWidth: 36, height: 36, borderRadius: '50%', margin: 5}} onClick={handleSendComment}>
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
