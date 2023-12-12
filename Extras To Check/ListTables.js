const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB();

const ListTables = async (event, context) => {
  try {
    // List all tables
    const tableList = await dynamoDB.listTables().promise();
    const tableNames = tableList.TableNames;

    // Fetch details for each table
    const tableDetails = await Promise.all(
      tableNames.map(async (tableName) => {
        const description = await dynamoDB.describeTable({ TableName: tableName }).promise();
        return {
          TableName: tableName,
          TableDescription: description.Table,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(tableDetails),
    };
  } catch (error) {
    console.error('Error listing tables:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

module.exports = {
  handler: ListTables,
};
