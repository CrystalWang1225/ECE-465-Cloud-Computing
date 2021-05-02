import React, {Component} from 'react';
import firebase from 'firebase/app';
import "firebase/database";
import {connect} from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import Requests from '../../components/Requests/Requests';
import Notifications from '../../components/Notifications/Notifications';
import RegisterDonor from '../../components/RegisterDonor/RegisterDonor'
import Dialog from '../../components/UI/Dialog/Dialog';
import './Profile.css';

class Profile extends Component{
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

    timeString = '';

    componentDidMount() {
        if(this.props.isDonor){

            // Fetching donor data
            firebase.database()
                .ref(`donors/${this.props.uid}`)
                .on('value', snapshot =>{
                    const snapshotObj = snapshot.val();
                    this.setState({
                        name : snapshotObj.name,
                        age :  snapshotObj.age,
                        area :  snapshotObj.area,
                        phone : snapshotObj.phone,
                        gender : snapshotObj.gender,
                        bloodGroup : snapshotObj.bloodGroup,
                        available : snapshotObj.available,
                        donatedAt : snapshotObj.donatedAt,
                        donatedTo : snapshotObj.donatedTo,
                    });
                    const recoveryMonths = new Date(new Date().getTime() - snapshotObj.donatedAt).getMinutes()
                    if(recoveryMonths >= 2 || !snapshotObj.donatedAt){
                        this.setState({canDonate : true});
                        if(recoveryMonths >= 2  && !this.state.canDonate){
                            let updatedObj = {};
                            updatedObj[`/requests/${snapshotObj.donatedTo}/status`] = "3";
                            firebase.database().ref().update(updatedObj);
                        }
                    }
                    else
                        this.setState({canDonate : false})
                })
            
            // fetching donation requests and pushing them in their respective type
            firebase.database()
                .ref(`requests`)
                .orderByChild('to')
                .equalTo(this.props.uid)
                .on('value', snapshot => {
                    const retObj = snapshot.val();
                    let requests = [];
                    let confirmedRequests = [];
                    for(let requester in retObj){
                        if(retObj[requester].status === '0')
                            requests.push({id :requester, ...retObj[requester]})
                        else if(retObj[requester].status === '1' || retObj[requester].status === '3')
                            confirmedRequests.push({id :requester, ...retObj[requester]})
                    }

                    // fetching donor details who asked for donation and pushing then in requestersData
                    let requestersData = [];
                    for(let i = 0 ; i < requests.length ; i++){
                        firebase.database()
                            .ref(`/donors/${requests[i].from}`)
                            .on('value', ss => {
                                let retVal = ss.val()
                                requestersData.push({
                                    donatedAt :  requests[i].donatedAt, 
                                    reqId : requests[i].id, 
                                    id :requests[i].from, 
                                    name : retVal.name, 
                                    phone : retVal.phone, 
                                    area : retVal.area});
                        })
                    } 

                    // fetching donor details whom you have donated and pushing then in confirmedRequestersData                    
                    let confirmedRequestersData = [];
                    for(let i = 0 ; i < confirmedRequests.length ; i++){
                        firebase.database()
                            .ref(`/donors/${confirmedRequests[i].from}`)
                            .on('value', ss => {
                                let retVal = ss.val()
                                confirmedRequestersData.push({
                                    donatedAt :  confirmedRequests[i].donatedAt, 
                                    reqId : confirmedRequests[i].id, 
                                    id :confirmedRequests[i].from, 
                                    name : retVal.name, 
                                    phone : retVal.phone, 
                                    area : retVal.area});
                        })
                    }
                    this.setState({requesters : requestersData, confirmedRequests : confirmedRequestersData})
            })
        
        // fetching your donation requests, checking if they are confirmed and pushing them in confirmedRequests             
        firebase.database()
            .ref(`requests`)
            .orderByChild('from')
            .equalTo(this.props.uid)
            .on('value', snapshot => {
                const retObj = snapshot.val();

                let confirmedRequests = [];
                for(let requester in retObj){
                    if(retObj[requester].status === '1' || retObj[requester].status === '3')
                        confirmedRequests.push({id :requester, ...retObj[requester]})
                }
                
                // fetching donor details who have donated to you and pushing them in confirmedRequestersData                   
                let confirmedRequestersData = [];
                for(let i = 0 ; i < confirmedRequests.length ; i++){
                    firebase.database()
                        .ref(`/donors/${confirmedRequests[i].to}`)
                        .on('value', ss => {
                            let retVal = ss.val()
                            confirmedRequestersData.push({
                                reqId : confirmedRequests[i].id, 
                                donatedAt :  confirmedRequests[i].donatedAt, 
                                id :confirmedRequests[i].to, 
                                name : retVal.name, 
                                phone : retVal.phone, 
                                area : retVal.area});
                    })
                }
                this.setState({notifications : confirmedRequestersData})
            })
        }
    }

