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
  const [searchBox, setSearchBox] = useState('')
  var params = {}

  const dealSearchBoxChange = (e) => {
    setSearchBox(e.target.value)
  }

  const onSearch = () => {
    var getTagUrl='/tags'
    console.log('尝试搜索：',searchBox)
    if (searchBox !== '') {
      try {
        // 处理输入框参数
        var objstring = searchBox;
        var objlist=objstring.split(',')

        // 除去分割后的字符串首尾空格
        let reg0 = /^\s*|\s*$/g
        let reg1 = /[^\d.]/
        let reg2 = /(.*?)-/g
        for (var i=0; i<objlist.length; i++) {
          objlist[i] = objlist[i].replace(reg0,"")
          if (objlist[i].includes('-')) {
            var newobjname = objlist[i].match(reg2)[0]
            newobjname = newobjname.substring(0, newobjname.length-1)
            var newobjnum = objlist[i].replace(/[^\d.]/g, "")
            var objkey = 'tag' + (i+1).toString()
            var objnumkey = 'tag' + (i+1).toString() + 'count'
            params[objkey] = newobjname
            params[objnumkey] = newobjnum
          } else {
            var newkey = 'tag' + (i+1).toString()
            params[newkey] = objlist[i]
          }
        }
        // 修改后的params
        console.log(params)
      } catch (error) {
        setSearchBox('search failed, please check format.')
      }
    }

    // 发起网络请求
    try {
      axios({
        method: 'GET',
        url: getTagUrl,
        params: params
      }).then(
        response => {
          console.log('success', response.data)
          setTaglist(response.data)
        },
        error =>{
          console.log('falied')
        }
      )
    } catch (error) {
      setSearchBox('search failed, please check network.')
    }   
  }

  // table组件
  const MyTable = (props) => {
    const navigate = useNavigate();
    const { datalist } = props;
    const [mylist, setList] = useState(datalist)
  
    const ImageDeleteClickHandler = (filename, url) => {
      const deleteUrl = '/delete'
      console.log('删除的filename', filename)
      console.log('删除的url', url)
      // 先在aws里删除
      try {
        axios({
          method: 'DELETE',
          url: deleteUrl,
          data: {
            "URL": url
          }
        }).then(
          response => {
            console.log('delete success in aws', response.data)
          },
          error =>{
            console.log('delete falied with network')
          }
        )
      } catch (error) {
        console.log('删除失败')
      }
  
      // 后在datalist删除
      setList(item => item.filter(
        image => {
          return image.url !== url
        }
      ))
      
    }
    const ImageViewClickHandler = (imageurl) => {
      // 跳转网页
      const w=window.open('about:blank');
      w.location.href=imageurl
    }

    const ImageModifyClickHandler = (filename, modifyTags, url) => {
      // 跳转到修改页面并自动填入filename, filelist
      console.log('跳转：',filename, modifyTags, url)
      navigate('/modify', {state:{filename:filename, modifyTags:modifyTags, modifyUrl: url}, replace:true})
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
                  <a onClick={()=>ImageModifyClickHandler(record.filename, record.tags, record.url)}>Modify</a>
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
        <Search 
          placeholder="person, bus   |   person-2, bus-1" 
          onSearch={onSearch} 
          enterButton
          onChange={dealSearchBoxChange}
          value={searchBox}
        />
        <MyTable datalist = {taglist} />        
      
      </Space>
      
    </>
    
  )
}
export default MySearch