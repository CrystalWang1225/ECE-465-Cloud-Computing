import React from 'react';

import Card from '../../hoc/Card/Card';
import Notification from '../Requests/Requester/Requester';

const notifications = (props) =>{
    return(
        <Card>
            <h2 className = "h2 heading font-weight-bold req-heading">Notifications</h2>            
            {props.notifications && props.notifications.length > 0 ?
                props.notifications.map((notification) => {
                    return (
                        <Notification
                            key = {notification.id} 
                            name = {notification.name + " has accepted your donation request"}
                            area = {notification.area}
                            phone = {notification.phone}
                            confirmedAt = {notification.donatedAt} />)
                }) : <p>No Notifications Found</p>}
        </Card>
    )
}

export default notifications;