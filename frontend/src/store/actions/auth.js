import * as actionTypes from './actionTypes';



export const setSignin = () => {
    return{
        type : actionTypes.SET_SIGNIN
    }
}

export const setSignup = () => {
    return{
        type : actionTypes.SET_SIGNUP
    }
}

export const login = (uid) => {
    return{
        type : actionTypes.LOGIN,
        uid
    }
}

export const logout = () => {
    return{
        type : actionTypes.LOGOUT
    }
}
export const setHospital = (isHospital) => {
    console.log("isHospital", isHospital)
    return {
        type: actionTypes.SET_HOSPITAL,
        isHospital
    }
}
export const registeredDonor = () => {
    return{
        type : actionTypes.REGISTERED_DONOR
    }
}
export const setRegistered = (bloodbags) => {
    return{
        type: actionTypes.SET_REQUESTED_BAGS,
        bloodbags
    }
}       
export const setRequestedDonors = (requestedDonors) => {
    return{
        type : actionTypes.SET_REQUESTED_DONORS,
        requestedDonors
    }
}

export const setRequests = (uid) => {
    return dispatch => {
        // firebase.database()
        //     .ref('/requests')
        //     .orderByChild('from')
        //     .equalTo(uid)
        //     .on('value', snapshot => {
        //         const retObj = snapshot.val();
        //         let requestedDonors = [];
        //         for(let key in retObj){
        //             if(retObj[key].status !== "2" && retObj[key].status !== "3")
        //                 requestedDonors.push({id : key, ...retObj[key]})
        //         }
            //     dispatch(setRequestedDonors(requestedDonors))            
            // })
    }
}