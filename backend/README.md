## ECE465 Cloud Computing Final Project
### Install serverless, Node.js and NPM  
curl -o- -L https://slss.io/install | bash  
sudo apt install node (or nodejs)  
sudo apt install npm  
npm install -g serverless  

### Clone this repository onto your computer, then run:  
npm install  
serverless deploy

### Example use  
Create an item:  
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos --data '{ "name": "Kevin" }'  
List all items with filter:  
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos?name=Kevin  
Get a single item:  
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos/{id}  

