'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hospitalRequest = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const requestData = JSON.parse(event.body);
  var scannedID;
  var hospitalparams = {
    TableName: process.env.HOSPITAL_TABLE,
    FilterExpression: "#item_userID = :this_userID",
    ExpressionAttributeValues: {
      ":this_userID": requestData.userID,
    },
    ExpressionAttributeNames: {
      "#item_userID": "userID",
    },
  };
  dynamoDb.scan(hospitalparams, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
        body: JSON.stringify({"message": "Error scanning hospital list"}),
      });
      return;
    }
    if(result.Items.length == 0){
      console.log("No hospital associated with user");
      callback(null, {
        statusCode: 501,
        headers: { "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
        body: JSON.stringify({"message": "No hospital associated with user"}),
      });
      return;
    }
    else{
      scannedID = result.Items[0].id;
      console.log(scannedID);
      var params = 
      {
        TableName: process.env.REQUEST_TABLE,
        Item: {
          id: uuid.v1(),
          createdAt: timestamp,
          bloodGroup: requestData.bloodGroup,
          hospitalID: scannedID,
        },
      };
      dynamoDb.put(params, (error) => {
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
            body: JSON.stringify({"message": "Couldn\'t create a request.",})
          });
          return;
        }

        // create a response
        const response = {
          statusCode: 200,
          
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
    }
  });
};
