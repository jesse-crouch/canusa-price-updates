import Cookies from 'js-cookie';
import React, { Component } from 'react';
import $ from 'jquery';
import server from '../endpoint';
import { setPopupContent, setPopupText } from '../popupMethods';
import Login from './Login';
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
                document.getElementById('pageTitle').innerHTML = 'Upload Update';
                document.getElementById('uploadForm').style.visibility = 'visible';
                document.getElementById('pageLogo').src = 'logos/' + result.payload.name + '.png';
                document.getElementById('pageLogo').style.visibility = 'visible';
            }
        });
    }

    selectFile(event) {
        var data = new FormData();
        data.append('file', event.target.files[0]);

        axios.post('uploadFile', data, {
            }).then(res => {
                console.log(res.statusText);
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
                            <input type="file" name="file" onChange={this.selectFile} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
