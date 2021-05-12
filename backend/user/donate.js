'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.donate = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const donationData = JSON.parse(event.body);
  
  var params = 
  {
    TableName: process.env.DONATION_TABLE,
    Item: {
      id: uuid.v1(),

    },
  };
  for(var field in donationData){
    params.Item[field] = donationData[field];
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
        body: JSON.stringify({"message": "Couldn\'t create a blood donation.",})
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
