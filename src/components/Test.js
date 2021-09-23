import React, { Component } from 'react';
import $ from 'jquery';

export default class test extends Component {
    componentDidMount() {

    }

    suggestUsers() {
        $.ajax({
            type: "GET",
            url: "https://autopartscentres.freshservice.com/api/v2/agents",
            contentType: 'application/json',
            headers: {
                "Authorization": "Basic " + btoa("XR4hwkdVxa9PsTS1nM4:X")
            },
            success: (data) => {
                console.log(data.agents);
                /*for (var i in data.requesters) {
                    if (data.requesters[i].first_name.includes('Yvonne')) {
                        console.log(data.requesters[i]);
                    }
                }*/
            }
        });
    }

    render() {
        return (
            <div>
                <div id="assets-row">
                    <div className="row">
                        <input placeholder="User" onChange={this.suggestUsers} />
                    </div>
                    <div className="row">
                        <button className="btn btn-primary">Add Asset</button>
                    </div>
                </div>
            </div>
        )
    }
}
