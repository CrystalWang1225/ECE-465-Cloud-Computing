import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions/index';
import Avail from '../../components/Avail/Avail';
import BloodPic from '../../components/BloodPic/BloodPic';
import './Availability.css'; 

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'



let API_URL = "https://w861bpjimd.execute-api.us-east-1.amazonaws.com"

class Availability extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bloodGroup : '',
            donors : [],
            possibleGroups : '',
            area: '',
            hasRequested: false,
          }
    }

    componentDidMount() {
      //console.log("props", this.props)
      if (this.props.isHospital){
        // For hospital use
        fetch(API_URL+'/dev/hospital/blood/' + this.props.uid, {
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
          console.log("hospital response", response)
          for (let blood in response){
            // If the blood bag has been requested, not showing on the availability page
              if (response[blood].requested === "true" 
               || response[blood].requested === true){
                continue
              }
              bloodBag.push({id: blood, ...response[blood]})
          }
          console.log(bloodBag)
          this.props.onSetDonors(bloodBag)
          console.log(this.state)
          this.handleChange(this.state.bloodGroup)
      })
      .catch(error => {
          this.setState({loading : false});
          let errorMessage = '';  
           errorMessage = error.message;
          console.log(errorMessage)
          this.setState({error : errorMessage})
      });

      }else{
        // For individuals to view all the availabilities
        fetch(API_URL+'/dev/user/list',{
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
            // If the blood bag has been requested, not showing on the availability page
              if (response[blood].requested === "true" 
               || response[blood].requested === true){
                continue
              }
              bloodBag.push({id: blood, ...response[blood]})
          }
          console.log(bloodBag)
          this.props.onSetDonors(bloodBag)
          console.log(this.state)
          this.handleChange(this.state.bloodGroup)
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

    handleChange = bloodGroup => {
        this.setState({ bloodGroup});
        let donors = [];
        let possibleGroups = '';
        if(bloodGroup === "AB+"){
          donors = [...this.props.donors];
          possibleGroups = 'all';
        }
        else if(bloodGroup === "AB-"){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "A-" || donor.bloodGroup === "B-" || donor.bloodGroup === "O-" || donor.bloodGroup === "AB-" 
          })
          possibleGroups = 'AB-, A-, B- and O-';
        }
        else if(bloodGroup === "A+"){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O+" || donor.bloodGroup === "O-" || donor.bloodGroup === "A+" || donor.bloodGroup === "A-" 
          })
          possibleGroups = 'A+, A-, O+ and O-';
        }
        else if(bloodGroup === "A-"){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O-" || donor.bloodGroup === "A-" 
          })
          possibleGroups = 'A- and O-';
        }
        else if(bloodGroup === "B+"){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O+" || donor.bloodGroup === "O-" || donor.bloodGroup === "B+" || donor.bloodGroup === "B-" 
          })
          possibleGroups = 'B+, B-, O+ and O-';
        }
        else if(bloodGroup === "B-"){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O-" || donor.bloodGroup === "B-" 
          })
          possibleGroups = 'B- and O-';
        }
        else if(bloodGroup === 'O+'){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O-" || donor.bloodGroup === "O+" 
          })
          possibleGroups = 'O+ and O-';
        }
        else if(bloodGroup === 'O-'){
          donors = this.props.donors.filter(donor => {
            return donor.bloodGroup === "O-"
          })
          possibleGroups = 'O-';
        }
        this.setState({donors, possibleGroups})
      };
    
      clickedHandler = (id) => {
               fetch(API_URL+'/dev/user/ReqBlood' ,{
            method:'PUT',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Request-Method": "PUT",
                "Access-Control-Request-Headers": "Content-Type",
                "Origin" : "http://localhost:3000",

            },
            body: JSON.stringify({
               "id": id,
               "requesterID": this.props.uid,
               "requested": true
            })
    }).then(response => response.json())
        .then((json) => {
            console.log("response", json)
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
     let donors = ''
      if(this.state.bloodGroup === '')
        donors = <p>Select a Blood Group To Continue</p>
    //   else if(this.state.donors.length <= 0)  
    //     donors = <p>Sorry, No Donors are Available for the Selected Blood Group</p>
      else{
        donors = this.state.donors.map(donor => {
          return(
            <Avail
              key = {donor.id}
              name = {donor.donorName} 
              area = {donor.area}
              hospital = {donor.hospitalName}
              bloodGroup = {donor.bloodGroup}
              disabled = {this.state.hasRequested}
              clicked = {() => this.clickedHandler(donor.id)}
              isHospital = {this.props.isHospital}
              />
          )
        })
      }
      return(
        <div className = "main-container">
          <div className = "left">
              <BloodPic/>
          </div>
          <div className = "center">
            <FormControl>
              <InputLabel htmlFor="age-simple">Blood Group</InputLabel>
              <Select
                value={this.state.bloodGroup}
                onChange={(event) => this.handleChange(event.target.value)}
                inputProps={{
                name: 'bloodGroup',
                id: 'bloodGroup',
              }}>
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={"A+"}>A+</MenuItem>
                <MenuItem value={"A-"}>A-</MenuItem>
                <MenuItem value={"B+"}>B+</MenuItem>
                <MenuItem value={"B-"}>B-</MenuItem>
                <MenuItem value={"AB+"}>AB+</MenuItem>
                <MenuItem value={"AB-"}>AB-</MenuItem>
                <MenuItem value={"O+"}>O+</MenuItem>
                <MenuItem value={"O-"}>O-</MenuItem>
              </Select>
            </FormControl>
            {this.state.bloodGroup ? <p className = "Error">{this.state.bloodGroup} can recieve blood from {this.state.possibleGroups} group{this.state.bloodGroup !== 'O-' ? "s" : null}</p> : null}
            <div className = "Donors">
            {donors}
            </div>
          </div>
          <div className = "right">
            <BloodPic/>
          </div>
      </div>      
      )
  }
}

const mapStateToProps = state => {
    return{
        donors : state.donors.donors,
        uid : state.auth.uid,
        isDonor : state.auth.isDonor,
        requestedDonors : state.auth.requestedDonors,
        disabled : state.donors.disabled,
        isHospital:state.auth.isHospital
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetDonors : (donors) => dispatch(actions.setDonors(donors))     
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Availability);