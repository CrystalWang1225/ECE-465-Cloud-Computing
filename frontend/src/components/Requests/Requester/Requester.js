import React from 'react';

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import ExpansionPanel from '../../UI/ExpansionPanel/ExpansionPanel';
import './Requester.css';

// Material UI Imports start
import Button from '@material-ui/core/Button';
// Material UI Imports end

const donor = (props) => {
    let date = new Date(props.confirmedAt).toString();
    date = date.slice(0, date.length - 34);

  const content = (
    <Aux>
      Phone : {props.phone} <br/>
      Area : {props.area}<br/>
      {props.showButtons ? "Requested At" : "Confirmed At"} : {date}<br/>
      {props.showButtons ?
        <Aux>
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary"
            disabled = {props.disabled}
            onClick = {props.confirmed}
            className = "req-btn">Confirm</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary"
            disabled = {props.disabled}
            onClick = {props.canceled}
            className = "req-btn">Cancel</Button>
        </Aux> :
        null}
    </Aux>
  )

    return(
      <ExpansionPanel
        donors = {false}
        heading = {props.name}
        content = {content}/>
    )
}

export default donor;