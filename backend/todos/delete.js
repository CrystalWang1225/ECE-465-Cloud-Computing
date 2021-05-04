'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  var itemidvar = event.pathParameters.id;
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
  var params = {
    TableName: tableNameVar,
    Key: {
      id: itemidvar,
    },
  };

  // delete the todo from the database
  dynamoDb.delete(params, (error) => {
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
      body: itemidvar,
    };
    callback(null, response);
  });
};
