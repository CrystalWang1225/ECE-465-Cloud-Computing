'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateUser = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const updateData = JSON.parse(event.body);
  const params = {
      TableName: process.env.USER_TABLE,
    Key: {
      id: updateData.id,
    },
    ReturnValues: 'ALL_NEW',
  };
  params["ExpressionAttributeNames"] = {};
  params["ExpressionAttributeValues"] = {};
  var isFirstField = true;
  for(var field in updateData){
    if(String(field) == "id"){
        continue;
    }
    if(isFirstField){
      params["UpdateExpression"] = "SET #item_" + String(field) + " = :this_" + String(field);
      params["ExpressionAttributeValues"][":this_" + String(field)] = String(updateData[field]);
      params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
      isFirstField = false;
    }
    else{
      params["UpdateExpression"] += ", #item_" + String(field) + " = :this_" + String(field);
      params["ExpressionAttributeValues"][":this_" + String(field)] = String(updateData[field]);
      params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
    }
  }
  params["UpdateExpression"] += ", updatedAt = :this_updatedAt";
  params["ExpressionAttributeValues"][":this_updatedAt"] = timestamp;

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
        body: JSON.stringify({"message":"Couldn\'t fetch the todo item."}),
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
