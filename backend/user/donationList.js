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
    var itemsArray = result.Items;
    var bloodCountSet = {};
    for(var i = 0; i < itemsArray.length; i++){
      itemsArray[i]["bloodCount"] = 0;
      bloodCountSet[String(itemsArray[i].id)] = 0;
    }
    var returnArray = [];
    var itemjson;
    var hospitalCount = 0;
    /*for(var i = 0; i < result.Items.length; i++){
      itemsArray.push(result.Items[i]);
    }*/
      //console.log(itemjson);
    var bloodParams = {
      TableName: process.env.BLOOD_TABLE,
      FilterExpression : "#item_bloodGroup = :this_group",
      ExpressionAttributeNames: {
        "#item_bloodGroup": "bloodGroup",
      },
      ExpressionAttributeValues: {
        ":this_group": String(this_bloodGroup),
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
      if(this_result.length == 0){
        console.log("No need to sort");
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
          body: JSON.stringify(itemsArray),
        });
        return;
      }
      else{
        console.log("Sorting by amount of blood in this bloodGroup");
        for(var j = 0; j < this_result.Items.length; j++){
          var this_blood = this_result.Items[j];
          if(this_blood.requested != "true"){
            bloodCountSet[String(this_blood.hospitalID)] += 1;
          }
          console.log(bloodCountSet[String(this_blood.hospitalID)]);
        }
        for(var k = 0; k < itemsArray.length; k++){
          itemsArray[k].bloodCount = bloodCountSet[itemsArray[k].id];
          console.log(itemsArray[k].bloodCount);
        }
        itemsArray.sort((obj1, obj2) => {
          if(obj1["bloodCount"] < obj2["bloodCount"]){
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
      }
    });
  });
};
