const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB();

const CreateTable = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);
    const tableName = requestBody.tableName;

    const existingTables = await dynamoDB.listTables().promise();
    if (existingTables.TableNames.includes(tableName)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Table already exists' }),
      };
    }

    const params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // You can customize the key schema
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }, // You can choose a different attribute type
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    await dynamoDB.createTable(params).promise();
    
    // Wait for the table to be active (you can customize the wait logic)
    await dynamoDB.waitFor('tableExists', { TableName: tableName }).promise();

    const tableDescription = await dynamoDB.describeTable({ TableName: tableName }).promise();
    const tableArn = tableDescription.Table.TableArn;

    return {
      statusCode: 200,
      body: JSON.stringify({ tableArn }),
    };
  } catch (error) {
    console.error('Error creating table:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

module.exports = {
    handler: CreateTable,
};