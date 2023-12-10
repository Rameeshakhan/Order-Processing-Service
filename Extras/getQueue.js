const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const getQueues = async (event, context) => {
    try {
        const { QueueUrls } = await sqs.listQueues().promise();

        if (QueueUrls && QueueUrls.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ queues: QueueUrls })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ queues: [] })
            };
        }
    } catch (error) {
        console.error('Error retrieving queues:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: getQueues,
};
