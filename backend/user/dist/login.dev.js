'use strict';

var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies


var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.login = function (event, context, callback) {
  var userName = String(event.pathParameters.username);
  var userPass = String(event.pathParameters.password);
  console.log(userName);
  console.log(userPass);
  var params = {
    TableName: process.env.USER_TABLE,
    FilterExpression: "#user_name = :this_name",
    ExpressionAttributeNames: {
      "#user_name": "username"
    },
    ExpressionAttributeValues: {
      ":this_name": userName
    }
  }; // fetch todo from the database

  dynamoDb.scan(params, function (error, result) {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({
          "message": "Error occured with scan"
        })
      });
      return;
    }

    if (result.Items.length == 0) {
      console.log("No user with such username");
      callback(null, {
        statusCode: error.statusCode,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({
          "message": "No user with such username"
        })
      });
      return;
    }

    var dbUserEntry = JSON.parse(JSON.stringify(result.Items[0]));
    console.log(dbUserEntry);

    if (userPass == String(dbUserEntry.password)) {
      var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({
          "message": "Login Successful",
          "id": dbUserEntry.id,
          "statusCode": 200
        })
      };
      callback(null, response);
    } else {
      var _response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({
          "message": "Wrong Password"
        })
      };
      callback(null, _response);
    }
  });
};