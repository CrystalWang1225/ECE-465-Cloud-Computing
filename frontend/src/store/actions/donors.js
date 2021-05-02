import * as actionTypes from './actionTypes';

export const setDonors = (donors) => {
    return{
        type : actionTypes.SET_DONORS,
        donors
    }
}

