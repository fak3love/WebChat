import React from 'react';
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
import './assets/fonts.css';
import './assets/icons.css';
import './App.css';

function App() {
    return (
        <div className="App">
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
            </BrowserRouter>
        </div>
    );
}

export default App;
