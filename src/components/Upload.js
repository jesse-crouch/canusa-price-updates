import Cookies from 'js-cookie';
import React, { Component } from 'react';
import $ from 'jquery';
import server from '../endpoint';
import { setPopupText } from '../popupMethods';
import axios from 'axios';

export default class Upload extends Component {
    componentDidMount() {
        $.post(server + 'checkToken', { token: Cookies.get('token') }, result => {
            if (result.error) {
                setPopupText('Error', result.error);
                setTimeout(() => {
                    window.location.replace('/login');
                    //this.props.changePage(<Login changePage={this.props.changePage} />);
                }, 5000);
            } else {
                document.getElementById('pageTitle').style.display = 'none';
                document.getElementById('uploadForm').style.visibility = 'visible';
                document.getElementById('pageLogo').src = 'logos/' + result.payload.name + '.png';
                document.getElementById('pageLogo').style.visibility = 'visible';
            }
        });
    }

    selectFile(event) {
        var data = new FormData();
        data.append('file', event.target.files[0]);
        data.append('token', Cookies.get('token'));
        var pageTitle = document.getElementById('pageTitle');
        pageTitle.innerHTML = 'Processing...';

        axios.post(server + 'uploadFile', data, {
            }).then(res => {
                if (res.error) {
                    setPopupText('Error', res.error);
                } else {
                    setPopupText('Upload Successful', 'Your update file has been successfully uploaded and processed.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            });
    }

    logout() {
        $.post(server + 'logout', { token: Cookies.get('token') }, result => {
            if (result.error) {
                setPopupText('Error', result.error);
            } else {
                Cookies.remove('token');
                setTimeout(() => {
                    window.location.replace('/');
                }, 2000);
            }
        });
    }

    render() {
        return (
            <div>
                <img id="pageLogo" src="logos/canusa.png" style={{ maxWidth: '30%', margin: '2%', visibility: 'hidden' }} />
                <h3 id="pageTitle">Loading...</h3>
                <div id="uploadForm" style={{ width: '50%', margin: '2% auto', visibility: 'hidden' }}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="file-upload" className="btn btn-primary">Select File</label>
                            <input style={{display: 'none'}} id="file-upload" type="file" name="file" onChange={this.selectFile} />
                        </div>
                    </div>
                    <div className="row">
                        <button className="btn btn-secondary" style={{width: '50%', margin: '2% auto'}} onClick={this.logout}>Log Out</button>
                    </div>
                </div>
            </div>
        )
    }
}
