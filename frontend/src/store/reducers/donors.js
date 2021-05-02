import * as actionTypes from '../actions/actionTypes';

const initialState = {
    donors : []
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_DONORS:
            return {
                ...state,
                donors : action.donors
            }
        default: 
            return state
    }
}

export default reducer;