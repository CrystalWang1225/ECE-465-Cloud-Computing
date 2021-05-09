'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.signup = (event, context, callback) => {
  var timeStamp = new Date().getTime();
  var userData = JSON.parse(event.body);
  var userName = userData.username;
  var userPass = userData.password;
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
    var registerSuccess = false;
    var registeredID = uuid.v1();
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
        console.log("No user with existing name, OK");
        var createParams = {
            TableName: process.env.USER_TABLE,
            Item: {
                id: registeredID,
                createdAt: timeStamp,
                updatedAt: timeStamp,
            }
        }
        for(var field in userData){
            createParams.Item[field] = userData[field];
        }
        dynamoDb.put(createParams, (error) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
                 },
                body: JSON.stringify({"message": 'Couldn\'t create account.'}),
              });
              return;
            }
            registerSuccess = true;
            // create a response
        });
    }
    else{
        console.log("User name already exists");
        callback(null, {
            statusCode:event.statusCode,
            headers: { 
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
             },
            body: JSON.stringify({"message": "This user name has already been taken",})
          });
          return;
    }

    console.log(registerSuccess);
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
      },
      body: JSON.stringify({
        "statusCode": 200,
        "message": "Register success",
        "id": registeredID
      }),
    };
    callback(null, response);
  });
};
