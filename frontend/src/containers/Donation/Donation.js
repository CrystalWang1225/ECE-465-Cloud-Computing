import React, {Component} from 'react';
import {connect} from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Requests from '../../components/Requests/Requests';
import * as actions from '../../store/actions/index';
import RegisterDonor from '../../components/RegisterDonor/RegisterDonor'; 
import BroadcastRequest from '../../components/BroadcastRequest/BroadcastRequest'
import './Donation.css';
import Hospital from '../../components/Hospital/Hospital';

let API_URL = "https://w861bpjimd.execute-api.us-east-1.amazonaws.com"

class Donation extends Component{
    state = {
        phone : '',
        age : '',
        area : '',
        bloodGroup : 'O-',
        name : '',
        gender : 'male',
        available : true,
        loading : false,
        error : null,
        requesters : [],
        confirmedRequests : [],
        notifications : [],
        canDonate : true,
        donatedAt : '',
        donatedTo : '',
        dialogOpen : false,
        hospitals :[],
        numberBags : 1
    }

    componentDidMount(){
        console.log("props!!!! ", this.props.isHospital)
    }

    // Form control functions start
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    handleSubmit = () => {
        this.setState({loading: true});
        const {name,age,area,bloodGroup,gender,phone,available,donatedAt,donatedTo} = this.state;
        console.log("statu", this.state);
        console.log("props", this.props)
        if (this.props.isHospital === true){
            fetch(API_URL+'/dev/hospital/request' ,{
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
                   "userID": this.props.uid,
                   "bloodGroup": this.state.bloodGroup,
                   "numberBags": this.state.numberBags,
                })
           }).then(response => response.json())
            .then((json) => {
                console.log("requested for emergency!")
                this.setState({loading : false});
                this.setState({hasRequested : true})
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';  
                 errorMessage = error.message;
                console.log(errorMessage)
                this.setState({error : errorMessage})
            });
           
        }else {//Recommendation algorithms a the backend
            fetch(API_URL+'/dev/user/donate/'+ bloodGroup,{
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
                const hospitals = []
                console.log("response", response)
                for (let hos in response){
                    hospitals.push({id: hos, ...response[hos]})
                }
                console.log("hospitals", hospitals)
                this.setState({loading: false});
                // this.props.onSetDonors(bloodBag)
                this.setState({hospitals : hospitals})
                this.handleChange(this.state.bloodGroup)
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';  
                 errorMessage = error.message;
                console.log(errorMessage)
                this.setState({error : errorMessage})
            });}   
    }

    clickedHandler = (hospital) => {
        fetch(API_URL+'/dev/user/donate' ,{
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
        //TO DO : what to have in a appointment table
        // "id": id,
        "donorID": this.props.uid,
        "donorName": this.state.name,
        "phone": this.state.phone,
        "area" : hospital.area,
        "gender": this.state.gender,
        "donorAge" : this.state.age,
        "bloodGroup": this.state.bloodGroup,
        "hospitalID": hospital.id,
        "hospitalName": hospital.name
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
        let hospitals = this.state.hospitals
        return(
             <div className = "content-container">
                        <div className = "requests">
                            {this.state.loading 
                            ?<Spinner/>:
                            hospitals = this.state.hospitals.map(hospital => {
                                return(
                                  <Hospital
                                    key = {hospital.id} 
                                    area = {hospital.area}
                                    hospital = {hospital.name}
                                    address = {hospital.address}
                                    disabled = { this.state.hasRequested}
                                    clicked = {() => this.clickedHandler(hospital)}
                                    />
                                )
                            })         
    }</div>
            <div/>      
            <div className = "register-form">
            {this.props.isHospital ?<BroadcastRequest
            bloodGroup = {this.state.bloodGroup}
            numberBags = {this.state.numberBags}
            handleSubmit = {this.handleSubmit}
            handleChange = {this.handleChange}
            />
            : <RegisterDonor
            name = {this.state.name}
            age = {this.state.age}
            gender = {this.state.gender}
            bloodGroup = {this.state.bloodGroup}
            phone = {this.state.phone}
            available = {this.state.available}
            error = {this.state.error}
            isDonor = {this.props.isDonor}
            handleSubmit = {this.handleSubmit}
            handleChange = {this.handleChange}/>
    } 
           
        </div>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        uid : state.auth.uid,
        isDonor : state.auth.isDonor,
        isHospital: state.auth.isHospital
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetRegistered : () => dispatch(actions.registeredDonor())        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Donation);