import React from 'react';

import ExpansionPanel from '../UI/ExpansionPanel/ExpansionPanel';
import Aux from '../../hoc/Auxiliary/Auxiliary';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end


const appt = (props) => {
    const content = (
      <Aux>
        Age : {props.age}<br/>
        Area : {props.area}<br/>
        Hospital: {props.hospital}<br/>
        BloodType: {props.bloodGroup}<br/>
      </Aux>
    );
    return(
        < ExpansionPanel
          donors = {true}
          heading = {`Appointment Number: ${props.id}`}
          content = {content}/>
    )
}

export default appt;
