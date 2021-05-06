#!/usr/bin/env bash
PROFILE="default"
REGION=$(aws configure get region)
PREAMBLE="--profile ${PROFILE} --region ${REGION}"
TYPE=$1

RESTAPI_ID=$(aws apigateway get-rest-apis ${PREAMBLE} | jq '.items | .[] | select(.name == "dev-ece465-final-bloodbank") | .id' | tr -d '"')
STAGE_NAME=$(aws apigateway get-stages ${PREAMBLE} --rest-api-id ${RESTAPI_ID} | jq '.item | .[0] | .stageName' | tr -d '"')
curl -X PUT https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/todos/b760a870-ad0c-11eb-b7ab-971970a1e97?type=${TYPE} --data '{"name": "Crystal", "place": "NY", "job": "Software Engineer"}'