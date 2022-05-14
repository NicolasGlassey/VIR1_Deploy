var AWS = require('aws-sdk');

// Set your region here
AWS.config.update({region: "eu-west-3"});

const config = { 
   client : new AWS.EC2(AWS.config.credentials.accessKeyId, AWS.config.credentials.secretAccessKey)
}

module.exports = config;