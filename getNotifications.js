const AWS = require('aws-sdk');
require("dotenv").config()

const getNotification = async (event, context) => {
  // Replace 'your_region' and 'your_topic_arn' with your actual AWS region and SNS topic ARN
  const region = 'us-east-1';
  const topicArn = process.env.TOPIC_ARN;

  // Set the region for AWS SDK
  AWS.config.update({ region });

  try {
    const notifications = await fetchNotifications(topicArn);
    console.log('Fetched Notifications:', notifications);
    return { statusCode: 200, body: JSON.stringify(notifications) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};

async function fetchNotifications(topicArn) {
  const sns = new AWS.SNS();

  // List subscriptions for the specified topic
  const subscriptions = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();

  let notifications = [];

  // Iterate through the subscriptions and fetch notifications
  for (const subscription of subscriptions.Subscriptions) {
    const subscriptionArn = subscription.SubscriptionArn;

    // Retrieve the messages from the subscription
    const messages = await sns.listMessages({ SubscriptionArn: subscriptionArn }).promise();

    // Extract relevant information from the messages
    for (const message of messages.Messages) {
      const notification = {
        Subject: message.Subject,
        Message: message.Message,
        Timestamp: message.Timestamp
        // Add more fields as needed
      };
      notifications.push(notification);
    }
  }

  return notifications;
}

module.exports = {
    handler : getNotification
}
