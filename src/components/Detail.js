import React, { Component } from 'react';
import { uuid } from 'uuidv4';

export default class Detail extends Component {
    render() {
        return (
            <tr id={"d-"} key={uuid()} className="detail-row">
                <td>{this.props.product_num}</td>
                <td>{this.props.price}</td>
                <td>{this.props.comments}</td>
            </tr>
        )
    }
}