const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const createTopic = async (event, context) => {
    try {
        const { topicName } = JSON.parse(event.body);

        // Create an SNS topic
        const { TopicArn } = await sns.createTopic({
            Name: topicName
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Topic created successfully', TopicArn })
        };
    } catch (error) {
        console.error('Error creating topic:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
module.exports={
    handler:createTopic
}