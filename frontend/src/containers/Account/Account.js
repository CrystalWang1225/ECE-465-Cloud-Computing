import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Reserve from '../../components/Reserve/Reserve';
import Request from '../../components/Reserve/Request';
import './Account.css'; 
import Appt from '../../components/Appt/Appt';

import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Card from '../../hoc/Card/Card';
import { withStyles } from "@material-ui/core/styles";

let API_URL = "https://w861bpjimd.execute-api.us-east-1.amazonaws.com"
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
        Error :{ 
            textDecoration : 'underline', 
            cursor : 'pointer'
        }
    }
}

class Account extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bloodGroup : '',
            bloodReserves : [],
            bloodAppointment : [],
            bloodRequests :[],
            area: '',
            hasRequested: false,
            hospitalName: '',
            hospitalAddress :'',
            hospitalArea: ''
          }
    }
//     timeString = '';

    componentDidMount() {
        // For getting the blood bag reservation table
        fetch(API_URL+'/dev/hospital/seerequests',{
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
    .then((response) => {
        const bloodRequests = []
        console.log("request response", response)
        for (let request in response){
            bloodRequests.push({id: request, ...response[request]})
        }
        console.log("blood request", bloodRequests)
        this.setState({bloodRequests: bloodRequests})
         // this.handleChange(this.state.bloodGroup)
        })
        .catch(error => {
            this.setState({loading : false});
            let errorMessage = '';  
             errorMessage = error.message;
            console.log(errorMessage)
            this.setState({error : errorMessage})
        });


            // For getting the blood bag reservation table
            fetch(API_URL+'/dev/user/reqlist/' + this.props.uid,{
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
        .then((response) => {
            const bloodBag = []
            console.log("response for individual requests", response)
            for (let blood in response){
                bloodBag.push({id: blood, ...response[blood]})
            }
            console.log(bloodBag)
            this.props.onSetRegistered(bloodBag)
            this.setState({bloodReserves: bloodBag})
             // this.handleChange(this.state.bloodGroup)
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';  
                 errorMessage = error.message;
                console.log(errorMessage)
                this.setState({error : errorMessage})
            });

        //For viewing donation appointment
        //Differentiate between individual & hospital
        if (this.props.isHospital){
            fetch(API_URL+'/dev/hospital/donations/' + this.props.uid,{
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
        .then((response) => {
            const appointment = []
            console.log(" donation response for hospital", response)
            for (let appoint in response){
                appointment.push({id: appoint, ...response[appoint]})
            }
            // this.props.onSetRegistered(bloodBag)
            this.setState({bloodAppointment: appointment})
            console.log("state", this.state)
             // this.handleChange(this.state.bloodGroup)
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';  
                 errorMessage = error.message;
                console.log(errorMessage)
                this.setState({error : errorMessage})
            });
        } else {      
              fetch(API_URL+'/dev/user/donationlist/' + this.props.uid,{
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
    .then((response) => {
        console.log("user id", this.props.uid)
        const appointment = []
        console.log(" donation response", response)
        for (let appoint in response){
            appointment.push({id: appoint, ...response[appoint]})
        }
        console.log("Appointment", appointment)
        // this.props.onSetRegistered(bloodBag)
        this.setState({bloodAppointment: appointment})
        console.log("state", this.state)
         // this.handleChange(this.state.bloodGroup)
        })
        .catch(error => {
            this.setState({loading : false});
            let errorMessage = '';  
             errorMessage = error.message;
            console.log(errorMessage)
            this.setState({error : errorMessage})
        });
}
    }

    handleChange = (event) => {
 
        this.setState({ [event.target.name] : event.target.value });
    
    }
    
    handleSubmit= () =>{
        fetch(API_URL+'/dev/hospital/create' ,{
            method:'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
                "Origin" : "http://localhost:3000",
       
            },
            body: JSON.stringify({
               "area" : this.state.hospitalArea,
               "name": this.state.hospitalName,
               "address": this.state.hospitalAddress
            })
       }).then(response => response.json())
        .then((json) => {
            console.log("requested !")
            this.setState({hasRequested : true})
        })
        .catch(error => {
            this.setState({loading : false});
            let errorMessage = '';  
             errorMessage = error.message;
            console.log(errorMessage)
            this.setState({error : errorMessage})
        });
    }

    render(){
        let bloodReserves = this.state.bloodReserves
        let bloodAppointment = this.state.bloodAppointment
        let bloodRequests = this.state.bloodRequests
      if(this.state.bloodReserves === [])
        bloodReserves = <p>You have not yet requested any blood bags</p>
      if(this.state.bloodAppointment === [])
        bloodAppointment = <p>You have not yet donation Appointments</p>

    //   else if(this.state.donors.length <= 0)  
    //     donors = <p>Sorry, No Donors are Available for the Selected Blood Group</p>
      else{
        bloodRequests = this.state.bloodRequests.map(request => {
            return( 
                <Request
                key = {request.id}
                id = {request.id}
                hospitalName = {request.hospitalName}
                bloodGroup = {request.bloodGroup}
                numberBags = {request.numberBags}/> )    
        })
        bloodReserves = this.state.bloodReserves.map(blood => {
          return(
            <Reserve
              key = {blood.id} 
              id = {blood.id}
              age = {blood.age}
              area = {blood.area}
              hospital = {blood.hospitalName}
              bloodGroup = {blood.bloodGroup}
              />
          )
        })

        bloodAppointment = this.state.bloodAppointment.map(blood => {
            return(
              <Appt
                key = {blood.id} 
                name = {blood.donorName}
                id = {blood.id}
                age = {blood.donorAge}
                area = {blood.area}
                hospital = {blood.hospitalName}
                bloodGroup = {blood.bloodGroup}
                />
            )
          })
      }
        return(
               <div className = "main-container">
            
          <div className = "center">
              {this.props.isHospital? 
              <React.Fragment>
              <div>Help the others! View Other Hospitals Request</div><br/>
              <div className = "Reserves">
                    {bloodRequests}
                </div>
          </React.Fragment>    
          :
                <React.Fragment>
                    <div>Check your Request Blood Bags</div><br/>
                    <div className = "Reserves">
                    {bloodReserves}
                    </div>
                </React.Fragment>       
              }
          
          
            <div>Check Appointments</div><br/>
            <div className = "Reserves">
                {bloodAppointment}
            </div>
            {this.props.isHospital
                    ?   
                                  
                    <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
                    <p className = "Error">{this.props.isHospital ? "Hospital Details"  : null}</p>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Hospital Name"
                            onChange={this.handleChange}
                            name="hospitalName"
                            value={this.state.hospitalName}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Area"
                            type="hospitalArea"
                            onChange={this.handleChange}
                            name="hospitalArea"
                            value={this.state.hospitalArea}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Address"
                            type="hospitalAddress"
                            onChange={this.handleChange}
                            name="hospitalAddress"
                            value={this.state.hospitalAddress}
                        /><br/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            className={this.props.classes.button}>Confirm Hospital Info</Button>
                    </ValidatorForm>
                    {/* <p>{authMessage}<strong className = {this.props.classes.authMessage} onClick = {this.switchAuthState}>{authLink}</strong></p> */}
                </Card>
                    : null}
          </div>
          </div>     
        )
           
}
}

const mapStateToProps = state => {
    return{
        uid : state.auth.uid,
        isDonor : state.auth.isDonor,
        isHospital: state.auth.isHospital,
        bloodBag : state.bloodReserves
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetRegistered : (bloodbags) => dispatch(actions.setRegistered(bloodbags))        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Account));