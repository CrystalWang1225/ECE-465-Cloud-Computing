import React from 'react';

import ExpansionPanel from '../UI/ExpansionPanel/ExpansionPanel';
import { AccordionDetails } from '@material-ui/core';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end


const donor = (props) => {
    console.log("props", props.disabled)
    let content;
    if (props.isHospital === true){
      content = (
        <Aux>
          Donor Name: {props.name}<br/>
          Area : {props.area}<br/>
          Hospital: {props.hospital}<br/>
          BloodType: {props.bloodGroup}<br/>
        </Aux>
      );
    }else {
      content = (
      <Aux>
      Area : {props.area}<br/>
      Hospital: {props.hospital}<br/>
      BloodType: {props.bloodGroup}<br/>

      <Button 
        type="submit" 
        variant="contained" 
        color="secondary"
        disabled = {props.disabled}
        onClick = {props.clicked}
        className = "req-btn">Request Blood Bag</Button>
    </Aux>
  );
    }
    

    return(
        < ExpansionPanel
          donors = {true}
          heading = {`Blood Bag at: ${props.area} (${props.bloodGroup})`}
          content = {content}/>
    )
}

export default donor;
