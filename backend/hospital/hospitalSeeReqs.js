'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hospitalSeeReqs = (event, context, callback) => {
  console.log(event.headers);
  var params = {
      TableName: process.env.REQUEST_TABLE,
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
        body: JSON.stringify({"message": "Couldn\'t fetch a request list"}),
      });
      return;
    }

    // create a response
    var hospitalCount = 0;
    var itemsArray = result.Items;
    var returnArray = [];
    for(var i = 0; i < result.Items.length; i++){
        var hospitalparams = {
            TableName: process.env.HOSPITAL_TABLE,
            Key: {
                id: result.Items[i].hospitalID,
            },
        }
        dynamoDb.get(hospitalparams, (this_error, this_result) =>{
            if (this_error) {
                console.error(this_error);
                callback(null, {
                  statusCode: error.statusCode || 501,
                  headers: { "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
                  body: JSON.stringify({"message": "Couldn\'t fetch a hospital item"}),
                });
                return;
            }
            for(var k = 0; k < itemsArray.length; k++){
                if(itemsArray[k] && itemsArray[k].hospitalID == this_result.Item.id){
                    itemsArray[k]["hospitalName"] = this_result.Item.name;
                    itemsArray[k]["area"] = this_result.Item.area;
                    itemsArray[k]["address"] = this_result.Item.address;
                    console.log(itemsArray[k]);
                    returnArray.push(itemsArray[k]);
                    delete itemsArray[k];
                    break;                    
                }
            }
            hospitalCount++;
            if(hospitalCount == result.Items.length){
                const response = {
                    statusCode: 200,
                    headers: { "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
                    body: JSON.stringify(returnArray),
                };
                callback(null, response);
            }
        });
    }
  });
};
