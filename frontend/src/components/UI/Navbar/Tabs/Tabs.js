import Tabs from "@material-ui/core/Tabs"; 
import { withStyles } from "@material-ui/core/styles";

const style = {
    indicator : {
        backgroundColor  : "black",
    },
    root : {
        color : "white"
    }
}
export default withStyles(style)(Tabs);
