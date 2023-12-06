// orderCreation.js
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
require("dotenv").config()

const orderCreationHandler = async (event) => {
    try {
        const { orderID ,productName, quantity, price, status = 'pending' } = JSON.parse(event.body);

        // Create an order object
        const order = {
            orderID,
            productName,
            quantity,
            price,
            status
        };

        // Send the order to the SQS queue
        await sqs.sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(order)
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order created successfully' })
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: orderCreationHandler,
};
