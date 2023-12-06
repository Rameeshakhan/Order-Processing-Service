// getQueueMessages.js
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
require("dotenv").config();

const getQueueMessagesHandler = async (event, context) => {
    try {
        const queueUrl = process.env.QUEUE_URL;
        let allMessages = [];

        while (true) {
            // Retrieve messages from the SQS queue
            const { Messages } = await sqs.receiveMessage({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10,  // Adjust as needed
                VisibilityTimeout: 30,
                WaitTimeSeconds: 0
            }).promise();

            if (Messages && Messages.length > 0) {
                const messageBodies = Messages.map((message) => JSON.parse(message.Body));
                allMessages = allMessages.concat(messageBodies);

                // Delete the fetched messages from the queue
                await Promise.all(Messages.map((message) => {
                    return sqs.deleteMessage({
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    }).promise();
                }));
            } else {
                // No more messages in the queue
                break;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ messages: allMessages })
        };
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: getQueueMessagesHandler
};
