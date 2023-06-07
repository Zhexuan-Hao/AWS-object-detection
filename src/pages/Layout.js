import { Layout, Menu, Popconfirm, Button } from 'antd'
import React from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'

const { Header, Sider } = Layout

const MyLayout = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // 获取用户信息，登录信息
  const user = {
    name: 'testname',
  }
  


  return (
    <Layout >
      <Header className="header" >
        <Button type="primary" size='middle' onClick={()=>{window.location.href="https://fit5225assignment2.auth.us-east-1.amazoncognito.com/login?client_id=7o9kdhn6j4g1mq1r6eq0tj6bd7&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000"}}>
            Exit
        </Button>
        {/* <div className="logo" />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-logout">
            <Popconfirm title="Are you sure to exit?" okText="Confirm" cancelText="Cancel">
              <LogoutOutlined /> Exit
            </Popconfirm>
          </span>
        </div> */}
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[currentPath]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to='/'>Search</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/modify">
              <Link to='/modify'>Modify</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/update">
              <Link to='/update'>Upload</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="layout-content" style={{ padding: 20 }}><Outlet /></Layout>
      </Layout>
    </Layout>
  )
}
  export default MyLayout