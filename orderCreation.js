require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const sqs = new AWS.SQS();
const lambda = new AWS.Lambda();


const orderCreationHandler = async (event) => {

    const apiKeyInHeader = event.headers.apikey;
    const apiKeyValue = process.env.API_KEY

    console.log("asodaksodksodkasodckadsc", apiKeyValue)

    if (apiKeyInHeader !== apiKeyValue) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    const { productName, quantity, price, status = 'pending' } = JSON.parse(event.body);

    try {
        const order = {
            id: uuidv4(),
            productName,
            quantity,
            price,
            status,
        };

        await sqs.sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(order),
        }).promise();

        await lambda.invoke({
            FunctionName: 'Topic-dev-order-processing',
            InvocationType: 'Event',
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order created successfully, You will get notified when completed' }),
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

module.exports = {
    handler: orderCreationHandler,
};
