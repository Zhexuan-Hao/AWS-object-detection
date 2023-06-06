import { AudioOutlined } from '@ant-design/icons';
import { Input, Space, Table, Tag } from 'antd';
import React, {useState, useEffect} from 'react';

import { useNavigate } from "react-router-dom";
import axios from 'axios'

const { Search } = Input;
const { Column, ColumnGroup } = Table;



const testdata = [
  {
    key: '3',
    filename: 'Joe',
    tags: [{obj:"cool", num:1},{obj:'teacher', num:2}],
  },
];




const MySearch = () => {
  const [taglist, setTaglist] = useState([])

  const onSearch = (value) => {
    const getTagUrl='http://localhost:3000/tags'
    axios({
      method: 'GET',
      url: getTagUrl,
    }).then(
      response => {
        console.log('success', response.data)
        setTaglist(response.data)
      },
      error =>{
        console.log('falied')
      }
    )
  }


  const MyTable = (props) => {
    const navigate = useNavigate();
    const { datalist } = props;
    const [mylist, setList] = useState(datalist)
  
    const ImageDeleteClickHandler = (filename, url) => {
      // 先在aws里删除
  
      // 后在datalist删除
      setList(item => item.filter(
        image => {
          return image.filename !== filename
        }
      ))
      
    }
    const ImageViewClickHandler = (imageurl) => {
      // 跳转网页
      console.log(imageurl)
      const w=window.open('about:blank');
      w.location.href=imageurl
    }
    function jump2modify () {

    }
    const ImageModifyClickHandler = (filename, modifyTags) => {
      // 跳转到修改页面并自动填入filename, filelist
      console.log(filename, modifyTags)
      navigate('/modify', {state:{filename:filename, modifyTags:modifyTags, flag: true}, replace:true})
    }
  
    return (
      <Table dataSource={mylist}>
            <Column title="File name" dataIndex="filename" key="filename"/>
            <Column
              title="Tags"
              dataIndex="tags"
              key="tags"
              render={(tags) => (
                <>
                  {tags.map((tag) => (
                    <Tag color="blue" key={tag.obj}>
                    {tag.tag} : {tag.count}
                  </Tag>
                  ))}
                </>
              )}
            />
            <Column
              title="Action"
              key="action"
              dataIndex="filename"
              render={(text, record) => (
                <Space size="middle">
                  <a onClick={()=>ImageViewClickHandler(record.url)}>View</a>
                  <a onClick={()=>ImageModifyClickHandler(record.filename, record.tags)}>Modify</a>
                  <a onClick={()=>ImageDeleteClickHandler(record.filename, record.url)}>Delete</a>
                </Space>
              )}
            />
          </Table>
    )
  
  } 





  return (
    <>
      <Space
        direction='vertical'
        style={{
          height: '100%',
        }}
      >
        <Search placeholder="input search text" onSearch={onSearch} enterButton />
        <MyTable datalist = {taglist} />        
      
      </Space>
      
    </>
    
  )
}
export default MySearch