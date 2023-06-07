import { Col, Row, Space, Modal, Upload, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import axios from "axios";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Update = () => {
  // 关于是否展开缩略图的代码
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const [tagsBoxValue, setTagsBoxValue] = useState([]);
  const [fileList, setFileList] = useState([]);

  // 假上传
  const customUpload = (e) => {};

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
  };

  // 真上传
  const clickHandler = () => {
    const uploadUrl = "/upload";
    console.log("待上传的文件列表：", fileList);
    var filenum = fileList.length
    for (var i = 0; i < fileList.length; i++) {
      // base64编码，并上传
      var imgFile = new FileReader();
      var imgname = fileList[i].name;
      console.log("处理图片：", imgname);
      imgFile.readAsDataURL(fileList[i].originFileObj);
      imgFile.onload = function () {
        var imgData = this.result.replace("data:image/jpeg;base64,", "");
        axios({
          url: uploadUrl,
          method: "POST",
          data: {
            imageData: {
              image: imgData,
            },
          },
        }).then(
          (response) => {
            console.log("uploaded!", imgname);
          },
          (error) => {
            console.log("upload falied");
          }
        );
      };

      // 删除filelist中已上传的图片，并在照片墙上显示
      setFileList((item) =>
        item.filter((image) => {
          return image.name !== imgname;
        })
      );
    }
    setTagsBoxValue('updated '+filenum.toString()+' image' )
  };

  const detectHandler = () => {
    const detectURL = '/detect'
    var filenum = fileList.length
    if (filenum > 1) {
      setTagsBoxValue('please choose one file.')
      return
    }
    if (filenum === 1) {
      var imgFile = new FileReader();
      var imgname = fileList[0].name;
      console.log("处理图片：", imgname);
      imgFile.readAsDataURL(fileList[0].originFileObj);
      imgFile.onload = function () {
        var imgData = this.result.replace("data:image/jpeg;base64,", "");
        axios({
          url: detectURL,
          method: "POST",
          data: {
            "imageData": {
              "image": imgData,
            },
          },
        }).then(
          (response) => {
            console.log("detected!", imgname);
            console.log(response.data)
            setTagsBoxValue(JSON.stringify(response.data, null, 4))
          },
          (error) => {
            console.log("detect falied");
          }
        );
      };
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      <Row>
        <Col span={12}>
          <Space
            direction="vertical"
            style={{
              display: "flex",
            }}
          >
            <Space direction="horizontal">
              Choose images
              <Button type="primary" onClick={clickHandler}>
                Upload
              </Button>

              <Button type="primary" onClick={detectHandler}>
                Detect
              </Button>
            </Space>

            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={customUpload}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 10 ? null : uploadButton}
            </Upload>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </Space>
        </Col>
        
      </Row>
      
      Links to images in S3 that are similar to the uploaded images:
      <TextArea
              placeholder="Only support one picture for one click"
              value={tagsBoxValue}
      />
    </>
  );
};
export default Update;
