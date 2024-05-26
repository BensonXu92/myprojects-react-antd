import React from 'react';
import { Breadcrumb, Layout, Typography, theme ,
  Card,  Flex
} from 'antd';
import { useNavigate } from 'react-router-dom';

// 导入图片420*275   CardHAdmin  CardTbd
import CardHAdmin  from '../../assets/img/CardHAdmin.png'
import CardTbd  from '../../assets/img/CardTbd.png'

// 组件实例
const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Meta } = Card;




export default function Home() {
  // 导航实例
  const navigate = useNavigate();
  
  // 配置
  const {
      token: { colorBgContainer, borderRadiusLG ,colorBorderSecondary},
  } = theme.useToken();




  return(
      
  <Layout>
    <div 
      style={{
        height:'100vh',
        minWidth:350,
        backgroundColor:colorBorderSecondary,
      }}    
    > 

        {/* 头部 */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background:'#094ec3',       
        }}
      >
        <div 
          className="demo-logo" 
          style={{
            flex:1,
            height:50,
            borderRadius:4,
            backgroundColor:'#f6f6f6',
            textAlign: 'center',
          }}
        >
          <Title>我的项目集</Title>
        </div>
      </Header>

      {/* 内容框 */}
      <Content
        style={{
          padding: '0 48px',
          background:colorBorderSecondary,
        }}
      >
        {/* 技术栈 */}
        <div>
        <Breadcrumb
          items={[
            {
              title: '技术栈',
            },            
          ]}
          style={{
            margin: '16px 0',
          }}
        />
          <div
            style={{
              background: colorBgContainer,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Flex wrap gap="large">
                <Card title="前端" bordered={false}>
                  React + Ant Design + scss + axios
                </Card>
                <Card title="后端" bordered={false}>
                  Linux + openresty + MySQL
                </Card>
            </Flex>
            
          </div>
        </div>
        

        {/* 项目集 */}
        <div>
        <Breadcrumb
          items={[
            {
              title: '项目卡片',
            },            
          ]}
          style={{
            margin: '16px 0',
          }}
        />        
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Flex 
              wrap 
              gap="large"
            >
                 {/* 酒店后台管理系统 */}
                <Card
                  onClick={()=>{                  
                    // navigate('/hadmin')
                    navigate('/hadmin/room')
                  }}
                  hoverable
                  style={{
                    // width: 240,
                    minWidth:180,
                    maxWidth:320,
                  }}
                  cover={<img 
                    alt="酒店后台管理系统" 
                    src={CardHAdmin} 
                  />}
                >
                  <Meta 
                    title="酒店后台管理系统" 
                    description="一个酒店后台管理系统，有参考B站视频项目。" 
                  />
                </Card>

                {/* 同步带周长计算 */}
                <Card
                  hoverable
                  onClick={()=>{                  
                    navigate('/tbd')
                  }}
                  style={{
                    // width: 240,
                    minWidth:180,
                    maxWidth:320,
                  }}
                  cover={<img 
                    alt="同步带" 
                    src={CardTbd} 
                  />}                  
                >
                  <Meta 
                    title="同步带周长计算" 
                    description="同步带周长计算" 
                  />
                </Card>

            </Flex>                     
          </div>
        </div>
        
      </Content>

      {/* 底部 */}
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor:colorBorderSecondary,
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED

      </Footer>
    </div>
    </Layout>
    
    )
}