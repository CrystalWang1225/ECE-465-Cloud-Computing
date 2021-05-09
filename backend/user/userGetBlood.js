'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.userGetBlood = (event, context, callback) => {
  const params = {
    TableName: process.env.BLOOD_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
        body: JSON.stringify({"message": "Could not get blood info"}),
      });
      return;
    }

    // create a response
    if(!result.Item){
        console.log("ID not found in BLOOD_TABLE");
        callback(null, {
            statusCode: 200,
            headers: { "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
            body: JSON.stringify({"message": "No matching blood bag for the input ID"}),
        });  
    }
    var resultText = JSON.parse(JSON.stringify(result.Item));
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
      body: JSON.stringify(resultText),
    };
    callback(null, response);
  });
};
