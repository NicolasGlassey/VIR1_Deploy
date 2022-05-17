const { EC2Client } = require("@aws-sdk/client-ec2");


const config = { 
   client : new EC2Client({ region: "region" })
}

module.exports = config;