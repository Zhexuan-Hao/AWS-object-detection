import { Input, Button, Space, Radio } from 'antd';
import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'

const { TextArea } = Input;


const Modify = () => {
  let location = useLocation();
  let dataFromOthers = location.state
  const [imageKey, setImageKey] = useState('')
  const [imageOriginTags, setImageOriginTags] = useState('')
  const [imageNewTags, setImageNewTags] = useState('')
  const [imageURL, setImageURL] = useState('')
  // 0 == remove,  1 == add
  const [modifyMethod, setModifyMethod] = useState(0)
  

  useEffect(()=>{
    if(location.state) {
      setImageKey(dataFromOthers.filename)
      setImageOriginTags(JSON.stringify(dataFromOthers.modifyTags))
      setImageURL(dataFromOthers.modifyUrl)
      console.log('从search页面初始化：',(dataFromOthers.filename))
      console.log((dataFromOthers.modifyTags))
      console.log((dataFromOthers.modifyUrl))
    }
  }, [location])

  const dealKeyBox = (e) => {
    setImageKey(e.target.value)
  }
  const dealOriginTagBox = (e) => {
    setImageOriginTags(e.target.value)
  }
  const dealModifyTagBox = (e) => {
    setImageNewTags(e.target.value)
  }
  const dealRadio = (e) => {
    console.log('radio checked', e.target.value);
    setModifyMethod(e.target.value);
  }

  const searchHandler = () => {
    if (imageKey !== '') {
      console.log('根据imagekey查询', imageKey)
      const getTagUrl='/files'
      axios({
        method: 'GET',
        url: getTagUrl+imageKey,
      }).then(
        response => {
          try {
            console.log('image url: ', response.data[0].url)
            setImageURL(response.data[0].url)
            console.log('image original tags: ', JSON.stringify(response.data[0].tags))
            setImageOriginTags(JSON.stringify(response.data[0].tags))
          } catch (e) {
            setImageOriginTags("Can't find image in AWS!")
          }
        },
        error =>{
          console.log('searchHandler falied')
        }
      )
    }   
  }

  const modifyHandler = () => {
    if (imageURL !== '') {
      console.log('修改方式：', modifyMethod)
      console.log('修改图片链接：', imageURL)
      console.log('提交的tag:', imageNewTags)
      const modifyTagUrl='/tags'
      try {
        var tagsUpdate = JSON.parse(imageNewTags)
      } catch (error) {
        var tagsUpdate = JSON.parse([])
        setImageNewTags('JSON format error.')
        return
      }
      axios({
        headers: {
          'Content-Type':'application/json'
        },
        url:modifyTagUrl,
        method: 'post',
        data: {
          "url":imageURL,
          "type":modifyMethod,
          "tags":tagsUpdate,
        },
      }).then(
        response => {
          console.log('modified!', response.data)
          setImageNewTags('modify request has been seed.')
        },
        error =>{
          console.log('modifyHandler falied')
        }
      )
    } 

  }
  

  return (
  <>
    <Space
      direction='vertical'
      style={{
        height: '100%'
      }}
    >
      <Space>
        Enter Image key: 
        <Button type="primary" onClick={searchHandler}>Search</Button>
      </Space>

      <Input 
        placeholder="Image key"
        value={imageKey}
        onChange={dealKeyBox}
      />

      <Space size='large'>
        Original tags: 
      </Space>
    
      <TextArea 
        placeholder="Enter image key to search" 
        value={imageOriginTags}
        onChange={dealOriginTagBox}
      />

      <Space size='large'>
        Modify tags: 
        <Button type="primary" onClick={modifyHandler}>Modify</Button>
        <Radio.Group onChange={dealRadio} value={modifyMethod}>
          <Radio value={0}>Remove</Radio>
          <Radio value={1}>Add</Radio>
        </Radio.Group>
      </Space>

      <TextArea 
        placeholder='pleace enter with json format, like: [ {"tag" : "car", "count" : 3} ]'
        value={imageNewTags}
        onChange={dealModifyTagBox}
      />

    </Space>
    
  </>
  )
}
export default Modify