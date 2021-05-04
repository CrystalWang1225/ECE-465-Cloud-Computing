#!/usr/bin/env bash
PROFILE="default"
REGION=$(aws configure get region)
PREAMBLE="--profile ${PROFILE} --region ${REGION}"
TYPE=$1
ITEM_ID=91c5f250-ac67-11eb-bdb6-bd8b2fd85a68
RESTAPI_ID=$(aws apigateway get-rest-apis ${PREAMBLE} | jq '.items | .[] | select(.name == "dev-ece465-final-bloodbank") | .id' | tr -d '"')
STAGE_NAME=$(aws apigateway get-stages ${PREAMBLE} --rest-api-id ${RESTAPI_ID} | jq '.item | .[0] | .stageName' | tr -d '"')
curl -X DELETE https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/todos/${ITEM_ID}?type=${TYPE}