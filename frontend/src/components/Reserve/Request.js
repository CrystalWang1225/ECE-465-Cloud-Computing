import React from 'react';

import ExpansionPanel from '../UI/ExpansionPanel/ExpansionPanel';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end


const request = (props) => {
    console.log("props", props.disabled)
    const content = (
      <Aux>
        Hospital Name: {props.hospitalName}<br/>
        Number of Bags: {props.numberBags}<br/>
        Blood Type: {props.bloodGroup}<br/>
      </Aux>
    );

    return(
        < ExpansionPanel
          donors = {true}
          heading = {`Request Number: ${props.id}`}
          content = {content}/>
    )
}

export default request;
