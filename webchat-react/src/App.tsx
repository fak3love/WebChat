import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Layout} from "./components/Layout";
import {Profile} from "./pages/Profile";
import {Authorization} from "./pages/Authorization";
import {Registration} from "./pages/Registration";
import {Settings} from "./pages/Settings";
import {Friends} from "./pages/Friends";
import {Messages} from "./pages/Messages";
import {Photos} from "./pages/Photos";
import {Notifications} from "./pages/Notifications";
import './assets/fonts.css';
import './App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Layout>
                    <Route exact path="/" component={Profile} />
                    <Route exact path="/Profile" component={Profile} />
                    <Route exact path="/Profile/:id" component={Profile} />
                    <Route exact path='/Authorization' component={Authorization} />
                    <Route exact path='/Registration' component={Registration} />
                    <Route exact path='/Settings' component={Settings} />
                    <Route exact path='/Friends' component={Friends} />
                    <Route exact path='/Messages' component={Messages} />
                    <Route exact path='/Photos' component={Photos} />
                    <Route exact path='/Notifications' component={Notifications} />
                </Layout>
            </BrowserRouter>
        </div>
    );
}

export default App;
