const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
const ses = new AWS.SES();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
require("dotenv").config();

const queueUrl = process.env.QUEUE_URL;
const topicArn = process.env.TOPIC_ARN;
const fromEmailAddress = process.env.SENDER_EMAIL;
const tableName = "OrderListTable1";

const orderProcessing = async (event, context) => {
    try {
        // Poll messages from SQS queue
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20 //long polling
        };

        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            // Process each message
            for (const message of data.Messages) {
        
                const orderData = JSON.parse(message.Body);

                const orderId = orderData.id;
                console.log(`Order ${orderData.productName} processed successfully`);

                orderData.status = 'COMPLETE';

                await saveOrderToDynamoDB(orderData);

                const emailParams = {
                    Destination: {
                        ToAddresses: ["address@gmail.com"]
                    },
                    Message: {
                        Body: {
                            Html: {
                                Data: `<p>Your order ${orderData.productName} has been completed.</p>`
                            }
                        },
                        Subject: {
                            Data: 'Order Completion Notification'
                        }
                    },
                    Source: fromEmailAddress
                };
                

                await ses.sendEmail(emailParams).promise();

                const snsParams = {
                    Message: `Your order ${orderData.productName, orderData.quantity} has been completed.`,
                    Subject: 'Order Completion Notification',
                    TopicArn: topicArn
                };


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
        TableName: tableName,
        Item: {
            id: orderData.id, 
            productName: orderData.productName,
            quantity: orderData.quantity,
            status: orderData.status 
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Order saved to DynamoDB successfully');
    } catch (error) {
        console.error('Error saving order to DynamoDB:', error);
        throw error; 
    }
}


module.exports = {
    handler: orderProcessing
}
