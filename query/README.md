# Query

## Query with tags

Example:

```
https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags?tag1=bus&tag1count=1
```

Known issues:
* Empty query string will cause an internal server error.

## Query with file name

Example:
```
https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/filename/testImage.jpg
```

## Add and Delete

### Format

Follow the requirements in `FIT5225_Assignment2__2023_.pdf`.

* URL: https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags
* Method: POST
* headers: Content-type: application/json
* Body: 

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
> “type” can be set to 1 or 0 for adding or removing a tag, respectively. The above request adds two "person" tags to the image and one "alex" tag to the tag list of the image in the URL: If “type” is set to 0, the tags are removed from the tag list of the image up to the maximum of either the available tags or the count value. For example, if the count for the tag person is 2 and only one tag of person is in the tag list, we remove the only existing tag. If a tag is not included in the list of tags requested for deletion, you can simply ignore it in the request. Please note that if “count” is not specified in the request, the default value of 1 should be considered.

## Delete

### Format

* URL: https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha
* Method: DELETE
* headers: Content-type: application/json
* body:
``` json
{"URL": "https://cloudsnap-image-bucket.s3.amazonaws.com/testImage.jpg?AWSAccessKeyId=ASIAVVBVKMHCPDS5ZYHS&Signature=alTgcfNIu8w00zD5pIzXVPfc%2Bvg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQD7GkEmkko30qgb9zW4p6M4%2Bqv5WYi2eitSU7dKzWuZ%2FQIhALMGjiYVyCKr7eqJBcj3oWeAI3pIhAQ%2BlruPizhMZ3aDKuoCCCkQABoMMzg4ODA2MzY5NzMyIgxp1bx5GZLR1iq9gB4qxwIATl%2F%2ByjgdiocNT0ZZM%2BuTiwvThWZlLyqrGJvkfyXSSG7b2HMqggV7Rx0FrOKa3D50JaK76MH4XnWkXJljTmvGHgHa8nP6E58UKDlWs9NnobMTUiOdhuzMmAh7cK8gOrLsz5oabN4nkfNCoovyKxjpdze2fyHDA291djEpRnl%2FOpRxqVaqQsEiCh2OiMMeudq76BWY9vMYgZN4EnUr%2BUzS5h1pcp68ZV7ROWNrABAMlfZUlBJtgGfy17rixi%2B73xCsX8%2BYvjYOqxghrOXcuu15pvDLKmcxkYMrB0LrYbS8rxvLEBEZh1X%2BA2FUvFza%2BFAqMypiviiDYqf4OPV5HyNQiHkYvvcg489Xz1vHb4bCBQYZn5sUNVw8V7UF87xc1lMlOEceR2pWjIrPd%2BNM0Un0jr8CCpfrQfP3KRxL2mnbHhixIrQP6M0wt6n2owY6nQGmkitXrX4F%2FdYyVHnR04Rm1Lx6Xp5WfyqHQM83VLpoRbHz9pgbfOcG6CJaOAwwtrAfzNNu%2Fmoj%2F4JMIc2P43mWP1L0EDLuOibYIGl52BRz5QyoUiXorVuhx6OKZzdYq57GKum86NdWEgvnRGWOoI7KuSHnXKwWMt8Qi%2F97tmUIzuQC1ZnYNBnRKGYJFxFkzVN%2F3L0s6S%2FWsc3DYoa4&Expires=1717487673"}
```

### Known Issues

* Internal error when S3 is empty