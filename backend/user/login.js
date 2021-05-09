'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.login = (event, context, callback) => {
  var userName = String(event.pathParameters.username);
  var userPass = String(event.pathParameters.password);
  console.log(userName);
  console.log(userPass);
  const params = {
    TableName: process.env.USER_TABLE,
    FilterExpression: "#user_name = :this_name",
    ExpressionAttributeNames: {
      "#user_name": "username",
    },
    ExpressionAttributeValues: {
      ":this_name": userName,
    }
  };
  // fetch todo from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Error occured with scan",
      });
      return;
    }

    if(result.Items.length == 0){
      console.log("No user with such username");
      callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: "No user with such username",
      });
      return;
    }
    var dbUserEntry = JSON.parse(JSON.stringify(result.Items[0]));
    console.log(dbUserEntry);
    if(userPass == String(dbUserEntry.password)){
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({"message": "Login Successful", "token": dbUserEntry.id}),
      };
      callback(null, response);
    }
    else{
      const response = {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/plain',
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: "Wrong Password",
      };
      callback(null, response);
    }
  });
};
