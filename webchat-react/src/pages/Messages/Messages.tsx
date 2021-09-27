import React, {useEffect, useRef, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Divider, IconButton, Paper, TextField, Tooltip} from "@material-ui/core";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
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
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {nanoid} from 'nanoid'
import {Searchbar} from "../../components/Searchbar";
import {AttachedImage} from "../../components/AttachedImage";
import {Message} from "../../components/Message";
import {MessageType} from "../../components/Message/Message";
import {build} from "../../utils/messages";
import {MessageSection} from "../../components/MessageSection";
import {getTimeDurationByDate, getTimeFormat} from "../../utils/dates";
import {first} from "../../utils/array";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

export const Messages = () => {
    const classes = useStyles();
    const listItemClasses = useListItemStyles();
    const listItemIconClasses = useListItemIconStyles();
    const listItemTextClasses = useListItemTextStyles();
    const inputClasses = useInputStyles();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [attachedImages, setAttachedImages] = useState<Array<{src: any, uniqueKey: string}>>([]);
    const [messages, setMessages] = useState<Array<any>>([
        {userId: 'faust', messageId: '1', writtenDate: '2021.09.14 9:12', editedDate: '2021.09.14 9:17', firstName: 'faust', avatarSrc: '', messageText: 'test123', messageImages: []},
        {userId: 'faust', messageId: '2', writtenDate: '2021.09.14 9:13', firstName: 'faust', avatarSrc: '', messageText: 'test123', messageImages: []},
    ]);
    const [inputMessageId, setInputMessageId] = useState<string>('');
    const [selectedMessages, setSelectedMessages] = useState<Array<string>>([]);

    const inputAttachImgRef = useRef<any>();

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
    const handleMessageClick = (event: any) => {
        if (event.target.classList.contains('icon-edit'))
            return;

        const message = first(messages, (message: any) => message.messageId === event.target.closest('.message').dataset.messageid);
        message.selected = !message.selected;

        if (!message.selected)
            setSelectedMessages(selectedMessages.filter(id => id !== message.messageId));
        else
            setSelectedMessages([...selectedMessages, message.messageId]);

        setMessages([...messages]);
    }
    function handleEditMessageClick(event: any) {
        const messageId = event.target.closest('.message').dataset.messageid;

        const message = first(messages, (message: any) => message.messageId === messageId);
        const input: any =  document.getElementById('input-message');

        setInputMessageId(messageId);
        setAttachedImages(message.messageImages.map((img: any) => {return {src: img, uniqueKey: nanoid()}}));
        input.value = message.messageText;
    }
    const handleSendMessage = () => {
        if (inputMessageId === '') {
            //send a new message
            return;
        }

        //send edited message
    }
    const handleUndoEditing = () => {
        setAttachedImages([]);
        setInputMessageId("");
        (document.getElementById('input-message') as any).value = '';
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
        setMessages(messages.filter(message => !message.selected));
        setSelectedMessages([]);
    }
    const handleClearMessageHistory = () => {

    }

    return (
        <React.Fragment>
            <Paper variant='outlined' style={{height: 'max-content', background: 'white', marginBottom: 15}}>
                <div style={{display: selectedMessages.length > 0 || showSearch ? 'none' : 'flex', height: 50}}>
                    <div className={classes.btnBack}/>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '5px 0'}}>
                        <div style={{textAlign: 'center'}}>
                            <Link to="/Profile" className={classes.link}>Faust King</Link>
                        </div>
                        <div style={{textAlign: 'center', marginTop: -4}}>
                            <span style={{width: 'max-content', fontSize: 12, color: '#626d7a'}}>online</span>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', justifyContent: 'center', width: 50, height: 50, cursor: 'pointer'}} onClick={handleClick}>
                            <MoreHorizIcon style={{marginTop: 10, width: 30, height: 30, color: 'rgba(0, 0, 0, 0.40)'}}/>
                        </div>
                        <Link to="/Profile" style={{display: 'flex', justifyContent: 'center', height: 50, width: 50}}>
                            <Avatar alt="Remy Sharp" style={{marginTop: 10, width: 30, height: 30}} />
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
                            <IconButton style={{width: 32, height: 32, alignSelf: 'center'}} disableTouchRipple onClick={handleDeleteSelectedMessages}>
                                <FontAwesomeIcon icon={faTrashAlt} style={{width: 17, height: 17}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Searchbar style={{display: showSearch && selectedMessages.length === 0 ? 'flex' : 'none'}} onClickToClose={() => setShowSearch(false)}/>
                <Divider/>
                <Scrollbars style={{height: 400}} autoHide>
                    {build(messages).map(section => (
                        <MessageSection key={section.date} date={getTimeDurationByDate({startDate: new Date(section.date), endDate: new Date(), include: 'onlyDate'})}>
                            {section.messages.map((message, index) => {
                                let showInfo = index === 0;

                                if (!showInfo && index - 1 >= 0) {
                                    const date = new Date(message.writtenDate);
                                    const previousDate = new Date(section.messages[index - 1].writtenDate);

                                    showInfo = date.getHours() > previousDate.getHours() || date.getMinutes() - previousDate.getMinutes() >= 5;
                                }

                                return <Message key={message.messageId}
                                                userId={message.userId}
                                                messageId={message.messageId}
                                                firstName={message.firstName}
                                                writtenDate={getTimeFormat(new Date(message.writtenDate))}
                                                messageText={message.messageText}
                                                messageImages={message.messageImages}
                                                showInfo={showInfo}
                                                avatarSrc={message.avatarSrc}
                                                unread={message.unread}
                                                editedDate={message.editedDate}
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
                        <div style={{display: inputMessageId === '' ? 'none' : 'block', marginLeft: 15, marginTop: 15, fontSize: 13, fontWeight: 500, color: '#2a5885'}}>
                            Edit message
                        </div>
                        <TextField placeholder="Write a message..." multiline fullWidth maxRows={10} variant="outlined" style={{margin: 8}} InputProps={{classes: inputClasses, className: classes.inputRoot, id: "input-message"}}/>
                    </div>
                    <Tooltip title="Undo editing" arrow>
                        <Button disableTouchRipple={true} style={{visibility: inputMessageId === '' ? 'collapse' : 'visible', minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={handleUndoEditing}>
                            <FontAwesomeIcon icon={faTimes} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Attach a photo" arrow>
                        <Button disableTouchRipple={true} style={{minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={() => {inputAttachImgRef.current.value = null; inputAttachImgRef.current.click()}}>
                            <FontAwesomeIcon icon={faCamera} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
                            <input ref={inputAttachImgRef} style={{display: 'none'}} type="file" multiple={true} accept="image/*" onChange={handleFileSelect}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title={inputMessageId === '' ? 'Send a message' : 'Apply changes'} arrow>
                        <Button disableTouchRipple={true} style={{minWidth: 40, height: 40, borderRadius: '50%', margin: 5}} onClick={handleSendMessage}>
                            <FontAwesomeIcon icon={inputMessageId === '' ? faPaperPlane : faCheckCircle} style={{width: 20, height: 20, color: '#A6ACB7'}}/>
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
        </React.Fragment>
    );
};
