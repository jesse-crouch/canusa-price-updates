import React, { Component } from 'react'
import Update from './Update';
import Detail from './Detail';
import $ from 'jquery';
import { uuid } from 'uuidv4';
import FileUpload from 'react-upload-file';
import axios from 'axios';
import server from '../endpoint';

export default class UpdateList extends Component {

    constructor() {
        super();
    
        this.showDetails = this.showDetails.bind(this);
    
        this.state = { updates: [], update_id: null, details: [] };
    }

    componentDidMount() {
        if (this.state.update_id !== null) {
            console.log('GET DETAILS');
            
        } else {
            console.log('GET UPDATES');
            $.get(server + 'getAllUpdates', result => {
                if (result.error) {
                    console.log(result.error);
                } else {
                    var updates = [];
                    for (var i in result.updates) {
                        updates.push(<Update key={uuid()} showDetails={this.showDetails} update={result.updates[i]} />);
                    }
                    this.setState({
                        updates: updates
                    });
                }
            });
            document.getElementById('updates-table').style.display = '';
        }
    }

    showDetails(updateID) {
        console.log('get details for ' + updateID);
        this.setState(prevState => {
            return {
                updates: prevState.updates,
                update_id: updateID,
                details: []
            };
        }, () => {
            $.post('http://18.217.173.236:6120/getDetails', { update_id: this.state.update_id }, result => {
                if (result.error) {
                    console.log(result.error);
                } else {
                    var details = [];

                    for (var i=0; i<result.details.product_nums.length; i++) {
                        var product_num = result.details.product_nums[i];
                        var price = result.details.prices[i];
                        var comments = '';
                        if (result.details.comments) {
                            comments = result.details.comments;
                        }
                        details.push([product_num, price, comments]);
                    }

                    this.setState(prevState => {
                        return {
                            updates: prevState.updates,
                            update_id: prevState.update_id,
                            details: details
                        };
                    },  () => {
                        document.getElementById('updates-table').style.opacity = 0;
                        document.getElementById('table-label').innerHTML = 'Loading...';

                        var rows = [];
                        var start = new Date();
                        setTimeout(() => {
                            for (var i in this.state.details) {
                                var newRow = document.createElement('tr');
                                var newProductData = document.createElement('td');
                                var newPriceData = document.createElement('td');
                                var newCommentData = document.createElement('td');

                                newProductData.innerHTML = this.state.details[i][0];
                                newPriceData.innerHTML = this.state.details[i][1];
                                newCommentData.innerHTML = this.state.details[i][2];

                                newRow.appendChild(newProductData);
                                newRow.appendChild(newPriceData);
                                newRow.appendChild(newCommentData);
                                
                                document.getElementById('details-body').appendChild(newRow);
                            }
                        }, 100);
                        var elapsed = (new Date() - start);
                        console.log('Time elapsed: ' + elapsed + 'ms');

                        setTimeout(() => {
                            document.getElementById('updates-table').style.display = 'none';
                            document.getElementById('table-label').innerHTML = result.details.name + ' - ' + result.details.document_num;
                            document.getElementById('details-table').style.display = '';
                            document.getElementById('details-table').style.opacity = 100;
                        }, elapsed > 500 ? 0 : (500-elapsed));
                    });
                }
            });
            document.getElementById('details-table').style.display = '';
        });
    }

    onFileInput(event) {
        var data = new FormData();
        data.append('file', event.target.files[0]);

        axios.post('http://18.217.173.236:6120/uploadFile', data, {
            }).then(res => {
                console.log(res.statusText);
            });
    }

    render() {
        return (
            <div>
                <div>
                    <h4 id="table-label">Price Updates</h4>
                </div>
                <table id="updates-table" className="table table-striped" style={{display: 'none'}}>
                    <thead className="thead thead-dark">
                        <th>Date Received</th>
                        <th>Date Due</th>
                        <th>Elapsed Time</th>
                        <th>Vendor</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Items</th>
                        <th>Filename</th>
                    </thead>
                    <tbody>{this.state.updates}</tbody>
                </table>
                <table id="details-table" className="table table-striped" style={{display: 'none', opacity: 0}}>
                    <thead className="thead thead-dark">
                        <th>Product Number</th>
                        <th>Price</th>
                        <th>Comments</th>
                    </thead>
                    <tbody id="details-body"></tbody>
                </table>
            </div>
        )
    }
}
