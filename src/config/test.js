// To test connection

var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
//const client = new EC2Client({ region: "REGION",  });
AWS.config.update({region: ""});
const client = new AWS.EC2(AWS.config.credentials.accessKeyId, AWS.config.credentials.secretAccessKey)

const params = {};

console.log(client.describeVpcs(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
    }  
  }))