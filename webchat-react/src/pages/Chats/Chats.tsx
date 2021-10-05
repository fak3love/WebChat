import React, {useContext, useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Chat} from "../../components/Chat";
import {Divider, Paper} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Scrollbars from "react-custom-scrollbars";
import {get} from "../../ts/requests";
import {getUserId, headers} from "../../ts/authorization";
import moment from "moment";
import {nanoid} from "nanoid";
import {SignalRContext} from "../../contextes/SignalRContext";
import {isEmptyOrSpaces} from "../../utils/validators";
import {useHistory} from "react-router-dom";
import {getFilteredMessages} from "./utils";

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
        inputRoot: {
            width: '100%',
            fontSize: 13
        },
        inputInput: {
            width: '100%',
            paddingRight: 16
        }
    }),
);

type RawChat = {
    userId: string,
    messageId: string,
    firstName: string,
    lastName: string,
    avatar: string,
    lastMessage: string,
    sender: 'user' | 'target',
    isOnline: boolean,
    isUnread: boolean,
    unreadCount: number,
    writtenDate: string,
}

export const Chats = () => {
    const classes = useStyles();
    const [chats, setChats] = useState<RawChat[]>([]);
    const [userAvatar, setUserAvatar] = useState<string>('');
    const [filterText, setFilterText] = useState<string | null>(null);

    const history = useHistory();

    const signalRContext = useContext(SignalRContext);

    const loadAvatar = async () => {
        const response = await get({url: `UserPhotos/GetAvatar/${getUserId()}`, headers: headers});

        if (response.ok) {
            const avatarResponse = await get({url: `UserPhotos/GetPhotoBaseString/${await response.text()}`, headers: headers});

            if (avatarResponse.ok)
                setUserAvatar("data:image/png;base64," + await avatarResponse.text());
        }
    }
    const loadChats = async () => {
        const response = await get({url: 'UserMessages/GetChats', headers: headers});

        if (response.ok) {
            const json = await response.json();

            setChats(json);
        }
    }

    useEffect(() => {
        if (chats.length === 0) {
            loadAvatar();
            loadChats();
        }
    }, []);

    useEffect(() => {
        return history.listen((location) => {
            if (location.pathname !== '/Messages' || location.search.includes('tab=unread'))
                return;

            setChats([]);
            loadChats();
            loadAvatar();
        })
    }, [history]);

    useEffect(() => {
        if (signalRContext.newMessage !== undefined) {
            let chat: any = chats.find(chat => chat.userId.toString() === signalRContext.newMessage.message.userId.toString());
            const photos = signalRContext.newMessage.message.messageImages.length;
            const text = signalRContext.newMessage.message.messageText;

            const isUndefined = chat === undefined;

            if (isUndefined)
                chat = {};

            chat.userId = signalRContext.newMessage.message.userId.toString();
            chat.messageId = signalRContext.newMessage.message.messageId.toString();
            chat.firstName = signalRContext.newMessage.user.firstName;
            chat.lastMessage = signalRContext.newMessage.user.lastName;
            chat.avatar = signalRContext.newMessage.user.avatar;
            chat.lastMessage = isEmptyOrSpaces(text) ? (photos === 1 ? 'Photo' : `${photos} photos`) : text;
            chat.sender = 'target';
            chat.isUnread = !signalRContext.newMessage.message.isRead;
            chat.writtenDate = signalRContext.newMessage.message.writtenDate;
            chat.isOnline = true;

            if (isUndefined)
                chat.unreadCount = 1;
            else
                chat.unreadCount++;

            if (isUndefined)
                chats.splice(0, 0, chat);

            setChats([...chats]);
        }
    }, [signalRContext.newMessage]);

    useEffect(() => {
        for (let i = 0; i < chats.length; i++)
            for (let readMessageId of signalRContext.confirmedReadMessages)
                if (chats[i].messageId.toString() === readMessageId.toString())
                    chats[i].isUnread = false;

        setChats([...chats]);
    }, [signalRContext.confirmedReadMessages]);

    return (
        <Paper variant='outlined' style={{width: '100%', height: '95%', background: 'white', marginBottom: 15}}>
            <div className={classes.search}>
                <SearchIcon className={classes.searchIcon} />
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    onChange={(event: any) => setFilterText(event.target.value)}
                />
            </div>
            <Divider/>
            <Scrollbars style={{height: 500}} autoHide>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {getFilteredMessages(chats, filterText).map((chat: RawChat, index: number) => {
                        return (
                            <React.Fragment key={nanoid()}>
                                <Chat
                                    message={chat.lastMessage}
                                    writtenDate={moment(chat.writtenDate).calendar().toLowerCase()}
                                    sender={chat.sender}
                                    unreadCount={chat.unreadCount}
                                    unread={chat.isUnread}
                                    avatarSrc={userAvatar}
                                    target={{userId: chat.userId, avatarSrc: chat.avatar, isOnline: chat.isOnline, firstName: chat.firstName, lastName: chat.lastName}}
                                />
                                {index < chats.length - 1 ? <Divider/> : ''}
                            </React.Fragment>
                        )
                    })}
                </div>
            </Scrollbars>
        </Paper>
    );
};
