import React from "react";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

// Material UI Imports start
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import StyledTabs from './Tabs/Tabs';
import Tab from "@material-ui/core/Tab";
// Material UI Imports end

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  own: {
    background: "#af111c",
  },
});

class Navbar extends React.Component {
  
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  buttonClickedHandler = (path) => {
      this.props.history.push(path);
  }

  logout = () => {
    this.setState({value : 0});
    this.buttonClickedHandler("/logout");
  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.own}>
          <StyledTabs centered value={value} onChange={this.handleChange}>
          {this.props.isAuth ? <Tab label="Availability" onClick ={() => this.buttonClickedHandler("/available")}/>  : null}
          {this.props.isAuth ? <Tab label="Donation Center" onClick ={() => this.buttonClickedHandler("/donor")}/> : null}
          {this.props.isAuth ? <Tab label="My Account" onClick ={() => this.buttonClickedHandler("/view")}/>  : null}
          {this.props.isAuth ? <Tab label="Logout" onClick ={this.logout} />: null}
          </StyledTabs>
        </AppBar>
      </div>
    );
  }
}
const mapStateToProps = state => {
    return{
      isAuth : state.auth.isAuth,
      isDonor : state.auth.isDonor
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Navbar)));
