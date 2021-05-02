import React from 'react';

import Card from '../../hoc/Card/Card';
import Requester from './Requester/Requester';
import './Requests.css';
const requests = (props) =>{
    return(
        <Card>
            <div>
                <h2 className = "h3 font-weight-bold req-heading">Requests</h2>
                {props.requests && props.requests.length > 0 ? 
                    props.requests.map((request) => {
                        return (
                            <Requester
                                key = {request.reqId} 
                                name = {request.name}
                                area = {request.area}
                                showButtons = {true}
                                disabled = {!props.canDonate}
                                confirmedAt = {request.donatedAt}
                                confirmed = {() => props.confirmed(request.id,request.reqId)} 
                                canceled = {() => props.canceled(request.id,request.reqId)}
                                phone = {request.phone} />)
                    }) : <p>No Requests Found</p>} 
            </div>

            <div>
                <h2 className = "h3 font-weight-bold req-heading">Confirmed Requests</h2>
                {props.confirmedRequests && props.confirmedRequests.length > 0 ? 
                    props.confirmedRequests.map((request) => {
                        return (
                            <Requester
                                key = {request.id} 
                                name = {request.name}
                                area = {request.area}
                                confirmedAt = {request.donatedAt}
                                showButtons = {false}
                                phone = {request.phone} />)
                        }) : <p>You haven't confirmed any requests yet</p>}
            </div>
        </Card>
    )
}

export default requests;