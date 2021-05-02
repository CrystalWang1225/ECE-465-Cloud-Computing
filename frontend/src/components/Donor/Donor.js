import React from 'react';

import ExpansionPanel from '../UI/ExpansionPanel/ExpansionPanel';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end


const donor = (props) => {

    const content = (
      <Aux>
        Gender : {props.gender}<br/> 
        Age : {props.age}<br/>
        Phone : {props.phone} <br/>
        Area : {props.area}<br/>
        <Button 
          type="submit" 
          variant="contained" 
          color="secondary"
          disabled = {props.disabled}
          onClick = {props.clicked}
          className = "req-btn">Request Donation</Button>
      </Aux>
    );

    return(
        <ExpansionPanel
          donors = {true}
          heading = {`${props.name} (${props.bloodGroup})`}
          content = {content}/>
    )
}

export default donor;