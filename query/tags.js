import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dClient = new DynamoDBClient({});
/*
 * @param {string} name
 * @param {number} count
 */
function Tag(tag, count) {
    this.tag = tag;
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
    if (querystringMap === null) {
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
    for (const item of response.Items) {
        let countMap = new Map();
        for (const tagInDb of item.Tags.M.objects.L) {
            const key = tagInDb.M.label.S.toLowerCase();
            if (countMap.has(key)) {
                const tmp = countMap.get(key) + 1;
                countMap.set(key, tmp);
            } else {
                countMap.set(key, 1);
            }
        }

        let isValid = true;
        for (const tag of tags) {
            if (
                !(countMap.has(tag.tag) && countMap.get(tag.tag) >= tag.count)
            ) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            const rltCountMap = new Map();
            for (const tagItem of item.Tags.M.objects.L) {
                const name = tagItem.M.label.S.toLocaleLowerCase();
                if (rltCountMap.has(name)) {
                    const tmp = rltCountMap.get(name) + 1;
                    rltCountMap.set(name, tmp);
                } else {
                    rltCountMap.set(name, 1);
                }
            }
            const tags = Array.from(rltCountMap, ([k, v]) => new Tag(k, v));
            const imageInfo = new ImageInfo(item.URL.S, item.Key.S, tags);
            rlt.push(imageInfo);
        }
    }
    return rlt;
}

const handler = async (event) => {
    let body;
    let statusCode = "200";
    const headers = { "Content-Type": "application/json" };

    const querystringMap = event.queryStringParameters;
    console.log("querystringMap:", querystringMap);
    const tags = parseQuerystring(querystringMap);
    console.log("tags:", tags);

    body = await getItem(tags);
    console.log(body);

    body = JSON.stringify(body);

    return { statusCode, body, headers };
};

export { handler };
