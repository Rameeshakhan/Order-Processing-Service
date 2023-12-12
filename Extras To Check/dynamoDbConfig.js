const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDB = new AWS.DynamoDB({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: "us-east-1",
});

const createTable = async () => {
  const tableName = 'OrderListTable1';

  // Check if the table already exists
  const existingTables = await dynamoDB.listTables().promise();
  if (existingTables.TableNames.includes(tableName)) {
    console.log('DynamoDB table already exists');
    return;
  }

  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'orderId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'orderId', AttributeType: 'S' }, 
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

module.exports = {
  handler: createTable
};
