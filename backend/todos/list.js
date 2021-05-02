'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  var params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  var isFirstParam = true;
  for(var qsp in event.queryStringParameters){
    if(event.queryStringParameters[qsp]){
      console.log(event.queryStringParameters[qsp]);
      if(isFirstParam){
        params["FilterExpression"] = "#item_" + String(qsp) + " = :this_" + String(qsp);
        params["ExpressionAttributeValues"]={};
        params["ExpressionAttributeValues"][":this_" + String(qsp)] = String(event.queryStringParameters[qsp]);
        params["ExpressionAttributeNames"] = {};
        params["ExpressionAttributeNames"]["#item_" + String(qsp)] = String(qsp);
        isFirstParam = false;
      }
      else{
        params["FilterExpression"] += "and #item_" + String(qsp) + " = :this_" + String(qsp);
        params["ExpressionAttributeValues"][":this_" + String(qsp)] = String(event.queryStringParameters[qsp]);
        params["ExpressionAttributeNames"]["#item_" + String(qsp)] = String(qsp);
      }
    }
  }
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
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
    itemsArray.sort((obj1, obj2) => {
      if(obj1.name > obj2.name){
        return 1;
      }
      else if(obj1.name == obj2.name){
        return 0;
      }
      else{
        return -1;
      }
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(itemsArray),
    };
    callback(null, response);
  });
};
