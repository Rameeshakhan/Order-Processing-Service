const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const createQueue = async (event, context) => {
    try {
        const { queueName } = JSON.parse(event.body);

        // Create an SQS queue
        const { QueueUrl } = await sqs.createQueue({
            QueueName: queueName
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Queue created successfully', QueueUrl })
        };
    } catch (error) {
        console.error('Error creating queue:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler : createQueue
}