const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const getTopics = async (event, context) => {
    try {
        // Get a list of all SNS topics
        const { Topics } = await sns.listTopics().promise();

        if (Topics && Topics.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ topics: Topics })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ topics: [] })
            };
        }
    } catch (error) {
        console.error('Error getting topics:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler: getTopics,
};
