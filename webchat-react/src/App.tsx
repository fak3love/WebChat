import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Layout} from "./components/Layout";
import {Profile} from "./pages/Profile";
import {Settings} from "./pages/Settings";
import {Friends} from "./pages/Friends";
import {Chats} from "./pages/Chats";
import {Photos} from "./pages/Photos";
import {Search} from "./pages/Search";
import {Messages} from "./pages/Messages";
import {Authorization} from "./pages/Authorization";
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import * as signalR from "@microsoft/signalr";
import './assets/fonts.css';
import './assets/icons.css';
import './App.css';
import {getToken, getUserId, headers, isEmptyStorage} from "./ts/authorization";
import {SignalRContext} from "./contextes/SignalRContext";
import {environment} from "./ts/environment";
import {RawMessage} from "./pages/Messages/Messages";
import {SnackbarMessage} from "./components/SnackbarMessage";
import {get} from "./ts/requests";

function App() {
    const [connection, setConnection] = useState<HubConnection>();

    const [newMessageId, setNewMessageId] = useState<{newId: string, tmpId: string}>();
    const [newMessage, setNewMessage] = useState<{message: RawMessage, user: {userId: string, firstName: string, lastName: string, lastActionDate: string, avatar: string}}>();
    const [updatedMessage, setUpdatedMessage] = useState<{userId: string, messageId: string, message: string, attachedImages: string[], editedDate: string}>();
    const [confirmedReadMessages, setConfirmedReadMessages] = useState<string[]>([]);
    const [typing, setTyping] = useState<{isTyping: boolean, userId: number}>({isTyping: false, userId: 0});
    const [uniqueMessageUserIds, setUniqueMessageUserIds] = useState<number[]>([]);

    const loadUnreadMessages = async () => {
        const response = await get({url: 'UserMessages/GetUniqueUnreadCount', headers: headers});

        if (response.ok)
            setUniqueMessageUserIds(await response.json());
    }

    const resetNewMessage = () => setNewMessage(undefined);

    const updateUniqueMessages = (userId: any) => {
        const findId = uniqueMessageUserIds.find(id => id === userId);

        if (findId === undefined && userId.toString() !== getUserId()) {
            uniqueMessageUserIds.push(userId);
            setUniqueMessageUserIds([...uniqueMessageUserIds]);
        }
    }

    useEffect(() => {
        if (isEmptyStorage())
            return;

        const connection = new HubConnectionBuilder()
            .withUrl(environment.url + "hubs/chat", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => getToken()!
            })
            .withAutomaticReconnect()
            .build();

        setConnection(connection);

        loadUnreadMessages();
    }, []);

    useEffect(() => {
        if (connection)
            connection.start().then(() => {
                connection.on("NewMessageId", (messageId) => {
                    setNewMessageId(messageId);
                })
                connection.on('NewMessage', (message, user) => {
                    setNewMessage({message: message, user: user});

                    updateUniqueMessages(message.userId);
                });
                connection.on('UpdateMessage', message => {
                    setUpdatedMessage(message);
                });
                connection.on('ConfirmedReadMessages', (messageIds: {userId: number, messageId: string}[]) => {
                    setConfirmedReadMessages(messageIds.map(id => id.messageId));

                    for (let i = 0; i < messageIds.length; i++) {
                        const findId = uniqueMessageUserIds.findIndex(id => id === messageIds[i].userId);

                        if (findId !== -1)
                            uniqueMessageUserIds.splice(findId, 1);
                    }

                    setUniqueMessageUserIds([...uniqueMessageUserIds]);
                });
                connection.on('BeginTyping', (userId: number) => {
                    setTyping({isTyping: true, userId: userId});
                });
                connection.on('StopTyping', (userId: number) => {
                    setTyping({isTyping: false, userId: userId});
                });
            }).catch(err => console.error(err));
    }, [connection]);

    return (
        <div className="App">
            <SignalRContext.Provider value={{
                newMessageId: newMessageId,
                newMessage: newMessage,
                updatedMessage: updatedMessage,
                confirmedReadMessages: confirmedReadMessages,
                typing: typing,
                uniqueMessageUserIds: uniqueMessageUserIds,
                sendMessage(targetId: number, message: string, attachedImages: string[], tmpId: string) {
                    connection?.send('SendMessage', targetId, message, attachedImages, tmpId).catch((err) => console.error(err));
                },
                updateMessage(messageId: number, message: string, attachedImages: string[]) {
                    connection?.send('UpdateMessage', messageId, message, attachedImages).catch((err) => console.error(err));
                },
                readMessages(initiatorId: number, messageIds: number[]) {
                    connection?.send('ReadMessages', initiatorId, messageIds);
                },
                beginTyping(targetId: number) {
                    connection?.send('BeginTyping', targetId);
                },
                stopTyping(targetId: number) {
                    connection?.send('StopTyping', targetId);
                },
                resetNewMessage: resetNewMessage
            }}>
                <BrowserRouter>
                    <Layout>
                        <Route exact path="/" component={Profile} />
                        <Route exact path="/Profile" component={Profile} />
                        <Route exact path="/Profile/:id" component={Profile} />
                        <Route exact path='/Messages' component={Chats} />
                        <Route exact path='/Messages/:id' component={Messages} />
                        <Route exact path='/Friends' component={Friends} />
                        <Route exact path='/Friends/:id' component={Friends} />
                        <Route exact path='/Followers' component={Friends} />
                        <Route exact path='/Followers/:id' component={Friends} />
                        <Route exact path='/Subscriptions' component={Friends} />
                        <Route exact path='/Subscriptions/:id' component={Friends} />
                        <Route exact path='/Photos' component={Photos} />
                        <Route exact path='/Photos/:id' component={Photos} />
                        <Route exact path="/Search" component={Search} />
                        <Route exact path='/Settings' component={Settings} />
                        <Route exact path='/Authorization' component={Authorization}/>
                    </Layout>
                    <SnackbarMessage message={newMessage?.message} user={newMessage?.user}/>
                </BrowserRouter>
            </SignalRContext.Provider>
        </div>
    );
}

export default App;
