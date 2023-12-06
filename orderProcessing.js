// orderProcessing.js
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
const ses = new AWS.SES();
require("dotenv").config();

const orderProcessingHandler = async (event) => {
    try {
        let processedMessages = 0;

        while (true) {
            // Retrieve messages from the SQS queue
            const { Messages } = await sqs.receiveMessage({
                QueueUrl: process.env.QUEUE_URL,
                MaxNumberOfMessages: 1,
                VisibilityTimeout: 30,
                WaitTimeSeconds: 0
            }).promise();

            if (Messages && Messages.length > 0) {
                const order = JSON.parse(Messages[0].Body);

                // Simulate order processing (update status to 'completed')
                order.status = 'completed';

                // Send order completion notification using SNS
                await sns.publish({
                    TopicArn: process.env.TOPIC_ARN,
                    Message: `Order completed: ${JSON.stringify(order)}`
                }).promise();

                // Send email notification using SES
                const emailParams = {
                    Destination: {
                        ToAddresses: ['rameeshakhan75@gmail.com']
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data: `Your order has been completed: ${JSON.stringify(order)}`
                            }
                        },
                        Subject: {
                            Data: 'Order Completion Notification'
                        }
                    },
                    Source: process.env.SENDER_EMAIL
                };

                await ses.sendEmail(emailParams).promise();

                // Delete the processed message from the queue
                await sqs.deleteMessage({
                    QueueUrl: process.env.QUEUE_URL,
                    ReceiptHandle: Messages[0].ReceiptHandle
                }).promise();

                processedMessages += 1;

                // Log processed order details to the console
                console.log(`Order processed: ${JSON.stringify(order)}`);
            } else {
                // No more messages in the queue
                break;
            }
        }

        // Continue processing messages if there are more in the queue
        if (processedMessages > 0) {
            continueProcessing = true;
        } else {
            continueProcessing = false;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Processed ${processedMessages} order(s)` })
        };
    } catch (error) {
        console.error('Error processing orders:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: orderProcessingHandler,
};
