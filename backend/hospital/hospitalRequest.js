'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hospitalRequest = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const requestData = JSON.parse(event.body);
  
  var params = 
  {
    TableName: process.env.REQUEST_TABLE,
    Item: {
      id: uuid.v1(),
      createdTime: timestamp
    },
  };
  for(var field in requestData){
    params.Item[field] = requestData[field];
  }
  //Set which table to create item in
  //Set item fields
  // write the todo to the database
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
};
