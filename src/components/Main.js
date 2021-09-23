import React, { Component } from 'react';
import Update from './Update';
import Login from './Login';
import Popup from './Popup';
import Upload from './Upload';
import UpdateList from './UpdateList';
import Test from './Test';

export default class Main extends Component {

    render() {
        var url = window.location.href;
        var page = <Login />;
        if (url.includes('/upload')) {
            page = <Upload />;
        } else if (url.includes('/management')) {
            page = <UpdateList />;
        } else if (url.includes('/test')) {
            page = <Test />;
        }

        return (
            <div>
                <Popup />
                { page }
            </div>
        )
    }
}
