import React, {Component} from 'react';
import firebase from "firebase/app"
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
let API_URL = "https://rvlko3zwhc.execute-api.us-east-1.amazonaws.com"
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
        let opt = {
            "name": "Crystal", 
            "place": "CA", 
            "job": "Software Engineer"
        }
        console.log(opt)
        this.setState({loading : true});
        if(this.props.isSignup){
            console.log("hi")
            fetch(API_URL+'/dev/todos',{
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
                console.log("hi")
                console.log(json);
            })
            // .then(
            //     data => {
            //     const uid = response.user.uid;
            //     this.setState({loading : false});
            //     this.props.onLogin(uid);
            //     this.props.history.replace("/donors");
            //     console.log(response);
            //     console.log(data);
            // }
            // )
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';
                if(error.code === 'auth/email-already-in-use')
                    errorMessage = "Account For This Email is Already Registered"
                else if(error.code === 'auth/invalid-email')
                    errorMessage = "Invalid Email"
                else     
                    errorMessage = error.message;
                this.setState({error : errorMessage})
            });
        }
        else{
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
            .then(res =>{
                const uid = res.user.uid;
                firebase.database().ref(`donors/${uid}`).once('value')
                    .then(res => {
                        this.props.onLogin(uid);
                        if(res.val()){
                            this.props.onSetRegistered();
                            this.props.onSetRequestedDonors(uid);
                        }

                        this.props.history.replace("/donors");
                    })
                    .catch(err => {
                        this.setState({error :err, loading : false})
                    })
            })    
            .catch(error =>{
                this.setState({loading : false});
                let errorMessage = ''
                if(error.code === 'auth/wrong-password')
                    errorMessage = "Wrong Password";
                else if(error.code === 'auth/user-not-found')  
                    errorMessage = "User Doesn't Exist";  
                else     
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