    // Form control functions start
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }

    switchAvailability = name => event => {
        firebase.database()
        .ref(`donors/${this.props.uid}/donatedAt`)
        .once('value', snapshot =>{
            const donatedAt = snapshot.val();
            const recoveryMonths = new Date(new Date().getTime() - donatedAt).getMinutes()
          
            if(recoveryMonths >= 2){
                this.setState({canDonate : true, [name]: event.target.checked });
                let updatedObj = {};
                updatedObj[`/requests/${this.state.donatedTo}/status`] = "3";
                firebase.database().ref().update(updatedObj);
            }
            else{
                let temp = new Date(this.state.donatedAt);
                // for 3 months
                // temp.setMonth(temp.getMonth() + 3);

                //for 2 minutes
                temp.setMinutes(temp.getMinutes() + 2);
                temp = temp.toString();
                temp = temp.slice(0,temp.length-34);
                this.setState({dialogOpen : true})
                this.timeString = "You can't donate till " + temp;
            }
        })
      }

    handleSubmit = () => {
        this.setState({loading : true});
        const {name,age,area,bloodGroup,gender,phone,available,donatedAt,donatedTo} = this.state;
        firebase.database()
            .ref(`donors/${this.props.uid}`)
            .set({
                name,
                age,
                area,
                bloodGroup,
                gender,
                phone,    
                available,
                donatedAt,
                donatedTo
            })
        .then(res => {
            this.setState({loading : false, error : null});
            this.props.onSetRegistered();
        })
        .catch(err => {
            this.setState({loading : false, error : err});
        })
    }
    // Form control functions end

    // Donation requests functions start
    confirmedHandler = (id,reqId) => {
        const time = new Date().getTime();
        let updatedObj = {};
        updatedObj[`requests/${reqId}/status`] = "1"; 
        updatedObj[`requests/${reqId}/donatedAt`] = time;
        firebase.database().ref().update(updatedObj)

        updatedObj = {};
        updatedObj[`donors/${this.props.uid}/donatedAt`] = time;
        updatedObj[`donors/${this.props.uid}/available`] = false;
        updatedObj[`donors/${this.props.uid}/donatedTo`] = reqId;
        firebase.database().ref().update(updatedObj)
    }
 
    canceledHandler = (id,reqId) => {
        let updatedObj = {};
        updatedObj[`requests/${reqId}/status`] = "2"; 
        firebase.database().ref().update(updatedObj)
    }
    // Donation requests functions end

    handleClose = () => {
        this.setState({dialogOpen : false})
    }
    
    render(){
        return(
            <div  className = "main">
                {this.state.dialogOpen 
                    ? <Dialog 
                        text = {this.timeString} 
                        handleClose = {this.handleClose} 
                        open = {this.state.dialogOpen}  /> 
                    : null}
                {this.state.loading 
                    ? <Spinner/> 
                    : <div className = "content-container">
                        <div className = "requests">
                            <Requests 
                                canDonate = {this.state.canDonate}
                                requests  ={this.state.requesters} 
                                confirmedRequests = {this.state.confirmedRequests}
                                confirmed = {this.confirmedHandler} 
                                canceled = {this.canceledHandler}/>                
                        </div>   

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
                                switchAvailability = {this.switchAvailability}
                                handleChange = {this.handleChange}/>
                        </div>

                        <div className = "notifications">
                            <Notifications notifications  ={this.state.notifications}/>               
                        </div>      
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        uid : state.auth.uid,
        isDonor : state.auth.isDonor
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSetRegistered : () => dispatch(actions.registeredDonor())        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile);