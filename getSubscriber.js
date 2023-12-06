const AWS = require('aws-sdk');
const sns = new AWS.SNS();
require("dotenv").config();

const getSubscriber = async (event, context) => {
    try {
        // Replace 'YOUR_TOPIC_ARN' with the actual ARN of your SNS topic
        const topicArn = process.env.TOPIC_ARN;

        // List subscribers for the specified SNS topic
        const { Subscriptions } = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();

        if (Subscriptions && Subscriptions.length > 0) {
            const subscriberEmails = Subscriptions.map((subscription) => subscription.Endpoint);
            return {
                statusCode: 200,
                body: JSON.stringify({ subscribers: subscriberEmails })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ subscribers: [] })
            };
        }
    } catch (error) {
        console.error('Error retrieving subscribers:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: getSubscriber,
  };