import React, { Component } from 'react';
import { uuid } from 'uuidv4';

export default class Update extends Component {
    render() {
        console.log(this.props.update);

        //var due_date = new Date(this.props.update.due_date*1000).toLocaleDateString();
        var received_date = new Date(this.props.update.received_date*1000).toLocaleDateString();
        var due_date = new Date(this.props.update.due_date*1000).toLocaleDateString();
        var priority = this.props.update.priority;
        switch (priority) {
            case 0:
                priority = 'Low';
                break;
            case 1:
                priority = 'Medium';
                break;
            case 2:
                priority = 'High';
                break;
            default:
                priority = 'Low';
                break;
        }
        var vendor_id = this.props.update.name;
        var status = this.props.update.status;
        switch (status) {
            case 0:
                status = 'Uploading';
                break;
            case 1:
                status = 'Uploaded';
                break;
            case 2:
                status = 'Processing';
                break;
            case 3:
                status = 'Ready';
                break;
            default:
                status = 'Error';
                break;
        }
        var items = this.props.update.items;
        var url = this.props.update.url;
        var elapsed_milliseconds = (new Date().getTime()/1000) - this.props.update.received_date;
        var elapsed_time = formatElapsedTime(Math.round(elapsed_milliseconds/1), '');

        return (
            <tr id={"u-" + this.props.update.id} key={uuid()} className="update-row" onClick={(e) => {
                this.props.showDetails(e.target.parentElement.id.substr(2));
            }}>
                <td>{received_date}</td>
                <td>{due_date}</td>
                <td>{elapsed_time}</td>
                <td>{vendor_id}</td>
                <td>{status}</td>
                <td>{priority}</td>
                <td>{items}</td>
                <td>{url}</td>
            </tr>
        )
        
        /*return (
            <tr id={"u-" + this.props.update.id} key={uuid()} className="update-row" onClick={(e) => {
                this.props.showDetails(e.target.parentElement.id.substr(2));
            }}>
                <td>{due_date}</td>
                <td>{received_date}</td>
                <td>{formatPriority(this.props.update.priority)}</td>
                <td>{formatElapsedTime(this.props.update.elapsed_time, '')}</td>
                <td>{this.props.update.document_num}</td>
                <td>{this.props.update.name}</td>
                <td>{formatStatus(this.props.update.status)}</td>
                <td>{this.props.update.items}</td>
            </tr>
        )*/
    }
}

function formatElapsedTime(seconds, output) {
    var nextOutput = output;
    var years = Math.floor(seconds / 31536000);
    if (years > 0) {
        nextOutput += years + 'y ';
        return formatElapsedTime(seconds - (years * 31536000), nextOutput);
    } else {
        var months = Math.floor(seconds / 2592000);
        if (months > 0) {
            nextOutput += months + ' months, ';
            return formatElapsedTime(seconds - (months * 2592000), nextOutput);
        } else {
            var days = Math.floor(seconds / 86400);
            if (days > 0) {
                nextOutput += days + ' days, ';
                return formatElapsedTime(seconds - (days * 86400), nextOutput);
            } else {
                var hours = Math.floor(seconds / 3600);
                if (hours > 0) {
                    nextOutput += hours + 'h ';
                    return formatElapsedTime(seconds - (hours * 3600), nextOutput);
                } else {
                    var minutes = Math.floor(seconds / 60);
                    if (minutes > 0) {
                        nextOutput += minutes + 'min';
                        return nextOutput;
                    }
                }
            }
        }
    }
}
