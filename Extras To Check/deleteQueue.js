const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const deleteQueue = async (event, context) => {
    try {
        const { queueUrl } = JSON.parse(event.body);

        // Delete the SQS queue
        await sqs.deleteQueue({ QueueUrl: queueUrl }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Queue deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting queue:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: deleteQueue,
};
