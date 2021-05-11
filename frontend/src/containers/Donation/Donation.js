import React, {Component} from 'react';
import {connect} from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Requests from '../../components/Requests/Requests';
import * as actions from '../../store/actions/index';
import Dialog from '../../components/UI/Dialog/Dialog';
import RegisterDonor from '../../components/RegisterDonor/RegisterDonor'
import './Donation.css';

class Donation extends Component{
    state = {
        phone : '',
        age : '',
        area : '',
        bloodGroup : 'A+',
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
        dialogOpen : false
    }

    componentDidMount(){
        console.log("Hi YA ")
    }

    // Form control functions start
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    handleSubmit = () => {
        // this.setState({loading: true});
        const {name,age,area,bloodGroup,gender,phone,available,donatedAt,donatedTo} = this.state;
        console.log("statu", this.state);
        console.log("props", this.props)
         //TODO fetch right here 
    }
    render(){
        return(
             <div className = "content-container">
                        <div className = "requests">
                            <Requests 
                                canDonate = {this.state.canDonate}
                                requests  ={this.state.requesters} 
                                confirmedRequests = {this.state.confirmedRequests}
                                confirmed = {this.confirmedHandler} 
                                canceled = {this.canceledHandler} />                
                        </div>
            <div/>      
            <div className = "register-form">
            <RegisterDonor
                name = {this.state.name}
                age = {this.state.age}
                area = {this.state.area}
                gender = {this.state.gender}
                bloodGroup = {this.state.bloodGroup}
                phone = {this.state.phone}
                available = {this.state.available}
                error = {this.state.error}
                isDonor = {this.props.isDonor}
                handleSubmit = {this.handleSubmit}
                handleChange = {this.handleChange}/>
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