import React, { Component } from 'react';
import $ from 'jquery';
import endpoint from '../endpoint';
import Login from './Login';
import Popup from './Popup';
import Upload from './Upload';

export default class Main extends Component {

    render() {
        var url = window.location.href;
        var page = <Login />;
        if (url.includes('/upload')) {
            page = <Upload />;
        }

        return (
            <div>
                <Popup />
                {page}
            </div>
        )
    }
}
