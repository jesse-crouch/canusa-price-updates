import React, { Component } from 'react';
import $ from 'jquery';
import endpoint from '../endpoint';
import { setPopupText } from '../popupMethods';
import Cookies from 'js-cookie';
import Upload from './Upload';

export default class Login extends Component {
    constructor() {
        super();

        this.login = this.login.bind(this);
    }

    login() {
        // Get information from fields
        var vendor = document.getElementById('vendorField').value;
        var password = document.getElementById('passField').value;

        $.post(endpoint + 'login', { username: vendor, password: password }, result => {
            console.log(result);
            if (result.error) {
                if (result.error === 'wrong_pass') {
                    setPopupText('Error', 'Your password is incorrect, please try again.');
                } else if (result.error === 'no_user') {
                    setPopupText('Error', 'That vendor ID doesn\'t exist.');
                } else {
                    setPopupText('Error', 'Something went wrong: ' + result.error);
                }
            } else {
                Cookies.set('token', result.token, { expires: 1 });
                window.location.replace('/upload');
                //this.props.changePage(<Upload changePage={this.props.changePage} />);
            }
        });
    }

    render() {
        return (
            <div>
                <img src="logos/canusa.png" style={{ maxWidth: '30%', margin: '2%' }} />
                <h3>Vendor Price Updates</h3>
                <div style={{ width: '50%', margin: '2% auto' }}>
                    <div className="row">
                        <input id="vendorField" style={{ marginBottom: '2%' }} type="text" className="form-control" placeholder="Vendor ID" />
                        <input id="passField" type="password" className="form-control" placeholder="Password" />
                    </div>
                    <div className="row">
                        <button style={{ width: '40%', margin: '2% auto' }} className="btn btn-primary" onClick={this.login}>Login</button>
                    </div>
                </div>
            </div>
        )
    }
}
