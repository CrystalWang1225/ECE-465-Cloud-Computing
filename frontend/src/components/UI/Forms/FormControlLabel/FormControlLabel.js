import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = {
    root: {
        marginLeft : "0px",
        marginTop : "-20px"
    },
    labelPlacementStart :{
        marginTop : "0px"
    }
  }

export default withStyles(styles)(FormControlLabel)