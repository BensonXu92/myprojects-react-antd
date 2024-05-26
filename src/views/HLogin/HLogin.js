import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Form, Input,
  message
} from 'antd';
import { $login } from '../../api/adminApi';
import Hgohome from '../../components/Hgohome/Hgohome';



export default function HLogin() {

  useEffect(()=>{
    if (localStorage.getItem('token')){
      navigate('/hadmin/room')
    } // 有token自动登录
  },[])

  // 创建 Form 实例，用于管理所有数据状态。在form组件绑定
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage() 
  
  // 成功提交表单 事件
  const onFinish = async (values) => {
    let res = await $login(values)
    if (res.msg === "登录成功") {
      // 将token保存到 localStorage 中
      localStorage.setItem('token', JSON.stringify(res.token)); 
      messageApi.open({
        type: 'success',
        content:res.msg,
      });
      setTimeout(()=>{
        navigate('/hadmin/room')
      },1200)               
    }
    else if(res.msg === "密码错误" | res.msg === "账号不存在"){
      messageApi.open({
        type: 'error',
        content:res.msg,
      });
    }else{
      messageApi.open({
        type: 'warning',
        content:'未知错误',
      });
    }
  };


  return (
    <Flex 
      justify='center' 
      align='center'
      style={{
        width:'100vw',
        height: '100vh',
        background: '#8fdaf8',        
      }}
    >     
      <div 
        style={{        
          minWidth:350,
          background: '#fff',
          border: '1px solid #40a9ff',
          borderRadius: 6,
          padding:10,          
        }}
      >
        <Flex 
          justify='center' 
          align='center'
          vertical
        >
          
        <h2
          style={{
            textAlign:'center',
            padding:10,
            lineHeight:'40px',
          }}
        >
          HMR酒店管理系统
        </h2>
        {/* 登录表单 */}
        <Form
          form = {form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          // initialValues={{
          //   loginId:'',
          //   loginPwd:''
          // }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: '请输入账号！',
              },
            ]}
          >
            <Input 
              placeholder='请输入账号'
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="loginPwd"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input.Password 
               placeholder='请输入密码'
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <Button 
              onClick={()=>{form.resetFields()}} 
              style={{marginLeft:'10px'}}
            >
              取消
            </Button>
          </Form.Item>
          <div           
            style={{         
              maxWidth:300,
              background:'#fbf9d2',
              padding:10,
              marginBottom:10,
              fontSize:18,
              color:'#039',
              border:'1px dotted #003399',
            }}
          >
            
            账号：fresh 密码：12345 <br />
      
            目前实现<br />
            房间卡显示（入住、空闲、退房）<br />
            空闲房间：入住。<br />
            入住房间：信息修改，退房。<br />
            退房后：信息修改，归档。
          </div>
        </Form>
        </Flex>
      </div>
         
      <Hgohome></Hgohome> 
      {contextHolder}
    </Flex>     
  )
}