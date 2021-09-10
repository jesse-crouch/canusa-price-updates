import React, { Component } from 'react';
import { uuid } from 'uuidv4';

export default class Update extends Component {
    render() {
        var due_date = new Date(this.props.update.due_date*1000).toLocaleDateString();
        var received_date = new Date(this.props.update.received_date*1000).toLocaleDateString();

        return (
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
        )
    }
}

function formatStatus(status) {
    if (status === 0) {
        return "Not Started";
    } else if (status === 1) {
        return "Started";
    } else {
        return "Halted";
    }
}

function formatPriority(priority) {
    if (priority === 0) {
        return "High";
    } else if (priority === 1) {
        return "Medium";
    } else {
        return "Low";
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
            nextOutput += months + 'm ';
            return formatElapsedTime(seconds - (months * 2592000), nextOutput);
        } else {
            var days = Math.floor(seconds / 86400);
            if (days > 0) {
                nextOutput += days + 'd ';
                return formatElapsedTime(seconds - (days * 86400), nextOutput);
            } else {
                var hours = Math.floor(seconds / 3600);
                if (hours > 0) {
                    nextOutput += hours + 'hr ';
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
