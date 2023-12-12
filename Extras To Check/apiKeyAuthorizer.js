
const { parse } = require('querystring');
require("dotenv").config()
// Replace 'YOUR_EXPECTED_API_KEY' with the actual API key you expect
const expectedApiKey = `${process.env.API_Key}`

module.exports.handler = async (event) => {
  const { headers } = event;
  const apiKey = headers['APIKEY'];

  if (apiKey === expectedApiKey) {
    return generatePolicy('user', 'Allow', event.methodArn);
  } else {
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};

// Helper function to generate the policy
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ];
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};
