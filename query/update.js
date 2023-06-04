/*
There are multiple tag representations in this lambda funtion:
    1. Variables which represent Tags from dynamodb record are often named as tagRecord
    2. Variables which represent Tags from post request body are often named as tagObj or tagObjects
    3. Variables which only represent names of Tags are often named as tag

A typical result got from dynamodb is like:
``` json
{
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "IN7FK8CE5N1DABT46Q2KVE4ILRVV4KQNSO5AEMVJF66Q9ASUAAJG",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Item": {
        "URL": {
            "S": "https://cloudsnap-image-bucket.s3.amazonaws.com/testImage.jpg"
        },
        "Key": { "S": "testImage.jpg" },
        "Tags": {
            "M": {
                "objects": {
                    "L": [
                        { "M": { "label": { "S": "bus" } } },
                        { "M": { "label": { "S": "person" } } }
                    ]
                }
            }
        }
    }
}
```

And POST request should have following format:

``` json
{
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "IN7FK8CE5N1DABT46Q2KVE4ILRVV4KQNSO5AEMVJF66Q9ASUAAJG",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Item": {
        "URL": {
            "S": "https://cloudsnap-image-bucket.s3.amazonaws.com/testImage.jpg"
        },
        "Key": { "S": "testImage.jpg" },
        "Tags": {
            "M": {
                "objects": {
                    "L": [
                        { "M": { "label": { "S": "bus" } } },
                        { "M": { "label": { "S": "person" } } }
                    ]
                }
            }
        }
    }
}

```
*/

import {
    GetItemCommand,
    DynamoDBClient,
    UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

async function getImageRecord(url) {
    const command = new GetItemCommand({
        TableName: "cloudsnap-image-database",
        Key: {
            URL: { S: url },
        },
    });
    const rlt = await client.send(command);
    return rlt;
}

function getTagsFromRecord(record) {
    const rlt = [];
    const rawTags = record.Item.Tags.M.objects.L;
    for (let rawTag of rawTags) {
        rlt.push(rawTag.M.label.S);
    }
    return rlt;
}

function tags2Record(tags) {
    return tags.map((tag) => {
        return {
            M: {
                label: {
                    S: tag,
                },
            },
        };
    });
}

async function updateDB(url, newTags) {
    const command = new UpdateItemCommand({
        TableName: "cloudsnap-image-database",
        Key: {
            URL: { S: url },
        },
        UpdateExpression: "set Tags = :tags",
        ExpressionAttributeValues: {
            ":tags": {
                M: {
                    objects: {
                        L: tags2Record(newTags),
                    },
                },
            },
        },
    });
    await client.send(command);
}

async function add(imageItem, tags, url) {
    const originalTags = getTagsFromRecord(imageItem);
    const newTags = originalTags.concat(tags);
    await updateDB(url, newTags);
    return newTags;
}

async function delete_(imageItem, tagObjs, url) {
    const originalTags = getTagsFromRecord(imageItem);
    const tagsCountMap = new Map();

    for (const tagObj of tagObjs) {
        if (!tagObj.count) {
            tagObj.count = 1;
        }
        if (tagsCountMap.has(tagObj.tag)) {
            const tmp = tagsCountMap.get(tagObj.tag) + tagObj.count;
            tagsCountMap.set(tagObj.tag, tmp);
        } else {
            tagsCountMap.set(tagObj.tag, tagObj.count);
        }
    }

    const newTags = [];
    for (const oriTag of originalTags) {
        if (tagsCountMap.has(oriTag)) {
            let tmp = tagsCountMap.get(oriTag);
            if (tmp > 0) {
                tmp--;
                tagsCountMap.set(oriTag, tmp);
                continue;
            }
        }
        newTags.push(oriTag);
    }

    await updateDB(url, newTags);

    return newTags;
}

function tagObjects2Tags(tagObjects) {
    const rlt = [];
    for (let tagObj of tagObjects) {
        if (!tagObj.count) {
            tagObj.count = 1;
        }
        for (let i = 0; i < tagObj.count; i++) {
            rlt.push(tagObj.tag);
        }
    }
    return rlt;
}

const handler = async (event) => {
    let body;
    let statusCode = "200";
    const headers = { "Content-Type": "application/json" };
    const eventBody = JSON.parse(event.body);
    const eventType = parseInt(eventBody.type);
    const url = eventBody.url;
    const tagObjects = eventBody.tags;
    const imageItem = await getImageRecord(url);

    if (eventType === 1) {
        const tags = tagObjects2Tags(tagObjects);
        body = add(imageItem, tags, url);
    } else if (eventType === 0) {
        body = delete_(imageItem, tagObjects, url);
    } else {
        body = { eventType };
    }

    body = JSON.stringify(body);
    return { statusCode, headers, body };
};
export { handler };
