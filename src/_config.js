const { EC2Client } = require("@aws-sdk/client-ec2");

// Set your region here

const config = { 
   client : new EC2Client({ region: "eu-west-3" })
}

module.exports = config;