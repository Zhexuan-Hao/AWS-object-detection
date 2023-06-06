# import the necessary packages
import numpy as np
import cv2
import time
import boto3
import os
import base64

# construct the argument parse and parse the arguments
confthres = 0.3
nmsthres = 0.1

s3 = boto3.client("s3")
yolo_config_bucket = "cloudsnap-yolo-config"
dynamodb = boto3.resource('dynamodb').Table('cloudsnap-image-database')
image_bucket = "cloudsnap-image-bucket"

def upload_image(image_str):

    file_path = '/tmp/image.jpg'

    # image loading
    data = image_str

    # json_data = json.loads(data)
    decoded_image = base64.b64decode(data)

    # image downloading
    with open(file_path, 'wb') as file:
        file.write(decoded_image)

    # image uploading
    s3 = boto3.client('s3')
    object_name = image_str
    object_name = object_name[:32] + ".jpg"
    object_name = object_name.replace('/', '')
    s3.upload_file(file_path, image_bucket, object_name)

    return object_name

def get_labels(labels_path):
    # load the COCO class labels our YOLO model was trained on
    local_file_path = '/tmp/coco.names'
    s3.download_file(yolo_config_bucket, labels_path, local_file_path)
    lpath = os.path.join(local_file_path)
    LABELS = open(lpath).read().strip().split("\n")
    return LABELS

def get_weights(weights_path):
    local_file_path = '/tmp/yolov3-tiny.weights'
    s3.download_file(yolo_config_bucket, weights_path, local_file_path)
    return local_file_path

def get_config(config_path):
    local_file_path = '/tmp/yolov3-tiny.cfg'
    s3.download_file(yolo_config_bucket, config_path, local_file_path)
    return local_file_path

def load_model(configpath, weightspath):
    # load our YOLO object detector trained on COCO dataset (80 classes)
    net = cv2.dnn.readNetFromDarknet(configpath, weightspath)
    return net

def do_prediction(image,net,LABELS):

    (H, W) = image.shape[:2]
    # determine only the *output* layer names that we need from YOLO
    ln = net.getLayerNames()
    ln = [ln[i - 1] for i in net.getUnconnectedOutLayers()]

    # construct a blob from the input image and then perform a forward
    # pass of the YOLO object detector, giving us our bounding boxes and
    # associated probabilities
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    start = time.time()
    layerOutputs = net.forward(ln)
    #print(layerOutputs)
    end = time.time()

    # show timing information on YOLO
    print("[INFO] YOLO took {:.6f} seconds".format(end - start))

    # initialize our lists of detected bounding boxes, confidences, and
    # class IDs, respectively
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:
        # loop over each of the detections
        for detection in output:
            # extract the class ID and confidence (i.e., probability) of
            # the current object detection
            scores = detection[5:]
            # print(scores)
            classID = np.argmax(scores)
            # print(classID)
            confidence = scores[classID]

            # filter out weak predictions by ensuring the detected
            # probability is greater than the minimum probability
            if confidence > confthres:
                # scale the bounding box coordinates back relative to the
                # size of the image, keeping in mind that YOLO actually
                # returns the center (x, y)-coordinates of the bounding
                # box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")

                # use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))

                # update our list of bounding box coordinates, confidences,
                # and class IDs
                boxes.append([x, y, int(width), int(height)])

                confidences.append(float(confidence))
                classIDs.append(classID)

    # apply non-maxima suppression to suppress weak, overlapping bounding boxes
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, confthres,
                            nmsthres)


    # TODO Prepare the output as required to the assignment specification
    # ensure at least one detection exists
    objects = []
    if len(idxs) > 0:
        # loop over the indexes we are keeping
        for i in idxs.flatten():
            # Create an object describing the object -> label, confidence and bounding box
            objects.append({
                "label": LABELS[classIDs[i]]
            })

    return objects


## Yolov3-tiny versrion
labelsPath = "coco.names"
cfgpath = "yolov3-tiny.cfg"
wpath = "yolov3-tiny.weights"

Lables = get_labels(labelsPath)
CFG = get_config(cfgpath)
Weights = get_weights(wpath)


def do_object(image_rec):
    try:
        # with open(image_rec, 'rb') as image_file:
        #     orig_image =  base64.b64encode(image_file.read()).decode('utf-8')
        # data = json.loads(orig_image)
        # json_data = json.loads(data)
        # decoded_image = base64.b64decode(json_data['image'])

        nparr = np.fromstring(image_rec, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        npimg = np.array(img)
        image = npimg.copy()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        nets = load_model(CFG, Weights)

        objects = []
        objects = do_prediction(image, nets, Lables)
        objects_outputs = {}
        objects_outputs['objects'] = objects
        return objects_outputs
    
    except Exception as e:
        print("Exception  {}".format(e))

def lambda_handler(event, context):

    image_key = upload_image(event["imageData"]["image"])

    fileObj = s3.get_object(Bucket=image_bucket, Key=image_key)
    file_content = fileObj["Body"].read()

    image_url = s3.generate_presigned_url(
        "get_object", Params={"Bucket": image_bucket, "Key": image_key}, ExpiresIn=31536000
    )
    image_tags = do_object(file_content)

    dynamodb.put_item(
        Item={
            'URL': str(image_url),
            'Key': image_key,
            'Tags': image_tags
            })
    
    return {
        'URL': str(image_url),
        'Key': image_key,
        'Tags': image_tags
    }