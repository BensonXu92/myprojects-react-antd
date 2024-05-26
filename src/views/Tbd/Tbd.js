import React , { useState } from 'react';
import { Button, Flex, Form, Input, Space } from 'antd';
import Hgohome from '../../components/Hgohome/Hgohome';


export default function Tbd() {
  const [form] = Form.useForm();
  const [Lpdate, setLpdate] = useState(0);
  
  

  // 配置函数   和事件  
  function calTbd(c, D , d) {
    return 2 * c + Math.PI * (D + d) / 2 + Math.pow((D + d), 2) / 4 / c;
  }
  function getdot2(num) {
    return Math.round(num * 100 )/100
  }
  const onFinish = (values) => {
    setLpdate(getdot2(calTbd(values.C, values.D , values.d)))
    console.log(Lpdate)
  };
  const onReset = () => {
    form.resetFields();
  };


  // 渲染框架
  return(    
       <Flex 
        justify='center' 
        align='center'
        style={{
          width:'100vw',
          height: '100vh',
          background: '#8fdaf8',        
        }}
       >  
       {/* 完成居中flex */}
      <div 
          style={{        
            minWidth:350,
            background: '#fff',
            border: '1px solid #40a9ff',
            borderRadius: 6,
            padding:10,          
          }}
        >
          <h3 
          style={{
            textAlign:'center',
            padding:10,
            lineHeight:'40px',
          }}>
            同步带周长自动计算工具
          </h3>
          <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            className='form'
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{
              minWidth:350,
            }}
          >
            {/* 输入信息 */}
            <Form.Item
              name="C"
              label="暂定轴间距 C'："
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入值" addonAfter="[mm]" />
            </Form.Item>
            <Form.Item
              name="D"
              label="大带轮节圆直径 Dp："
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入值" addonAfter="[mm]" />
            </Form.Item>

            <Form.Item
              name="d"
              label="小带轮节圆直径 dp："
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入值" addonAfter="[mm]"  />

            </Form.Item>
            
            
              {/* 按钮 */}
            <Form.Item 
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            >
              <Space >
              <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  计算结果
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div >
            <Space 
              style={{
                paddingBottom: 20,
              }}
            >
              <span>大致同步带周长 Lp' ：</span>
              <span>{Lpdate} (mm)</span>
            </Space>            
        
            <div           
              style={{
                maxWidth:360,
                height:40,
                background:'#fbf9d2',
                padding:10,
                marginBottom:10,
                fontSize:10,
                color:'#039',
                border:'1px dotted #003399',
              }}
            >
              免责申明: 本网页免费提供，不包含任何使用保证，
              作者亦不对您或别的用户使用此网页所带来的理论上
              或实际的损失负责。
            </div>
          </div>
        </div>
        
        <Hgohome></Hgohome>
      </Flex>      
  
  )
}