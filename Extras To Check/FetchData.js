const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const fetchData = async (event) => {
  try {
    // Define parameters for DynamoDB scan
    const params = {
      TableName: 'OrderListTable1',
    };

    // Fetch all data from DynamoDB
    const result = await dynamoDB.scan(params).promise();

    // Check if data is found
    if (result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No orders found' }),
      };
    }

    // Return the fetched data
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

module.exports = {
    handler: fetchData,
  };
  