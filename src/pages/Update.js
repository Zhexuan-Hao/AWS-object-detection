import { Col, Row, Space, Modal, Upload, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

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
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ]);

  // 保存并上传的回调函数
  const UDhandler = (e, filelist) => {
    console.log(filelist.map(item=>(
      item.thumbUrl
    )))
    // 将数据传到aws
  }
  // 仅检测的回调函数
  const Dhandler = (e, filelist) => {
    console.log(filelist.map(item=>(
      item.thumbUrl
    )))
  }
  
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Add
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
              display: 'flex',
            }}
          >
            Choose images
            <Upload
              action="../imgs/"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img
                alt="example"
                style={{
                  width: '100%',
                }}
                src={previewImage}
              />
            </Modal>
          </Space>
          
        </Col>

        <Col span={12}>
          <Space 
            direction="vertical"
            style={{
              display: 'flex',
            }}
          >
            <Space>
              Image tags
              <Button 
                type="primary"
                onClick={(e) => UDhandler(e, fileList)}
              >
                Detect & Upload
              </Button>

              <Button 
                type="primary"
                onClick={(e)=> Dhandler(e, fileList)}
              >
                Only Detect
              </Button>
            </Space>

           
            <TextArea rows={6} placeholder="Click button to detect objects in your image" />
            
          
            
          </Space>
          
        </Col>
      </Row>
      </>
    )
  }
export default Update