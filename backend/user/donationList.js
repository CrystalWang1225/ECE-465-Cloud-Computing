'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.donationList = (event, context, callback) => {
  console.log(event.headers);
  var this_bloodGroup = event.pathParameters.bloodGroup;
  console.log(String(this_bloodGroup));
  var params = {
      TableName: process.env.HOSPITAL_TABLE,
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
    itemsArray.sort((obj1, obj2) => {
      if(obj1[String(this_bloodGroup)] > obj2[String(this_bloodGroup)]){
        return -1;
      }
      else if(obj1[String(this_bloodGroup)] == obj2[String(this_bloodGroup)]){
        return 0;
      }
      else{
        return 1;
      }
    });
    const response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
      body: JSON.stringify(itemsArray),
    };
    callback(null, response);
  });
};
