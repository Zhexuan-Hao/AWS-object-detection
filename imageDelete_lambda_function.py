import json
import boto3

s3_client = boto3.client("s3")
s3_service = boto3.resource("s3")
database = boto3.resource('dynamodb')
itemIsExistedDB = True
itemIsExistedS3 = True

def lambda_handler(event, context):
    userURL = event["URL"]
    
# -----------------For DynamoDB-----------------
    
    # Query the DynamoDB to find the image
    table = database.Table('cloudsnap-image-database')
    # Find image by user's query URL
    response = table.get_item(
        Key = {
            'URL': userURL
        }
    )

    # If this image exists, then print it, and set the identifier to True
    # If it does not exist, catch the error and set the identifier to False
    try:
        print('This image exists in the DynamoDB', response['Item']['URL'])
        itemIsExistedDB = True
    except:
        print('This image does not exist in the DynamoDB')
        itemIsExistedDB = False
    
    # Call delete_item method to delete this item from DynamoDB
    if itemIsExistedDB == True:
        table.delete_item(
            Key={
                'URL': userURL
            }
        )
        print("Item is deleted")
    else:
        print("No item is deleted")
    
# -----------------For Amazon S3-----------------

    # Loop over all URLs in the S3 bucket
    bucket = 'cloudsnap-image-bucket'

    # Check if the bucket is not empty
    try:
        list = s3_client.list_objects(Bucket = bucket)['Contents']
    except:
        return ("The S3 bucket has no images.")

    for s3_key in list:
        # imageInS3 = 'https://cloudsnap-image-bucket.s3.amazonaws.com/' + s3_key['Key']
        # imageInS3 = response['Item']['Key']
        # print(imageInS3)
        
        # if userURL == imageInS3:
        #     s3_service.Object(bucket, s3_key['Key']).delete()
        #     print("The image has been deleted.")
        # else:
        #     print("User's query does not match this image.")

        try:
            print('This image exists in the S3', response['Item']['Key'])
            itemIsExistedS3 = True
        except:
            print('This image does not exist in the S3')
            itemIsExistedS3 = False
        
        if itemIsExistedS3 == True and s3_key['Key'] == response['Item']['Key']:
            s3_service.Object(bucket, s3_key['Key']).delete()
            print("Image is deleted")
        else:
            print("No image is deleted")

# -----------------Return-----------------

    if (itemIsExistedDB == True and itemIsExistedS3 == True):
        return {
            'S3 image': 'Deleted',
            'DynamoDB item': 'Deleted'
        }
    
    elif (itemIsExistedDB != True and itemIsExistedS3 == True):
        return {
            'S3 image': 'Not deleted',
            'DynamoDB item': 'Deleted'
        }
    
    elif (itemIsExistedDB == True and itemIsExistedS3 == False):
        return {
            'S3 image': 'Deleted',
            'DynamoDB item': 'Not deleted'
        }
    
    elif (itemIsExistedDB != True and itemIsExistedS3 == False):
        return {
            'S3 image': 'Not deleted',
            'DynamoDB item': 'Not deleted'
        }