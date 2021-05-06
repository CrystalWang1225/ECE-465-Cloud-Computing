'use strict';
import njwt from 'njwt';
import {encodeToken, decodeToken} from 'auth';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  timeStamp = new Date().getTime();
  userData = JSON.parse(event.body);
  var userName = userData.name;
  var userPass = userData.password;
  const params = {
    TableName: process.env.USER_TABLE,
    FilterExpression: "#user_name = :this_name",
    ExpressionAttributeNames: {
      "#user_name": "name",
    },
    ExpressionAttributeValues: {
      ":this_name": userName,
    }
  };
  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't find a user with the given username",
      });
      return;
    }

    var response = {};
    var dbUserEntry = JSON.parse(result.Item);
    if(userPass == dbUserEntry.password){
      response["statusCode"] = "200";
      response["body"] = {};
      response.body["message"] = "Login Successful!";
      response.body["token"] = encodeToken(dbUserEntry.id);
    }
    // create a response
    var resultText = JSON.parse(JSON.stringify(result.Item.data));
    const response = {
      statusCode: 200,
      body: JSON.stringify(resultText),
    };
    callback(null, response);
  });
};
