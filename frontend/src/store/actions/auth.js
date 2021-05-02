import * as actionTypes from './actionTypes';
import firebase from "firebase/app";
import "firebase/database";


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

export const registeredDonor = () => {
    return{
        type : actionTypes.REGISTERED_DONOR
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
        firebase.database()
            .ref('/requests')
            .orderByChild('from')
            .equalTo(uid)
            .on('value', snapshot => {
                const retObj = snapshot.val();
                let requestedDonors = [];
                for(let key in retObj){
                    if(retObj[key].status !== "2" && retObj[key].status !== "3")
                        requestedDonors.push({id : key, ...retObj[key]})
                }
                dispatch(setRequestedDonors(requestedDonors))            
            })
    }
}