'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.login = (event, context, callback) => {
  var userEmail = String(event.pathParameters.email);
  var userPass = String(event.pathParameters.password);
  console.log(userEmail);
  console.log(userPass);
  const params = {
    TableName: process.env.USER_TABLE,
    FilterExpression: "#user_email = :this_email",
    ExpressionAttributeNames: {
      "#user_email": "email",
    },
    ExpressionAttributeValues: {
      ":this_email": userEmail,
    }
  };
  // fetch todo from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET" },
        body: JSON.stringify({"message": "Error occured with scan"}),
      });
      return;
    }

    if(result.Items.length == 0){
      console.log("No user with such email");
      callback(null, {
        statusCode: error.statusCode,
        headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET" },
        body: JSON.stringify({"message": "No user with such email"}),
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
        body: JSON.stringify({"statusCode": 200,"message": "Login Successful", "item": dbUserEntry,}),
      };
      callback(null, response);
    }
    else{
      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({"message": "Wrong Password"}),
      };
      callback(null, response);
    }
  });
};
