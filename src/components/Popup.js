import React, { Component } from 'react';
import { closePopup } from '../popupMethods';

export default class Popup extends Component {
    render() {
        return (
            <div id="popup" style={{ position: 'absolute' }}>
                <h3 id="popupTitle">Title</h3>
                <div id="popupContent"></div>
                <div>
                    <button id="popupActionBtn" className="btn btn-primary">Action</button>
                    <button id="popupCloseBtn" onClick={closePopup} className="btn btn-secondary">Close</button>
                </div>
            </div>
        )
    }
}
