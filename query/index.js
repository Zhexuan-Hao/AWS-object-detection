import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dClient = new DynamoDBClient({});
/*
 * @param {string} name
 * @param {number} count
 */
function Tag(name, count) {
    this.name = name;
    this.count = count;
}

function ImageInfo(url, filename, tags) {
    this.url = url;
    this.filename = filename;
    this.tags = tags;
}

/* parse query string like "tag1=cat&tag1count=1&tag2=car&tag2count=1"
 * @param {Object} querystringMap
 * @return {Array<Tag>}
 */
function parseQuerystring(querystringMap) {
    if (querystringMap === undefined) {
        return [];
    }
    const tags = [];
    for (let i = 1; ; i++) {
        const tagKey = "tag" + i;
        const countKey = tagKey + "count";
        const name = querystringMap[tagKey];
        if (name) {
            const count = querystringMap[countKey];
            let countNum = count ? parseInt(count) : 1;
            countNum = isNaN(countNum) ? 1 : countNum;
            tags.push(new Tag(name.toLowerCase(), countNum));
        } else {
            break;
        }
    }
    return tags;
}

async function getItem(tags) {
    const command = new ScanCommand({
        TableName: "cloudsnap-image-database",
        // FilterExpression: filterExpression.join(" AND ")
    });
    const response = await dClient.send(command);
    let rlt = [];
    let countMap = new Map();
    for (const item of response.Items) {
        for (const tagInDb of item.Tags.M.objects.L) {
            const key = tagInDb.M.label.S.toLowerCase();
            if (countMap.has(key)) {
                const tmp = countMap.get(key);
                tmp++;
                countMap.set(key, tmp);
            } else {
                countMap.set(key, 1);
            }
        }

        let isValid = true;
        for (const tag of tags) {
            if (
                !(countMap.has(tag.name) && countMap.get(tag.name) >= tag.count)
            ) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            const imageInfo = new ImageInfo(
                item.URL.S,
                item.Key.S,
                item.Tags.M.objects.L.map((v) =>
                    v.M.label.S.toLocaleLowerCase()
                )
            );
            rlt.push(imageInfo);
        }
    }
    return rlt;
    // // const tagsInDb = response.Items.map(v => v.Tags.M.objects.L)
    // return response.Items;
}

const handler = async (event) => {
    let body;
    let statusCode = "200";
    const headers = { "Content-Type": "application/json" };

    const querystringMap = event.queryStringParameters;

    const tags = parseQuerystring(querystringMap);
    if (!tags || tags.length === 0) {
        statusCode = "400";
        body = { message: "Bad Request" };
        return { statusCode, body, headers };
    }
    body = await getItem(tags);
    console.log(body);

    body = JSON.stringify(body);

    return { statusCode, body, headers };
};

export { handler };
