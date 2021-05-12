#!/usr/bin/env bash
PROFILE="default"
REGION=$(aws configure get region)
PREAMBLE="--profile ${PROFILE} --region ${REGION}"

RESTAPI_ID=$(aws apigateway get-rest-apis ${PREAMBLE} | jq '.items | .[] | select(.name == "dev-ece465-final-bloodbank") | .id' | tr -d '"')
STAGE_NAME=$(aws apigateway get-stages ${PREAMBLE} --rest-api-id ${RESTAPI_ID} | jq '.item | .[0] | .stageName' | tr -d '"')
curl -X POST https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/todos?type=blood --data '{"donorName": "Kevin Jiang", "donorAge": "21", "bloodGroup": "O-", "hospital": "Port Authority Midtown Donor Center", "area": "Manhattan", "requesterID": "02fc27a0-b1c7-11eb-9f24-01bc5ef4558f"}'
curl -X POST https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/todos?type=blood --data '{"donorName": "Staten Boy", "donorAge": "22", "bloodGroup": "AB+", "hospital": "Staten Island Donor Center", "area": "Staten Island", "requesterID": "02fc27a0-b1c7-11eb-9f24-01bc5ef4558f"}'