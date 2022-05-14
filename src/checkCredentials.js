const config = require('./config');

const params = {};

console.log(config.client.describeVpcs(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
    }  
  }))