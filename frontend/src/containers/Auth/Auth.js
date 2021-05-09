import React, {Component} from 'react';
import "firebase/auth"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import Card from '../../hoc/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import './Auth.css';

// Material UI Imports start
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
// Material UI Imports end
let API_URL = "https://le300s0b39.execute-api.us-east-1.amazonaws.com"
const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
        },
        button: {
            margin: theme.spacing.unit,
            marginBottom : "15px"
        },
        authMessage :{ 
            textDecoration : 'underline', 
            cursor : 'pointer'
        }
    }
}

class Auth extends Component{
    state = {
        email: '',
        pass : '',
        error : '',
        loading : false
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isLongEnough', (value) => {
            if (value.trim().length < 6) {
                return false;
            }
            return true;
        });
    }
 
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }
    
    handleSubmit = () => {
        const opt = {"email" : this.state.email,"password":this.state.pass}
        this.setState({loading : true});
        if(this.props.isSignup){
            fetch(API_URL+'/dev/user',{
                method:'POST',
                mode: 'cors',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type",
                    "Origin" : "http://localhost:3000",

                },
                body: JSON.stringify(opt)
        }).then(response => response.json())
            .then((json) => {
                if (json.statusCode === 200){
                const uid = json.id;
                console.log("Successfully signed up!")
                this.setState({loading : false});
                this.props.onLogin(uid);
                this.props.history.replace("/donors");
                }
                else {
                    console.log("Error here")
                    console.log(json.message)
                    this.setState({loading : false});
                    let errorMessage = ''; 
                    errorMessage = json.message;
                    this.setState({error : errorMessage})
                }
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';  
                 errorMessage = error.message;
                console.log(errorMessage)
                this.setState({error : errorMessage})
            });
        }
        else{
            fetch(API_URL+'/dev/user/kevinjiang99/abcdef',{
                method:'GET',
                mode: 'cors',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type",
                    "Origin" : "http://localhost:3000",

                }
        }).then(response => response.json())
            .then((json) => {
                const uid = json.id;
                if (json.statusCode === 200){
                    this.setState({loading : false});
                    this.props.onLogin(uid);
                    this.props.history.replace("/donors");
                }
                else {
                    console.log("Error here")
                    console.log(json.message)
                    this.setState({loading : false});
                    let errorMessage = ''; 
                    errorMessage = json.message;
                    this.setState({error : errorMessage})
                }

            })  
            .catch(error =>{
                this.setState({loading : false});
                let errorMessage = ''
                errorMessage = error.message;                    
                this.setState({error : errorMessage})
            });
        }
    }

    switchAuthState = () => {
        this.props.isSignup ? this.props.onSignin() : this.props.onSignup()
    }

    render(){
        let authMessage = "Already Have an Account? ";
        let authLink = "Sign in";
        if(!this.props.isSignup){
            authMessage = "Dont Have an Account? ";
            authLink = "Sign up";
        }
        return(
            <div  className = "Main">
            <p className="h1 heading font-weight-bold text-uppercase">Blood Bank</p>
            {!this.state.loading ?
                <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Email"
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Invalid Email']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Password"
                            type="password"
                            onChange={this.handleChange}
                            name="pass"
                            value={this.state.pass}
                            validators={['required', 'isLongEnough']}
                            errorMessages={['This field is required', 'Password must be longer than 6 characters']}
                        /><br/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            className={this.props.classes.button}>{this.props.isSignup ? "Sign Up" : "Sign In"}</Button>
                    </ValidatorForm>
                    <p>{authMessage}<strong className = {this.props.classes.authMessage} onClick = {this.switchAuthState}>{authLink}</strong></p>
                </Card> : <div  className = "auth-spinner"><Spinner/></div>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuth : state.auth.isAuth,
        isSignup : state.auth.isSignup
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onLogin : (uid) => dispatch(actions.login(uid)),
        onLogout : () => dispatch(actions.logout()),
        onSignin : () => dispatch(actions.setSignin()),
        onSignup : () => dispatch(actions.setSignup()),
        onSetRegistered : () => dispatch(actions.registeredDonor()),
        onSetRequestedDonors : (uid) => dispatch(actions.setRequests(uid))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Auth));