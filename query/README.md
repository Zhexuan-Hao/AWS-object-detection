# Query

## Query with tags

Example:

```
https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags?tag1=bus&tag1count=1
```

Known issues:
* Empty query string will cause an internal server error.

## Add and Delete


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


There are multiple tag representations in this lambda funtion:

  1. Variables which represent Tags from dynamodb record are often named as tagRecord
  2. Variables which represent Tags from post request body are often named as tagObj or tagObjects
  3. Variables which only represent names of Tags are often named as tag

```