import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

function Tag(tag, count) {
    this.tag = tag;
    this.count = count;
}

function ImageInfo(url, filename, tags) {
    this.url = url;
    this.filename = filename;
    this.tags = tags;
}

const client = new DynamoDBClient({});

async function handler(event) {
    let body;
    let statusCode = "200";
    const headers = { "Content-Type": "application/json" };

    const filename = event.pathParameters.filename;

    const command = new ScanCommand({
        TableName: "cloudsnap-image-database",
        FilterExpression: "#keyname = :filename",
        ExpressionAttributeValues: {
            ":filename": { S: filename },
        },
        ExpressionAttributeNames: {
            "#keyname": "Key",
        },
    });

    const response = await client.send(command);
    const rlt = [];
    for (const item of response.Items) {
        const countMap = new Map();
        for (const tagItem of item.Tags.M.objects.L) {
            const name = tagItem.M.label.S.toLocaleLowerCase();
            if (countMap.has(name)) {
                const tmp = countMap.get(name) + 1;
                countMap.set(name, tmp);
            } else {
                countMap.set(name, 1);
            }
        }
        const tags = Array.from(countMap, ([k, v]) => new Tag(k, v));
        const imageInfo = new ImageInfo(item.URL.S, item.Key.S, tags);
        rlt.push(imageInfo);
    }

    body = rlt;
    body = JSON.stringify(body);
    return { statusCode, body, headers };
}

export { handler };
