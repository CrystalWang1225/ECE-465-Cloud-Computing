import React from 'react';

// Material UI Imports start
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Material UI Imports end

const styles = theme => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    alignLeft : {
        color : "#af111c"
    },
    main : {
      backgroundColor: "#fceee3"
    }
  });

const donor = (props) => {
    return(
        <ExpansionPanel  className = {props.donors ? '' : props.classes.main}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={props.classes.heading}>
                    <strong style= {{color : "#404952"}}>{props.heading}</strong>
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography align = "left" className = {props.classes.alignLeft}>
                    {props.content}
                </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default withStyles(styles)(donor);