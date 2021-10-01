import React, {useContext, useEffect, useRef, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Divider, IconButton, Paper, TextField, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import {faPaperclip} from '@fortawesome/free-solid-svg-icons'
import {faCamera} from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import Avatar from "@material-ui/core/Avatar";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Scrollbars from "react-custom-scrollbars";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {useHistory} from 'react-router-dom'
import {nanoid} from 'nanoid'
import {Searchbar} from "../../components/Searchbar";
import {AttachedImage} from "../../components/AttachedImage";
import {Message} from "../../components/Message";
import {build} from "../../utils/messages";
import {MessageSection} from "../../components/MessageSection";
import {first} from "../../utils/array";
import {deleteRequest, get} from "../../ts/requests";
import {getUserId, headers} from "../../ts/authorization";
import {getVisitorId} from "../../utils/common";
import moment from "moment";
import {SignalRContext} from "../../contextes/SignalRContext";
import {isEmptyOrSpaces} from "../../utils/validators";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            width: 'auto',
            [theme.breakpoints.up('sm')]: {
                width: 525,
            }
        },
        inputRoot: {
            padding: 10,
            fontSize: 13
        },
        btnBack: {
            display: 'block',
            minWidth: 100,
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        link: {
            display: 'inline-block',
            fontSize: 13,
            fontWeight: 500,
            maxWidth: 250,
            textDecoration: 'none',
            color: 'black',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            [theme.breakpoints.down('sm')]: {
                maxWidth: 200,
            },
        }
    }),
);
const useListItemStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '4px 8px',
        }
    }),
);
const useListItemIconStyles = makeStyles(() =>
    createStyles({
        root: {
            minWidth: 16,
            marginRight: 8
        }
    }),
);
const useListItemTextStyles = makeStyles(() =>
    createStyles({
        root: {
            fontSize: 13.5
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

export type RawMessage = {
    userId: string,
    messageId: string,
    writtenDate: string,
    editedDate?: string | null,
    messageText: string,
    messageImages: string[],
    selected: boolean,
    isRead: boolean
}

export const Messages = () => {
    const classes = useStyles();
    const listItemClasses = useListItemStyles();
    const listItemIconClasses = useListItemIconStyles();
    const listItemTextClasses = useListItemTextStyles();
    const inputClasses = useInputStyles();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [attachedImages, setAttachedImages] = useState<Array<{src: any, uniqueKey: string}>>([]);
    const [messages, setMessages] = useState<RawMessage[]>([]);
    const [editMessageId, setEditMessageId] = useState<string>('');
    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
    const [loadFrom, setLoadFrom] = useState<number>(0);
    const [lockLoading, setLockLoading] = useState<boolean>(false);
    const [hasNoMessages, setHasNoMessages] = useState<boolean>(false);
    const [user, setUser] = useState<{userId: string, firstName: string, lastName: string, onlineStatus: string, avatar: string}>();
    const [target, setTarget] = useState<{userId: string, firstName: string, lastName: string, onlineStatus: string, avatar: string}>();
    const [typingDotsInterval, setTypingDotsInterval] = useState<number>(0);
    const [typingTimeout, setTypingTimeout] = useState<number>(0);
    const [stopTypingTimeout, setStopTypingTimeout] = useState<number>(0);
    const [oldPath, setOldPath] = useState<string>();

    const history = useHistory();

    const inputAttachImgRef = useRef<any>();
    const scrollbarRef = useRef<any>();
    const inputMessageRef = useRef<any>();
    const typingDotsRef = useRef<any>();

    const signalRContext = useContext(SignalRContext);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleUnpinImage = (event: any) => {
        const key = event.target.closest('.attachedImg').dataset.imagekey;

        setAttachedImages(attachedImages.filter(img => img.uniqueKey !== key));
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
    const handleMessageClick = (event: any, messageId: string) => {
        if (event.target.classList.contains('icon-edit'))
            return;

        const message = first(messages, (message: any) => message.messageId === messageId);
        message.selected = !message.selected;

        if (!message.selected)
            setSelectedMessages(selectedMessages.filter(id => id !== message.messageId));
        else
            setSelectedMessages([...selectedMessages, message.messageId]);

        setMessages([...messages]);
    }
    const handleEditMessageClick = (event: any, messageId: string) => {
        const message = first(messages, (message: any) => message.messageId === messageId);

        setEditMessageId(messageId);
        setAttachedImages(message.messageImages.map((img: any) => {return {src: img, uniqueKey: nanoid()}}));
        inputMessageRef.current.value = message.messageText;
    }
    const handleSendMessage = () => {
        if ((isEmptyOrSpaces(inputMessageRef.current.value) && attachedImages.length === 0) || attachedImages.length > 10)
            return;

        const images: string[] = attachedImages.map(img => img.src);
        const messageText = inputMessageRef.current.value.trim();

        if (editMessageId !== '') {
            signalRContext.updateMessage(parseInt(editMessageId), messageText, images);
            const message = messages.filter(message => message.messageId === editMessageId)[0];

            message.editedDate = new Date().toISOString();
            message.messageText = messageText;
            message.messageImages = images;

            setMessages([...messages]);
            setAttachedImages([]);
            setEditMessageId('');
            inputMessageRef.current.value = '';
        }
        else {
            const tmpId = nanoid(10);

            signalRContext.sendMessage(parseInt(target!.userId), messageText, images, tmpId);

            setMessages([
                ...messages, {
                    messageId: tmpId,
                    userId: user?.userId,
                    messageText: messageText,
                    messageImages: images,
                    writtenDate: new Date().toISOString(),
                    editedDate: null,
                    selected: false
                } as RawMessage
            ]);

            setAttachedImages([]);
            setEditMessageId('');
            inputMessageRef.current.value = '';
        }

        setLoadFrom(loadFrom + 1);
        signalRContext.stopTyping(target?.userId);
        scrollbarRef.current.scrollToBottom();
    }
    const handleUndoEditing = () => {
        setAttachedImages([]);
        setEditMessageId("");
        inputMessageRef.current.value = '';
    }
    const handleCancelSelection = () => {
        selectedMessages.forEach(messageId => {
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].messageId === messageId)
                    messages[i].selected = false;
            }
        });

        setSelectedMessages([]);
        setMessages([...messages]);
    }
    const handleDeleteSelectedMessages = () => {
        const deleteMessageIds = messages.filter(message => message.selected).map(message => parseInt(message.messageId));

        setMessages(messages.filter(message => !message.selected));
        setSelectedMessages([]);
        setLoadFrom(loadFrom - deleteMessageIds.length < 0 ? 0 : loadFrom - deleteMessageIds.length);

        deleteRequest({url: 'UserMessages/DeleteMessage', headers: headers, body: JSON.stringify({targetId: target?.userId, messageIds: deleteMessageIds})}).catch(err => console.error(err));
    }
    const handleClearMessageHistory = () => {
        setMessages([]);
        deleteRequest({url: 'UserMessages/DeleteMessageHistory', headers: headers, body: JSON.stringify({targetId: target?.userId})}).catch(err => console.error(err));
    }
    const startTypingAnimation = () => {
        clearInterval(typingDotsInterval);

        const typingDotsId: any = setInterval(() => {
            if (typingDotsRef.current.innerText.length === 1) {
                typingDotsRef.current.innerText = '..';
                return;
            }
            if (typingDotsRef.current.innerText.length === 2) {
                typingDotsRef.current.innerText = '...';
                return;
            }
            if (typingDotsRef.current.innerText.length === 3) {
                typingDotsRef.current.innerText = '.';
                return;
            }
        }, 400);

        setTypingDotsInterval(typingDotsId);
    }
    const stopTypingAnimation = () => {
        clearInterval(typingDotsInterval);
        setTypingDotsInterval(0);
    }
    const handleChangeTextField = () => {
        if (user === undefined || target === undefined || typingTimeout !== 0 || user?.userId === target.userId)
            return;

        clearTimeout(typingTimeout);
        clearTimeout(stopTypingTimeout);
        signalRContext.beginTyping(parseInt(target!.userId));

        const timeoutId: any = setTimeout(() => {
            const stopTimeoutId: any = setTimeout(() => {
                signalRContext.stopTyping(parseInt(target!.userId));
            }, 500);

            setStopTypingTimeout(stopTimeoutId);
            setTypingTimeout(0);
        }, 2000);

        setTypingTimeout(timeoutId);
    }

    const resetStates = () => {
        setUser(undefined);
        setTarget(undefined);
        setMessages([]);
        setShowSearch(false);
        setAttachedImages([]);
        setMessages([]);
        setEditMessageId('');
        setSelectedMessages([]);
        setLoadFrom(0);
        setLockLoading(false);
        setHasNoMessages(false);
        setTypingDotsInterval(0);
        setTypingTimeout(0);
        setStopTypingTimeout(0);
    }
    const loadMessages = async () => {
        if (lockLoading)
            return;

        setLockLoading(true);
        const response = await get({url: `UserMessages/Get/${getVisitorId()}?loadFrom=${loadFrom}`, headers: headers});

        if (response.ok) {
            const json = await response.json();

            setMessages(json.concat(messages));
            setLoadFrom(loadFrom + 20);

            const filterMessages = json.filter((message: RawMessage) => !message.isRead && message.userId.toString() === target?.userId).map((message: RawMessage) => message.messageId);

            if (filterMessages.length > 0)
                signalRContext.readMessages(parseInt(target!.userId), filterMessages);
        }
        else if (response.status === 404)
            setHasNoMessages(true);

        setLockLoading(false);
    }
    const loadProfiles = async () => {
        Promise.all([
            get({url: `UserProfiles/GetHeader/${getUserId()}`, headers: headers}),
            get({url: `UserProfiles/GetHeader/${getVisitorId()}`, headers: headers})
        ]).then(async response => {
            if (response[0].ok && response[1].ok) {
                const userJson = await response[0].json();
                const targetJson = await response[1].json();

                setUser({
                    userId: getUserId()!,
                    firstName: userJson.firstName,
                    lastName: userJson.lastName,
                    avatar: userJson.avatar,
                    onlineStatus: moment().subtract(5, 'minutes') <= moment(userJson.lastActionDate) ? 'online' : moment(userJson.lastActionDate).calendar()
                });

                setTarget({
                    userId: getVisitorId()!,
                    firstName: targetJson.firstName,
                    lastName: targetJson.lastName,
                    avatar: targetJson.avatar,
                    onlineStatus: moment().subtract(5, 'minutes') <= moment(targetJson.lastActionDate) ? 'online' : moment(targetJson.lastActionDate).calendar()
                });
            }
        });
    }

    useEffect(() => {
        const container = scrollbarRef?.current?.container;

        if (container !== undefined) {
            container.firstChild.style.display = 'flex';
            container.firstChild.style.flexDirection = 'column-reverse';
            container.lastChild.style.display = 'flex';
            container.lastChild.style.flexDirection = 'column-reverse';
        }

        loadProfiles();
    }, []);

    useEffect(() => {
        return history.listen(() => {
            if (history.location.pathname !== oldPath)
                setOldPath(history.location.pathname);
        })
    }, [history]);

    useEffect(() => {
        if (oldPath !== undefined) {
            resetStates();
            loadProfiles();
        }
    }, [oldPath]);

    useEffect(() => {
        if (user !== undefined && target !== undefined)
            loadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, target]);

    useEffect(() => {
        if (signalRContext.newMessage !== undefined && user?.userId !== target?.userId && target?.userId === signalRContext.newMessage.userId.toString()) {
            setMessages([...messages, signalRContext.newMessage]);

            signalRContext.readMessages(parseInt(target!.userId), [parseInt(signalRContext.newMessage.messageId)]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalRContext.newMessage]);

    useEffect(() => {
        if (signalRContext.newMessageId !== undefined) {
            const tmpMessages = messages.filter(message => message.messageId === signalRContext.newMessageId.tmpId);
            if (tmpMessages.length > 0)
                tmpMessages[0].messageId = signalRContext.newMessageId.newId;

            setMessages([...messages]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalRContext.newMessageId]);

    useEffect(() => {
        if (signalRContext.updatedMessage !== undefined && target?.userId === signalRContext.updatedMessage.userId.toString()) {
            const filterMessages = messages.filter(message => message.messageId === signalRContext.updatedMessage.messageId);

            if (filterMessages.length > 0) {
                const message = filterMessages[0];
                message.messageText = signalRContext.updatedMessage.message;
                message.messageImages = signalRContext.updatedMessage.attachedImages;
                message.editedDate = signalRContext.updatedMessage.editedDate;

                setMessages([...messages]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalRContext.updatedMessage]);

    useEffect(() => {
        if (signalRContext.confirmedReadMessages.length > 0) {
            for (let i = 0; i < signalRContext.confirmedReadMessages.length; i++) {
                for (let j = messages.length - 1; j >= 0; j--) {
                    if (signalRContext.confirmedReadMessages[i] === messages[j].messageId) {
                        messages[j].isRead = true;
                        break;
                    }
                }
            }

            setMessages([...messages]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalRContext.confirmedReadMessages]);

    useEffect(() => {
        if (signalRContext.typing !== undefined && signalRContext.typing.userId.toString() === target?.userId) {
            if (signalRContext.typing.isTyping) {
                startTypingAnimation();
                return;
            }

            stopTypingAnimation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalRContext.typing.isTyping]);

    return (
        <div style={{display: 'flex', height: '100%'}}>
            <Paper variant='outlined' className={classes.paper} style={{display: 'flex', flexDirection: 'column', height: '95%', background: 'white', marginBottom: 15}}>
                <div style={{display: selectedMessages.length > 0 || showSearch ? 'none' : 'flex', height: 50}}>
                    <div className={classes.btnBack}/>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '5px 0'}}>
                        <div style={{textAlign: 'center'}}>
                            <Link to={target?.userId.toString() === getUserId() ? '/Profile' : `/Profile/${target?.userId}`} className={classes.link}>{target?.firstName} {target?.lastName}</Link>
                        </div>
                        <div style={{textAlign: 'center', marginTop: -4}}>
                            <span style={{width: 'max-content', fontSize: 12, color: '#626d7a'}}>{target?.onlineStatus.toLowerCase()}</span>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', justifyContent: 'center', width: 50, height: 50, cursor: 'pointer'}} onClick={handleClick}>
                            <MoreHorizIcon style={{marginTop: 10, width: 30, height: 30, color: 'rgba(0, 0, 0, 0.40)'}}/>
                        </div>
                        <Link to={target?.userId.toString() === getUserId() ? '/Profile' : `/Profile/${target?.userId}`} style={{display: 'flex', justifyContent: 'center', height: 50, width: 50}}>
                            <Avatar alt="Remy Sharp" style={{marginTop: 10, width: 30, height: 30}} src={target?.avatar}/>
                        </Link>
                    </div>
                </div>
                <div style={{display: selectedMessages.length > 0 ? 'flex' : 'none', height: 50}}>
                    <Button disableTouchRipple style={{minWidth: 'max-content', background: 'transparent', paddingLeft: 12, textTransform: 'none', fontSize: 13, fontWeight: 500}} onClick={handleCancelSelection}>
                        {selectedMessages.length === 1 ? '1 message' : `${selectedMessages.length} messages`}
                        <FontAwesomeIcon icon={faTimes} style={{width: 14, height: 14, marginLeft: 6, color: '#A6ACB7'}}/>
                    </Button>
                    <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', paddingRight: 6}}>
                        <Tooltip title="Delete" arrow>
                            <IconButton style={{width: 34, height: 34, alignSelf: 'center'}} disableTouchRipple onClick={handleDeleteSelectedMessages}>
                                <FontAwesomeIcon icon={faTrashAlt} style={{width: 18, height: 18}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Searchbar style={{display: showSearch && selectedMessages.length === 0 ? 'flex' : 'none'}} onClickToClose={() => setShowSearch(false)}/>
                <Divider/>
                <Scrollbars ref={scrollbarRef} style={{height: '100%'}} autoHide onScrollFrame={(value) => {
                    if (value.top <= -0.8 && !hasNoMessages)
                        loadMessages();
                }}>
                    <span style={{visibility: typingDotsInterval !== 0 ? 'visible' : 'hidden', margin: '15px 0 20px 38px', fontSize: 13, color: '#939393'}}>
                        <span>{target?.firstName} is typing</span>
                        <span ref={typingDotsRef}>...</span>
                    </span>
                    {build(messages).map((section, sectionIndex) => (
                        <MessageSection key={section.date} date={moment(section.date).format('ll')}>
                            {section.messages.map((message, index) => {
                                let showInfo = index === 0;
                                let unread = !message.isRead && message.userId.toString() === user?.userId;

                                if (user?.userId === target?.userId)
                                    unread = false;

                                if (index > 0) {
                                    const date = new Date(message.writtenDate);
                                    const previousDate = new Date(section.messages[index - 1].writtenDate);

                                    showInfo = message.userId.toString() !== section.messages[index - 1].userId.toString() || date.getHours() > previousDate.getHours() || date.getMinutes() - previousDate.getMinutes() >= 5;
                                }

                                return <Message key={message.messageId}
                                                userId={message.userId}
                                                messageId={message.messageId}
                                                firstName={message.userId.toString() === user!.userId ? user!.firstName : target!.firstName}
                                                writtenDate={moment(message.writtenDate).format('LT')}
                                                messageText={message.messageText}
                                                messageImages={message.messageImages}
                                                showInfo={showInfo}
                                                avatarSrc={message.userId.toString() === user?.userId ? user.avatar : target?.avatar}
                                                editable={message.userId.toString() === user?.userId}
                                                unread={unread}
                                                editedDate={message.editedDate === null ? undefined : moment(message.editedDate).format('lll')}
                                                selected={message.selected}
                                                onClick={handleMessageClick}
                                                onEditClick={handleEditMessageClick}/>
                            })}
                        </MessageSection>
                    ))}
                </Scrollbars>
                <Divider/>
                <div style={{display: 'flex', height: 'max-content', padding: 0}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <div style={{display: editMessageId === '' ? 'none' : 'block', marginLeft: 15, marginTop: 15, fontSize: 13, fontWeight: 500, color: '#2a5885'}}>
                            Edit message
                        </div>
                        <TextField placeholder="Write a message..."
                                   multiline
                                   fullWidth
                                   maxRows={10}
                                   variant="outlined"
                                   style={{margin: 8}}
                                   inputRef={inputMessageRef}
                                   InputProps={{classes: inputClasses, className: classes.inputRoot}}
                                   onChange={handleChangeTextField}
                                   onKeyDown={(event: any) => {
                                       if (event.keyCode === 13 && !event.shiftKey) {
                                           event.preventDefault();
                                           handleSendMessage();
                                       }
                                   }}
                        />
                    </div>
                    <Tooltip title="Undo editing" arrow>
                        <Button disableTouchRipple={true} style={{visibility: editMessageId === '' ? 'collapse' : 'visible', minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={handleUndoEditing}>
                            <FontAwesomeIcon icon={faTimes} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Attach a photo" arrow>
                        <Button disableTouchRipple={true} style={{minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={() => {inputAttachImgRef.current.value = null; inputAttachImgRef.current.click()}}>
                            <FontAwesomeIcon icon={faCamera} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
                            <input ref={inputAttachImgRef} style={{display: 'none'}} type="file" multiple={true} accept="image/*" onChange={handleFileSelect}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title={editMessageId === '' ? 'Send a message' : 'Apply changes'} arrow>
                        <Button disableTouchRipple={true} style={{minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={handleSendMessage}>
                            <FontAwesomeIcon icon={editMessageId === '' ? faPaperPlane : faCheckCircle} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
                        </Button>
                    </Tooltip>
                </div>
                <Scrollbars style={{display: attachedImages.length > 0 ? 'block' : 'none', height: 200}}>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {attachedImages.map(img => <AttachedImage key={img.uniqueKey} src={img.src} uniqueKey={img.uniqueKey} unpinClick={handleUnpinImage}/>)}
                    </div>
                </Scrollbars>
            </Paper>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {handleClose(); setShowSearch(true);}} classes={listItemClasses}>
                    <ListItemIcon classes={listItemIconClasses}>
                        <FontAwesomeIcon icon={faSearch} style={{width: 16, height: 16, color: 'rgba(0, 0, 0, 0.40)'}}/>
                    </ListItemIcon>
                    <ListItemText classes={listItemTextClasses} disableTypography={true}>Search message history</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} classes={listItemClasses}>
                    <ListItemIcon classes={listItemIconClasses}>
                        <FontAwesomeIcon icon={faPaperclip} style={{width: 16, height: 16, color: 'rgba(0, 0, 0, 0.40)'}}/>
                    </ListItemIcon>
                    <ListItemText classes={listItemTextClasses} disableTypography={true}>Show attachments</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {handleClose(); handleClearMessageHistory();}} classes={listItemClasses}>
                    <ListItemIcon classes={listItemIconClasses}>
                        <FontAwesomeIcon icon={faTrashAlt} style={{width: 16, height: 16, color: 'rgba(0, 0, 0, 0.40)'}}/>
                    </ListItemIcon>
                    <ListItemText classes={listItemTextClasses} disableTypography={true}>Clear message history</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
};
