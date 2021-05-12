import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Navbar from ".././../components/UI/Navbar/Navbar";
import Aux from "../../hoc/Auxiliary/Auxiliary";

// Containers to be rendered using routing
import Auth from "../../containers/Auth/Auth";
import Availability from "../../containers/Avail/Availability"
import Donation from "../../containers/Donation/Donation";
import Logout from "../../containers/Auth/Logout/Logout";
import Account from "../../containers/Account/Account";

class Layout extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={Auth} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route path="/available" component={props => <Availability {...props} />} />
          <Route path="/auth" component={Auth} />
          <Route path="/donor" component={Donation} />
          <Route path="/view" component={Account} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={Auth} />
        </Switch>
      );
    }
    return (
      <Aux>
        <Navbar />
        {routes}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth
  };
};

export default withRouter(connect(mapStateToProps)(Layout));
