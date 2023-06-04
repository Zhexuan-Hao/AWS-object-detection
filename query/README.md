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
    "url": "https://cloudsnap-image-bucket.s3.amazonaws.com/testImage.jpg?AWSAccessKeyId=ASIAVVBVKMHCEIJYBDQJ&Signature=DHZN6UQ7WdCb%2BnTuPoTC29YtYaM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIGlLcXQufwV%2FghvVxl7GyqJEjIsF2waHUCDUs8px7i8YAiA%2Bs2ir%2FIl2DkpuSHClonZlU0R587aiIRyvsvdeh%2BI00yrzAgjx%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDM4ODgwNjM2OTczMiIMCSCzKxtDKYdgwSPeKscCDtKl9j9g8dm%2F%2BFZY1%2FT6QmQP7OLNLSMDz2OclXAAnsqYkH7FBMNt4xkaSsce7has3IQmsr9vEcCO2EOenhyzPHtbnDRH9nsV0hA6sKCDg53bvqg1woQQv2w09dg9brRUlxw%2FQaHRS12GgK%2BtW3xfVeP5UzOzLBgUjxnLwdppeLonC3wkI4AxHav%2FPZRs%2FxkfJaaeJRXmp1ZAtuBwCAAefvJoYuamnlTUhS7Fh95pPntSOQOfxuUXLjv%2FZ2nzDWyixpZrpTyLxYvFQbv%2B4N%2BzlU%2BZ1kT0vQMrq77VzC7eYDdnVjuqel3iFWYloMgmztNRQP1%2BrWf5h32coPa71GK1p9nQrBn0Rwr2Yx96y1di0Nux753CIihRuj5e8cu6BfzR2BYF9VLKAe%2F5S5%2FCLgOjXKtaW0ynqdG%2FDoyK444OaAQRpdgbqySaMLbN7aMGOp8Be62i%2BbpDT%2FMpZ1XghqhKiIugi0AZCJCWxQIYYqCZj9SCX2cUZxIhGLGGBsXM3Gy9tJxKO1YOByse3JE3sJHttHgdJch2rfPuksCIgdH8AVv6GfliEuF1nMS0nvWtVB0eQG%2BoWgYq5U23adldxfy8Iv9n8k%2FIyFEHDEodglSVHtKYGd1MKv35s3xWS81KNxab4kqz%2FISm3a1f%2BWMJTRl3&Expires=1717345111",
    "type": 1,
    "tags": [
        { "tag": "person", "count": 2 },
        {
            "tag": "alex",
            "count": 1
        }
    ]
}
```



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