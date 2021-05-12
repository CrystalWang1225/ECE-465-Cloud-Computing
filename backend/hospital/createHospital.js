'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createHospital = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  const hospitalData = JSON.parse(event.body);
  const params = {
    TableName: process.env.USER_TABLE,
    FilterExpression: "#hospital_name = :this_name",
    ExpressionAttributeNames: {
      "#hospital_name": "name",
    },
    ExpressionAttributeValues: {
      ":this_name": hospitalData.name,
    }
  };
  // fetch todo from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    const registeredID = uuid.v1();
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {         
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET" },
        body: JSON.stringify({"message": "Error occured with scan"}),
      });
      return;
    }
    if(result.Items.length == 0){
      console.log("No existing user with this email, OK");
      var createParams = {
          TableName: process.env.USER_TABLE,
          Item: {
              id: registeredID,
              createdAt: timeStamp,
              updatedAt: timeStamp,
          }
      }
      for(var field in hospitalData){
          createParams.Item[field] = hospitalData[field];
      }
      dynamoDb.put(createParams, (error) => {
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
            body: JSON.stringify({"message": 'Couldn\'t create hospital.'}),
          });
          return;
        }
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
          },
          body: JSON.stringify({
            "statusCode": 200,
            "message": "Succeeded in creating a hospital item",
            "id": registeredID
          }),
        });
      });
    }
    else{
      console.log("Hospital already exists");
      const params = {
          TableName: process.env.HOSPITAL_TABLE,
        Key: {
          id: result.Items[0].id,
        },
        ReturnValues: 'ALL_NEW',
      };
      params["ExpressionAttributeNames"] = {};
      params["ExpressionAttributeValues"] = {};
      var isFirstField = true;
      for(var field in hospitalData){
        if(String(field) == "id"){
            continue;
        }
        if(isFirstField){
          params["UpdateExpression"] = "SET #item_" + String(field) + " = :this_" + String(field);
          params["ExpressionAttributeValues"][":this_" + String(field)] = String(hospitalData[field]);
          params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
          isFirstField = false;
        }
        else{
          params["UpdateExpression"] += ", #item_" + String(field) + " = :this_" + String(field);
          params["ExpressionAttributeValues"][":this_" + String(field)] = String(hospitalData[field]);
          params["ExpressionAttributeNames"]["#item_" + String(field)] = String(field);
        }
      }
      params["UpdateExpression"] += ", updatedAt = :this_updatedAt";
      params["ExpressionAttributeValues"][":this_updatedAt"] = timeStamp;

      dynamoDb.update(params, (error) => {
        // handle potential errors
        if (error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 501,
            headers: { "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT" },
            body: JSON.stringify({"message":"Couldn\'t update hospital."}),
        });
        return;
        }
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
          },
          body: JSON.stringify({
            "statusCode": 200,
            "message": "Succeeded in updating a hospital item",
            "id": result.Items[0].id
          }),
        });  
      }); 
    }
  });
};
