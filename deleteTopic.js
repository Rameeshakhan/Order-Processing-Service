const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const deleteTopic = async (event, context) => {
    try {
        const { topicArn } = JSON.parse(event.body);

        // Delete the SNS topic
        await sns.deleteTopic({ TopicArn: topicArn }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Topic deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting topic:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: deleteTopic,
};
