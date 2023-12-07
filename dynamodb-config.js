// dynamodb-config.js
const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDB = new AWS.DynamoDB();

const createTable = async () => {
  const params = {
    TableName: 'OrderList',
    KeySchema: [
      { AttributeName: 'orderID', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'orderID', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    await dynamoDB.createTable(params).promise();
    console.log('DynamoDB table created successfully');
  } catch (error) {
    console.error('Error creating DynamoDB table:', error);
  }
};

createTable();

module.exports = new AWS.DynamoDB.DocumentClient();
