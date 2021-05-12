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
        body: JSON.stringify({"message": "Couldn\'t fetch a hospital list."}),
      });
      return;
    }

    // create a response
    var itemsArray = [];
    var itemjson;
    /*for(var i = 0; i < result.Items.length; i++){
      itemsArray.push(result.Items[i]);
    }*/
    result.Items.forEach(item => {
      itemjson = JSON.parse(JSON.stringify(item));
      console.log(itemjson);
      var bloodParams = {
        TableName: process.env.BLOOD_TABLE,
        FilterExpression : "#item_bloodGroup = :this_group and #item_hospitalID = :this_hospitalID",
        ExpressionAttributeNames: {
          "#item_bloodGroup": "bloodGroup",
          "#item_hospitalID": "hospitalID",
        },
        ExpressionAttributeValues: {
          ":this_group": String(this_bloodGroup),
          ":this_hospitalID": String(item.id),
        }
      };
      dynamoDb.scan(bloodParams, (this_error,this_result) => {
        if (this_error) {
          console.error(this_error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
            body: JSON.stringify({"message": "Couldn\'t fetch a blood list for a hospital"}),
          });
          return;
        }
        var bloodcount = this_result.Items.length;
        console.log(itemjson.name);
        console.log(bloodcount);
        itemjson["bloodCount"] = bloodcount;
      });
      itemsArray.push(itemjson);
    });
    itemsArray.sort((obj1, obj2) => {
      if(obj1["bloodCount"] > obj2["bloodCount"]){
        return -1;
      }
      else if(obj1["bloodCount"] == obj2["bloodCount"]){
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
