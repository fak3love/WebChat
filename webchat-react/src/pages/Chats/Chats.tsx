import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Chat} from "../../components/Chat";
import {Divider, Paper} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Scrollbars from "react-custom-scrollbars";
import {get} from "../../ts/requests";
import {headers} from "../../ts/authorization";
import moment from "moment";
import {nanoid} from "nanoid";

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
    firstName: string,
    lastName: string,
    avatar: string,
    lastMessage: string,
    sender: 'user' | 'target',
    isOnline: boolean,
    isUnread: boolean,
    unreadCount: number,
    writtenDate: string
}

export const Chats = () => {
    const classes = useStyles();
    const [chats, setChats] = useState<RawChat[]>([]);
    const [userAvatar, setUserAvatar] = useState<string>('');

    const loadChats = async () => {
        const response = await get({url: 'UserMessages/GetChats', headers: headers});

        if (response.ok) {
            const json = await response.json();

            setChats(json);
        }
    }

    useEffect(() => {
        loadChats();
    }, []);

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
                />
            </div>
            <Divider/>
            <Scrollbars style={{height: 500}} autoHide>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {(document.location.search.includes('tab=unread') ? chats.filter(chat => chat.isUnread && chat.sender === 'target') : chats).map((chat, index) => {
                        return (
                            <React.Fragment key={nanoid()}>
                                <Chat
                                    message={chat.lastMessage}
                                    writtenDate={moment(chat.writtenDate).calendar().toLowerCase()}
                                    sender={chat.sender}
                                    unreadCount={chat.unreadCount}
                                    unread={chat.isUnread}
                                    avatarSrc={userAvatar}
                                    target={{userId: chat.userId, avatarSrc: chat.avatar, isOnline: chat.isOnline, firstName: chat.firstName, lastName: chat.lastName}}/>
                                {index < chats.length - 1 ? <Divider/> : ''}
                            </React.Fragment>
                        )
                    })}
                </div>
            </Scrollbars>
        </Paper>
    );
};
