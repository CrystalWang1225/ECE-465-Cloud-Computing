// import React, {Component} from 'react';
// import firebase from 'firebase/app';
// import "firebase/database";
// import {connect} from 'react-redux';

// import Spinner from '../../components/UI/Spinner/Spinner';
// import * as actions from '../../store/actions/index';
// import Requests from '../../components/Requests/Requests';
// import Notifications from '../../components/Notifications/Notifications';
// import RegisterDonor from '../../components/RegisterDonor/RegisterDonor'
// import Dialog from '../../components/UI/Dialog/Dialog';

// class Account extends Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             email: "",
//             password: ""
//         }
//     }
//     timeString = '';

//     componentDidMount() {

//     }

//     // Form control functions start
//     handleChange = (event) => {
//         this.setState({ [event.target.name] : event.target.value });
//     }

//     switchAvailability = name => event => {
//         firebase.database()
//         .ref(`donors/${this.props.uid}/donatedAt`)
//         .once('value', snapshot =>{
//             const donatedAt = snapshot.val();
//             const recoveryMonths = new Date(new Date().getTime() - donatedAt).getMinutes()
          
//             if(recoveryMonths >= 2){
//                 this.setState({canDonate : true, [name]: event.target.checked });
//                 let updatedObj = {};
//                 updatedObj[`/requests/${this.state.donatedTo}/status`] = "3";
//                 firebase.database().ref().update(updatedObj);
//             }
//             else{
//                 let temp = new Date(this.state.donatedAt);
//                 // for 3 months
//                 // temp.setMonth(temp.getMonth() + 3);

//                 //for 2 minutes
//                 temp.setMinutes(temp.getMinutes() + 2);
//                 temp = temp.toString();
//                 temp = temp.slice(0,temp.length-34);
//                 this.setState({dialogOpen : true})
//                 this.timeString = "You can't donate till " + temp;
//             }
//         })
//       }

//     handleSubmit = () => {
//         this.setState({loading : true});
//         const {name,age,area,bloodGroup,gender,phone,available,donatedAt,donatedTo} = this.state;
//         firebase.database()
//             .ref(`donors/${this.props.uid}`)
//             .set({
//                 name,
//                 age,
//                 area,
//                 bloodGroup,
//                 gender,
//                 phone,    
//                 available,
//                 donatedAt,
//                 donatedTo
//             })
//         .then(res => {
//             this.setState({loading : false, error : null});
//             this.props.onSetRegistered();
//         })
//         .catch(err => {
//             this.setState({loading : false, error : err});
//         })
//     }
//     // Form control functions end

//     // Donation requests functions start
//     confirmedHandler = (id,reqId) => {
//         const time = new Date().getTime();
//         let updatedObj = {};
//         updatedObj[`requests/${reqId}/status`] = "1"; 
//         updatedObj[`requests/${reqId}/donatedAt`] = time;
//         firebase.database().ref().update(updatedObj)

//         updatedObj = {};
//         updatedObj[`donors/${this.props.uid}/donatedAt`] = time;
//         updatedObj[`donors/${this.props.uid}/available`] = false;
//         updatedObj[`donors/${this.props.uid}/donatedTo`] = reqId;
//         firebase.database().ref().update(updatedObj)
//     }
 
//     canceledHandler = (id,reqId) => {
//         let updatedObj = {};
//         updatedObj[`requests/${reqId}/status`] = "2"; 
//         firebase.database().ref().update(updatedObj)
//     }
//     // Donation requests functions end

//     handleClose = () => {
//         this.setState({dialogOpen : false})
//     }
    
//     render(){
//         return(
//             <div  className = "main">
//                 {this.state.dialogOpen 
//                     ? <Dialog 
//                         text = {this.timeString} 
//                         handleClose = {this.handleClose} 
//                         open = {this.state.dialogOpen}  /> 
//                     : null}
//                 {this.state.loading 
//                     ? <Spinner/> 
//                     : <div className = "content-container">
//                         <div className = "requests">
//                             <Requests 
//                                 canDonate = {this.state.canDonate}
//                                 requests  ={this.state.requesters} 
//                                 confirmedRequests = {this.state.confirmedRequests}
//                                 confirmed = {this.confirmedHandler} 
//                                 canceled = {this.canceledHandler}/>                
//                         </div>   

//                         <div className = "register-form">
//                             <RegisterDonor
//                                 name = {this.state.name}
//                                 age = {this.state.age}
//                                 area = {this.state.area}
//                                 gender = {this.state.gender}
//                                 bloodGroup = {this.state.bloodGroup}
//                                 phone = {this.state.phone}
//                                 available = {this.state.available}
//                                 error = {this.state.error}
//                                 isDonor = {this.props.isDonor}
//                                 handleSubmit = {this.handleSubmit}
//                                 switchAvailability = {this.switchAvailability}
//                                 handleChange = {this.handleChange}/>
//                         </div>

//                         <div className = "notifications">
//                             <Notifications notifications  ={this.state.notifications}/>               
//                         </div>      
//                     </div>
//                 }
//             </div>
//         )
//     }
// }

// const mapStateToProps = state => {
//     return{
//         uid : state.auth.uid,
//         isDonor : state.auth.isDonor
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return{
//         onSetRegistered : () => dispatch(actions.registeredDonor())        
//     }
// }

// export default connect(mapStateToProps,mapDispatchToProps)(Account);