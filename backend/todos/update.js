'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  var itemidvar = event.pathParameters.id;
  var itemtype = String(event.queryStringParameters.type);
  const params = {
    Key: {
      id: itemidvar,
    },
    ReturnValues: 'ALL_NEW',
  };
  params["TableName"] = "";
  params["ExpressionAttributeNames"] = {};
  params["ExpressionAttributeValues"] = {};
  if(itemtype == "user"){
    params["TableName"] = process.env.USER_TABLE;
  }
  else if(itemtype == "blood"){
    params["TableName"] = process.env.BLOOD_TABLE;
  }
  else if(itemtype == "appointment"){
    params["TableName"] = process.env.APPOINTMENT_TABLE;
  }
  var isFirstField = true;
  for(var field in data){
    if(isFirstField){
      params["UpdateExpression"] = "SET #item_" + String(field) + " = :this_" + String(field);
      params["ExpressionAttributeValues"][":this_" + String(field)] = String(data[field]);
      params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
      isFirstField = false;
    }
    else{
      params["UpdateExpression"] += ", #item_" + String(field) + " = :this_" + String(field);
      params["ExpressionAttributeValues"][":this_" + String(field)] = String(data[field]);
      params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
    }
  }

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
