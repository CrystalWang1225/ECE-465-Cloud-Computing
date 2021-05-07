<<<<<<< Updated upstream
#!/usr/bin/env bash
PROFILE="default"
REGION=$(aws configure get region)
PREAMBLE="--profile ${PROFILE} --region ${REGION}"
TYPE=$1

RESTAPI_ID=$(aws apigateway get-rest-apis ${PREAMBLE} | jq '.items | .[] | select(.name == "dev-ece465-final-bloodbank") | .id' | tr -d '"')
STAGE_NAME=$(aws apigateway get-stages ${PREAMBLE} --rest-api-id ${RESTAPI_ID} | jq '.item | .[0] | .stageName' | tr -d '"')
curl -X POST https://${RESTAPI_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}/todos?type=${TYPE} --data '{"name": "Kevin", "place": "CA", "job": "Software Engineer"}'
=======
#!/bin/bash
curl POST https://rvlko3zwhc.execute-api.us-east-1.amazonaws.com --data '{"name": "Yuecen", "place": "NY", "job": "Software Engineer"}'
curl -X POST https://q8y8pf5s3d.execute-api.us-east-1.amazonaws.com/dev/todos --data '{"name": "Flossie", "place": "NY", "job": "cat"}'
curl -X POST https://q8y8pf5s3d.execute-api.us-east-1.amazonaws.com/dev/todos --data '{"name": "Kevin", "place": "NY", "job": "Electrical Engineer"}'
curl -X POST https://q8y8pf5s3d.execute-api.us-east-1.amazonaws.com/dev/todos --data '{"name": "A", "place": "NY", "job": "Electrical Engineer"}'
>>>>>>> Stashed changes
