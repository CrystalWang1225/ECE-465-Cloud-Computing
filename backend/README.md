## ECE465 Cloud Computing Final Project
### Install serverless, Node.js and NPM for Linux system:<br/>
curl -o- -L https://slss.io/install | bash  
sudo apt install node (or nodejs)  
sudo apt install npm  
npm install -g serverless  

### Clone this repository onto your computer, then run:<br/>
serverless deploy

### Directories:<br/>
/backend/user/ contains lambda functions for signing up, logging in, and individual users (Getting blood bags list, donating, recommending donation centers, etc.)  
/backend/hospital/ contains lambda for hospital users (Getting blood bags, posting emergency blood requests, entering hospital information, etc.)  
/backend/todos/ contains lambda functions purely for testing purposes (Creating items, listing items, etc.)  
/backend/scripts/ contains shell scripts purefly for testing purposes (Creating items, populating data, etc.)  

