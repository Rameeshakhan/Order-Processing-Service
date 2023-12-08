const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDB = new AWS.DynamoDB();

const createTable = async () => {
  const tableName = 'OrderListTable';

  // Check if the table already exists
  const existingTables = await dynamoDB.listTables().promise();
  if (existingTables.TableNames.includes(tableName)) {
    console.log('DynamoDB table already exists');
    return;
  }

  // Table does not exist, proceed with creation
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'orderId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'orderId', AttributeType: 'S' }, // S for string, you can choose a different type
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

// Call the createTable function
createTable();

module.exports = new AWS.DynamoDB.DocumentClient();
