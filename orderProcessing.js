const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
const ses = new AWS.SES();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
require("dotenv").config();

const queueUrl = process.env.QUEUE_URL;
const topicArn = process.env.TOPIC_ARN;
const fromEmailAddress = process.env.SENDER_EMAIL;
const tableName = process.env.DYNAMODB_TABLE;

// Notify user via SES email
const emailParams = {
    Destination: {
        ToAddresses: ['rameeshakhan75@gmail.com']
    },
    Message: {
        Body: {
            Text: {
                Data: `Your order ${orderId} has been completed.`
            }
        },
        Subject: {
            Data: 'Order Completion Notification'
        }
    },
    Source: fromEmailAddress
};

// Notify user via SNS (optional)
const snsParams = {
    Message: `Your order ${orderData.productName ,orderData.quantity } has been completed.`,
    Subject: 'Order Completion Notification',
    TopicArn: topicArn
};

const orderProcessing = async (event, context) => {
    try {
        // Poll messages from SQS queue
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20 // Long polling
        };

        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            // Process each message
            for (const message of data.Messages) {
                // Your processing logic here
                const orderData = JSON.parse(message.Body);

                // Assuming you change the status to complete in your processing logic
                const orderId = orderData.orderId;
                console.log(`Order ${orderId} processed successfully`);

                // Change the order status (replace this with your actual logic)
                // Example: Set the order status to "COMPLETE"
                orderData.status = 'COMPLETE';

                // Save completed order to DynamoDB
                await saveOrderToDynamoDB(orderData);

                await ses.sendEmail(emailParams).promise();

                await sns.publish(snsParams).promise();

                // Delete the processed message from the queue
                await sqs.deleteMessage({
                    QueueUrl: queueUrl,
                    ReceiptHandle: message.ReceiptHandle
                }).promise();
            }
        }

        return { statusCode: 200, body: 'Processing complete.' };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};

async function saveOrderToDynamoDB(orderData) {
    const params = {
        TableName: "OrderListTable",
        Item: orderData
    };
    await dynamoDB.put(params).promise();
}

module.exports = {
    handler : orderProcessing
}
