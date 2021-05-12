#!/usr/bin/env bash
PROFILE="default"
REGION=$(aws configure get region)
PREAMBLE="--profile ${PROFILE} --region ${REGION}"
TYPE=$1

RESTAPI_ID=$(aws apigateway get-rest-apis ${PREAMBLE} | jq '.items | .[] | select(.name == "dev-ece465-final-bloodbank") | .id' | tr -d '"')
STAGE_NAME=$(aws apigateway get-stages ${PREAMBLE} --rest-api-id ${RESTAPI_ID} | jq '.item | .[0] | .stageName' | tr -d '"')
while IFS="" read -r p || [ -n "$p" ]
do
 jqs=$(jq -R 'split(",") | {"\(.[0])": "\(.[1])", "\(.[2])": "\(.[3])", "\(.[4])": "\(.[5])", "\(.[6])": "\(.[7])", "\(.[8])": "\(.[9])", area: "\(.[11])", "\(.[12])": "\(.[13])", "\(.[14])": "\(.[15])", "\(.[16])": "\(.[17])"}' <(echo "$p"))
 curl -X POST -H "Content-Type: application/json" https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/user/donate --data "$jqs"
done < donationData2.txt