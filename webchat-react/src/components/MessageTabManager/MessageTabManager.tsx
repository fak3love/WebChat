import React, {useContext, useEffect, useState} from 'react';
import {MessageTab} from "../MessageTab";
import {Divider, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'
import {
    getPeers,
    getSelectedTabUserId,
    getTabs,
    isSelectedAllChats,
    isSelectedUnread,
    showTabs
} from "./utils";
import {getVisitorId, isVisitor} from "../../utils/common";
import {SignalRContext} from "../../contextes/SignalRContext";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'column',
                minWidth: 225,
                marginLeft: 15,
                height: 'max-content',
                padding: '6px 0'
            }
        }
    }),
);

export const MessageTabManager = () => {
    const classes = useStyles();

    const history = useHistory();
    const [location, setLocation] = useState<{pathname: string, search: string}>({pathname: '/', search: '?'});
    const [userTabs, setUserTabs] = useState<{userId: string, unreadCount: number}[]>([]);
    const actualLocation = location.search !== '?' ? location : document.location;

    const isShowTabs = showTabs(actualLocation.pathname);
    const selectedUserId = getSelectedTabUserId();

    const selectAllChats = selectedUserId === undefined && isSelectedAllChats(actualLocation.search);
    const selectUnread = selectedUserId === undefined && isSelectedUnread(actualLocation.search);
    const peers = getPeers(actualLocation.search);

    const signalRContext = useContext(SignalRContext);

    const handleTabCloseClick = (userId: string) => {
        let search = actualLocation.search.replace(new RegExp('_?' + userId, 'i'), '');
        const tabs = getTabs(search);

        if (tabs.length === 0)
            search = search.replace(/&?peers=/i, '');

        const visitor = isVisitor('/Messages');

        if (visitor) {
            if (getVisitorId() === userId) {
                history.push('/Messages' + search);
                return;
            }

            history.push(`/Messages/${userId}` + search);
            return;
        }

        history.push('/Messages' + search);
    }

    useEffect(() => {
        return history.listen((location: any) => {
            setLocation({pathname: location.pathname, search: location.search});
        })
    },[history]);

    useEffect(() => {
        const tabs = getTabs(actualLocation.search);
        const newTabs = [];

        for (let tab of tabs) {
            const filterTabs = userTabs.filter(userTab => userTab.userId === tab);

            newTabs.push({userId: tab, unreadCount: isVisitor('/Messages') && getVisitorId() === tab ? 0 : filterTabs.length > 0 ? filterTabs[0].unreadCount : 0});
        }

        setUserTabs(newTabs);
    }, [location]);

    useEffect(() => {
        if (signalRContext.newMessage !== undefined && (!isVisitor('/Messages') || signalRContext.newMessage.message.userId.toString() !== getVisitorId())) {
            const tab = userTabs.find(tab => tab.userId === signalRContext.newMessage.message.userId.toString());

            if (tab !== undefined) {
                tab.unreadCount++;

                setUserTabs([...userTabs]);
            }
        }
    }, [signalRContext.newMessage]);

    return (
        <Paper variant='outlined' style={{display: document.body.offsetWidth > 600 && isShowTabs ? 'flex' : 'none'}} className={classes.paper}>
            <MessageTab title="All chats" selected={selectAllChats} onClick={() => history.push(`/Messages?${peers}`)}/>
            <MessageTab title="Unread" selected={selectUnread} onClick={() => history.push(`/Messages?tab=unread${peers !== '' ? '&' + peers : ''}`)}/>
            <div style={{display: userTabs.length > 0 ? 'flex' : 'none', flexDirection: 'column'}}>
                <Divider style={{height: 1, margin: '5px 15px'}}/>
                {userTabs.map(userTab => {
                    return <MessageTab key={userTab.userId}
                                       userId={userTab.userId}
                                       newMessageCount={userTab.unreadCount}
                                       selected={selectedUserId !== undefined && selectedUserId.toString() === userTab.userId.toString()}
                                       disableClose={false}
                                       onClick={() => history.push(`/Messages/${userTab.userId}?${peers}`)}
                                       closeClick={() => handleTabCloseClick(userTab.userId)}/>
                })}
            </div>
        </Paper>
    );
};
