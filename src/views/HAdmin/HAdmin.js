import React, { useState, useEffect } from 'react';
import { useNavigate,Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,  MenuUnfoldOutlined,  
  ProductOutlined,TeamOutlined,PhoneOutlined ,
  SettingOutlined,  UserOutlined,LogoutOutlined,CoffeeOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme ,
  Space,Modal 
} from 'antd';
import Hgohome from '../../components/Hgohome/Hgohome';

// 框架 实例
const { Header, Sider, Content } = Layout;



export default function HAdmin() {

  // 1 状态  和  配置
  // antd token配置
  const {
    token: { colorBorderSecondary,colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // 总体布局样式  
  const layoutStyle = {
    overflow: 'hidden',
    width: 'calc(100% )',
  };
  // 侧栏样式
  const siderStyle = {
    textAlign: 'left',
    lineHeight: '120px',
  };
  // 标题 盒子 样式
  const titleStyle = {
    padding:10,
    height:64,
  };// 标题 logo 样式
  const logoStyle = {
    height:40,
    lineHeight:'40px',
    textAlign:'center',
    overflow:'hidden', 
    backgroundColor:colorBorderSecondary,
    borderRadius:4,
  };
  // 头部导航样式
  const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };
  // 内容板块样式
  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
  };
  
  // 数据
  // 侧栏菜单数据
  const itemsSider=[
    {
      icon: <CoffeeOutlined />,
      key:'room',
      label:'房间管理'
    },{
      icon: <ProductOutlined />,
      key:'type',
      label:'房型管理'
    },{
      key: 'client',
      icon: <PhoneOutlined />,
      label: '客户管理',      
    },{
      key: 'admin',
      icon: <TeamOutlined />,
      label: '酒店人员管理',
    },    
  ]
  // 顶部导航菜单数据
  const itemsNav = [
    {
      label: '个人信息',
      key: 'mine',
      icon: <UserOutlined />,
    },
    {
      label: '修改密码',
      key: 'updatepwd',
      icon: <SettingOutlined />,
    },
    {
      label: '退出系统',
      key: 'exit',
      icon: <LogoutOutlined />,
    },    
  ];

  // 侧栏折叠状态
  const [collapsed, setCollapsed] = useState(false);
  // 顶部导航状态配置
  const [current, setCurrent] = useState('room');
  
  // 2 实例
  const navigate = useNavigate()


  // 3 Hook
  useEffect(()=>{
    if (!localStorage.getItem('token')){
      goLogin()
    }
  },[])

  // 4 事件
  // 回到登录界面
  const goLogin=()=>{
    navigate('/hlogin')
  }
  // 顶部/侧栏 菜单点击事件
  const  onClickNav = (e) => {
    setCurrent(e.key)
    switch(e.key){
      case 'room':
        navigate('/hadmin/room')
        break
      case 'role':
        navigate('/hadmin/role')
        break
      case 'user':
        navigate('/hadmin/user')
        break
      
      // 点击退出，清楚token，回到登录页
      case 'exit':
        onConfirm()
        break
    }
  }
  // 确认modal  需要  目前只有退出功能
  const onConfirm = (title='确认退出' ,content='是否退出系统？') => {
    Modal.confirm({
      title,
      content,
      cancelText:'取消',
      okText:'确定',
      onOk:handleOk ,
      onCancel:handleCancel,
      footer: (_, { OkBtn, CancelBtn }) => (
        <>        
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  }
  // 确认退出
  const handleOk = () => {
    localStorage.setItem('token', '')
    goLogin()
  };
  // 取消退出
  const handleCancel = () => {
    console.log('点击取消');
  };





  return (
  <div style={{height:'100vh'}}>
    <Layout style={layoutStyle} >
      
      {/* 左侧栏 */}
      <Sider 
        className='sider' 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={siderStyle}
      >
        <div style={{height:'100vh '}}>
          <div 
            className="demo-logo-vertical" 
            style={titleStyle}
          >
            <div
              style={logoStyle}
            >
              HMR 酒店管理系统
            </div>            
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={itemsSider}
            onClick={onClickNav}
            selectedKeys={[current]} 
          />
        </div>

      </Sider>




      {/* 右侧部分 */}
      <Layout  >
        {/* 导航栏 */}
        <Header
          style={{
            padding: 0,
            color:'#eee'
          }}
          className='header'
        >
           <Space>
          {/* 侧边折叠的按钮 */}
          <Button
            theme="dark"
            className='colbtn'
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: '64px',
              height: '64px',
              color:'white',
            }}
          />

          {/* 顶部导航菜单 */}
          <Menu 
            theme ='dark' 
            mode="horizontal"
            items={itemsNav} 
            onClick={onClickNav} 
            selectedKeys={[current]}    
          />
          </Space>
          
      
        </Header>

        {/* 内容 */}
        <Content
          style={{
            margin: '0',
            padding: 5,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>

    </Layout>

    <Hgohome></Hgohome>
  </div>
  );
}