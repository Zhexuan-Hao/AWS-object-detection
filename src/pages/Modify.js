import { Input, Button, Space } from 'antd';
import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server'

const { TextArea } = Input;



const Modify = () => {
  let location = useLocation();
  let dataFromOthers = location.state
  const [imageKey, setImageKey] = useState('')
  const [imageOriginTags, setImageOriginTags] = useState([])
  const [imageNewTags, setImageNewTags] = useState([])

  const dealKeyBox = () => {
    if (dataFromOthers) {
      setImageKey(dataFromOthers.filename)
      return dataFromOthers.filename
    }
    return ""
  }
  const dealTagBox = () => {
    if (dataFromOthers) {
      setImageOriginTags(dataFromOthers.modifyTags)
      console.log('原始tag：', dataFromOthers.modifyTags)
      return JSON.stringify(dataFromOthers.modifyTags)
    }
    return ""
  }
  const searchHandler = () => {
    
  }

  const modifyHandler = () => {

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
      <Button type="primary" >Search</Button>
      </Space>

      <Input 
        placeholder="Image key"
        value={dealKeyBox()}
      />

      <Space size='large'>
      Image tags: 
      <Button type="primary">Modify</Button>
      </Space>
    
      <TextArea 
        placeholder="pleace enter with json format" 
        value={dealTagBox()}
      />

    </Space>
    
  </>
  )
}
export default Modify