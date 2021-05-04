'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  var itemtype = String(event.queryStringParameters.type);
  var tableNameVar;
  if(itemtype == "user"){
    tableNameVar = process.env.USER_TABLE;
  }
  else if(itemtype == "blood"){
    tableNameVar = process.env.BLOOD_TABLE;
  }
  else if(itemtype == "appointment"){
    tableNameVar = process.env.APPOINTMENT_TABLE;
  }
  
  var paramsObj = 
  {
    TableName: tableNameVar,
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
  //Set which table to create item in
  //Set item fields
  for(var field in data){
    paramsObj.Item[field] = data[field];
  }
  var params = paramsObj;

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
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
