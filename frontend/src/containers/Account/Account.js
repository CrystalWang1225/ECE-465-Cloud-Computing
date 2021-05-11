import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Reserve from '../../components/Reserve/Reserve'
import './Account.css'; 
import Appt from '../../components/Appt/Appt';

// import Spinner from '../../components/UI/Spinner/Spinner';
// import * as actions from '../../store/actions/index';
// import Requests from '../../components/Requests/Requests';
// import Notifications from '../../components/Notifications/Notifications';
// import RegisterDonor from '../../components/RegisterDonor/RegisterDonor'
// import Dialog from '../../components/UI/Dialog/Dialog';

let API_URL = "https://w861bpjimd.execute-api.us-east-1.amazonaws.com"

class Account extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bloodGroup : '',
            bloodReserves : [],
            bloodAppointment : [],
            area: '',
            hasRequested: false
          }
    }
//     timeString = '';

    componentDidMount() {
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
        console.log("response", response)
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
        const appointment = []
        console.log("response", response)
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

    handleChange = bloodGroup => {
        // this.setState({})
      };
    
      clickedHandler = (id) => {
 
      }

    
    render(){
        let bloodReserves = this.state.bloodReserves
        let bloodAppointment = this.state.bloodAppointment
      if(this.state.bloodReserves == [])
        bloodReserves = <p>You have not yet requested any blood bags</p>
      if(this.state.bloodAppointment == [])
        bloodAppointment = <p>You have not yet donation Appointments</p>

    //   else if(this.state.donors.length <= 0)  
    //     donors = <p>Sorry, No Donors are Available for the Selected Blood Group</p>
      else{
        bloodReserves = this.state.bloodReserves.map(blood => {
          return(
            <Reserve
              key = {blood.id} 
              id = {blood.id}
              age = {blood.age}
              area = {blood.area}
              hospital = {blood.hospital}
              bloodGroup = {blood.bloodGroup}
              />
          )
        })

        bloodAppointment = this.state.bloodAppointment.map(blood => {
            return(
              <Appt
                key = {blood.id} 
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
          <div>Check your Request Blood Bags</div><br/>
            <div className = "Reserves">
                {bloodReserves}
            </div>
            <div>Check your appointment for Donation</div><br/>
            <div className = "Reserves">
                {bloodAppointment}
            </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(Account);