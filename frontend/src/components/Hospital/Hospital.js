import React from 'react';

import ExpansionPanel from '../UI/ExpansionPanel/ExpansionPanel';
import { AccordionDetails } from '@material-ui/core';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end


const hospital = (props) => {
    console.log("props", props.disabled)
    const content = (
      <Aux>
        Area : {props.area}<br/>
        Address: {props.address}<br/>
        Hospital: {props.hospital}<br/>

        <Button 
          type="submit" 
          variant="contained" 
          color="secondary"
          disabled = {props.disabled}
          onClick = {props.clicked}
          className = "req-btn">Confirm Donation</Button>
      </Aux>
    );

    return(
        < ExpansionPanel
          donors = {true}
          heading = {`Recommended Donation Point:  ${props.hospital}`}
          content = {content}/>
    )
}

export default hospital;
