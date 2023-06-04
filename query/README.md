# Query

## Query with tags

Example:

```
https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags?tag1=bus&tag1count=1
```

Known issues:
* Empty query string will cause an internal server error.

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