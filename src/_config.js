const { EC2Client } = require("@aws-sdk/client-ec2");


const config = { 
   client : new EC2Client({ region: "eu-west-3" })
}

module.exports = config;