'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hospitalBlood = (event, context, callback) => {
  var scannedID;
  var hospitalparams = {
    TableName: process.env.HOSPITAL_TABLE,
    FilterExpression: "#item_userID = :this_userID",
    ExpressionAttributeValues: {
      ":this_userID": event.pathParameters.id,
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
      var params = {
        TableName: process.env.BLOOD_TABLE,
        FilterExpression: "#item_hospitalID = :this_hospitalID",
        ExpressionAttributeNames: {
          "#item_hospitalID": "hospitalID",
        },
        ExpressionAttributeValues: {
          ":this_hospitalID": scannedID,
        },
      };
      // fetch all todos from the database
      dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
            body: JSON.stringify({"message": "Couldn\'t fetch a blood list."}),
          });
          return;
        }
    
        // create a response
        var itemsArray = [];
        /*for(var i = 0; i < result.Items.length; i++){
          itemsArray.push(result.Items[i]);
        }*/
        result.Items.forEach(item => {
            itemsArray.push(JSON.parse(JSON.stringify(item)));
        });
        /*
        itemsArray.sort((obj1, obj2) => {
          if(obj1.donorName > obj2.donorName){
            return 1;
          }
          else if(obj1.donorName == obj2.donorName){
            return 0;
          }
          else{
            return -1;
          }
        });
        */
        const response = {
          statusCode: 200,
          headers: { "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
          body: JSON.stringify(itemsArray),
        };
        callback(null, response);
      });
    }
  });
};
