const AWS = require('aws-sdk');
require("dotenv").config();

const dynamoDB = new AWS.DynamoDB();
const tableName = process.env.DYNAMODB_TABLE; 

async function deleteAllDataFromDynamoDB() {
    try {
        const params = {

            TableName: tableName
        };

        await dynamoDB.deleteTable(params).promise();
        console.log(`All data deleted from DynamoDB table: ${tableName}`);
    } catch (error) {
        console.error('Error deleting all data from DynamoDB:', error);
        throw error; // Rethrow the error to be caught in the higher-level catch block
    }
}

module.exports = {
    handler: deleteAllDataFromDynamoDB,
};
