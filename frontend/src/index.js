import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore,  compose, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import authReducers from './store/reducers/auth';
import donorsReducers from './store/reducers/donors';
import './index.css';

const config = {

};
firebase.initializeApp(config);


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  auth : authReducers,
  donors : donorsReducers
})

const store = createStore( reducers, composeEnhancers( applyMiddleware(thunk) ) );

const app = (
  <Provider store = {store}>
    <App />
  </Provider>
) 

ReactDOM.render(app, document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
