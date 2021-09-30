import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Chat} from "../../components/Chat";
import {Divider, Paper} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Scrollbars from "react-custom-scrollbars";

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

export const Chats = () => {
    const classes = useStyles();

    return (
        <Paper variant='outlined' style={{width: '100%', height: 'max-content', background: 'white', marginBottom: 15}}>
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
                    <Chat
                          message="Test123456789"
                          writtenDate="14:40"
                          sender="target"
                          unreadCount={5}
                          unread={true}
                          avatarSrc=''
                          target={{userId: 'test', avatarSrc: '', isOnline: true, firstName: 'Kaneki', lastName: 'Ken'}}/>
                    <Divider/>
                    <Chat
                          message="Test123456789"
                          writtenDate="17:44"
                          sender="target"
                          unreadCount={5}
                          unread={false}
                          avatarSrc=''
                          target={{userId: 'test', avatarSrc: '', isOnline: true, firstName: 'Kaneki', lastName: 'Ken'}}/>
                    <Divider/>
                    <Chat
                          message="Test123456789"
                          writtenDate="2021.10.10"
                          sender="user"
                          unreadCount={0}
                          unread={true}
                          avatarSrc=''
                          target={{userId: 'test', avatarSrc: '', isOnline: true, firstName: 'Kaneki', lastName: 'Ken'}}/>
                    <Divider/>
                    <Chat
                          message="Test123456789"
                          writtenDate="yesterday"
                          sender="user"
                          unreadCount={0}
                          unread={false}
                          avatarSrc=''
                          target={{userId: 'test', avatarSrc: '', isOnline: true, firstName: 'Kaneki', lastName: 'Ken'}}/>
                    <Divider/>
                </div>
            </Scrollbars>
        </Paper>
    );
};
