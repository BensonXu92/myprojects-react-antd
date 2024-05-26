
import React, { useState, useEffect } from 'react';
import { $getuser, $getroleName, $adduser ,$deluser,
  $edituser
} from '../../api/adminApi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form,Table, Drawer, 
  Input,  Select, Space,message,Popconfirm,
  Avatar
} from 'antd';
import HUpload from '../../components/HUpload/HUpload';
import { publicURL } from '../../config';





  

export default function HUser() {
  // HOOK 副作用函数
  useEffect(()=>{
    refreshData()
    if(roleNameList.length===0){
      // 获取一次roleName值
      getroleName()
    }
  },[])

  // 实例
  const [form] = Form.useForm()
  const [ messageApi, contextHolder ] = message.useMessage()

  // 状态数据
  let [isAdd, setIsAdd] = useState(true)
  let [userData, setUserData ]= useState([]) 
  let [roleNameList, setRoleNameList ]= useState([]) 
  let [selectRole, setSelectRole ]= useState()   // 选择的角色
  const [open, setOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('添加');  
  // 表格格式
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width:60,
    },{
      title: '账号',
      dataIndex: 'loginId',
      key: 'loginId',
      width:120,
    },{
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width:100,
    },{
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width:150,
    },{
      title: '头像',
      dataIndex: 'photo',
      key: 'photo',
      width:100,
      render:(item)=>(
        <Avatar src={publicURL +'/' + item} size="large"></Avatar>       
      )
    },{
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width:120,
    },{
      title:'操作',
      key:'action',
      render:(item)=>(
        <Space>
          <Button 
            size='small'  
            onClick={()=>{onEdit(item)}} 
            style={{
              color:'orange',
              borderColor:'orange'
            }} 
          >
            编辑
          </Button>  
          <Popconfirm
            title="注意"
            description="确认删除这个账号?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => { onDel(item) }}          
          >
            {item.id === 1 ? (
              <Button size='small' disabled>删除</Button>
            ) : (
              <Button size='small' danger>删除</Button>
            )}      
          </Popconfirm>
        </Space>
      )
    }
  ]
  const labelRender = (props) => {
    console.log(props)
    const { label, value } = props;
    if (label) {
      return value;
    }
    return <span>请选择角色</span>;
  };

  // 事件
  // 抽屉完成事件  添加 或 编辑
  const onFinish = async (values) =>{
    onClose()
    if(drawerTitle === '添加'){
      // 把信息 插入 数据表
      await $adduser(values)
    }else if(drawerTitle === '编辑'){
      // 编辑
      console.log(values)
      await $edituser(values)
    }else{
      console.log('不是添加或删除', values)
    }
    messageApi.open({
      type : 'success',
      content: '账号'+drawerTitle +'成功',
    }) 
    refreshData()
  }
  // 打开抽屉
  const showDrawer = () => {
    setOpen(true);
  };
  // 关闭抽屉 清除内容
  const onClose = () => {
    form.resetFields()
    setOpen(false);
  };
  // 添加
  const onAdd= ()=>{
    setDrawerTitle('添加')
    form.resetFields()
    showDrawer()
  }
  // 编辑 
  const onEdit=(ret)=>{
    form.setFieldsValue({     
      loginId:ret.loginId,
      loginPwd:ret.loginPwd,
      userName:ret.userName,
      phone:ret.phone,
      photo:ret.photo,
      roleName:ret.roleName,
    }) 
    setDrawerTitle('编辑')
    showDrawer()
  }
  // 删除 然更新
  const onDel= async (e)=>{
    await $deluser(e)
    refreshData()
  }
  // 更新数据
  const refreshData = async ()=>{  
    let data = []
    if(selectRole){
      // 带角色去查询数据。  
      data = await $getuser({roleName:selectRole})
    }else{
      data = await $getuser()
    };
    if(data.length>=1){
      data = data.map(r=>{
        return {
          ...r,
          key:r.id
        }
      })      
    }else{
      data=[]
    }      
    setUserData(data)    
    if(data.length>=50){
      setIsAdd(false)
    }else{
      setIsAdd(true)
    }   
  }
  // 获取一次roleName值  并设为option格式
  const getroleName = async ()=>{ 
    let res = await $getroleName()        
    res = res.map(r=>{
      return {
        value:r.roleName,
        label:r.roleName,
      }
    })
    res.unshift({value:'请选择角色',label:'请选择角色'})
    setRoleNameList(res)
  } 
  // 角色类型选择事件
  const handleChange = (e) =>{
    setSelectRole(e)    
  }
  // 查询 角色
  const onSelectRole = ()=>{
    refreshData()
  }

  


  return (
    <div>
      {/* 顶部区 */}
      <Space>
        <span>角色类型： </span>
        <Select
          style={{
            width:120,
          }}
          labelRender={labelRender}
          options={roleNameList}
          onChange={handleChange}
          // defaultValue='请选择角色'
        >
        </Select>
        {/* 添加按钮 */}
        <Button  onClick={onSelectRole} type='primary' >
          角色查询
        </Button>
        {/* 添加按钮 */}
        <Button  onClick={onAdd} disabled={!isAdd}  icon={<PlusOutlined />}>
          添加账号
        </Button>

      </Space>
      
      {/* 表格 */}
      <Table columns={columns} dataSource={userData} />

      {/* 抽屉  */}
      <Drawer
        title={drawerTitle + "账号"}
        width={360}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form 
          form = {form}       
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          style={{
            maxWidth: 360,
          }}          
          onFinish={onFinish}
          autoComplete="off"    
          requiredMark
        >
          <Form.Item
            name="loginId"
            label="账号"
            rules={[
              {
                required: true,
                message: '请输入 账号',
              },
            ]}
          >
            {
              drawerTitle === '编辑' ?(
                <Input placeholder="请输入 账号"  disabled/>
              ):(
                <Input placeholder="请输入 账号"  />
              )
            }
            
          </Form.Item>
          <Form.Item
            name="loginPwd"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入 密码',
              },
            ]}
          >
            <Input                  
              placeholder="请输入 密码"
              type='password'
              disabled={drawerTitle === '编辑'}
            />
          </Form.Item>
          <Form.Item
            name="userName"
            label="名字"
            rules={[
              {
                required: true,
                message: '请输入 名字',
              },
            ]}
          >
            <Input placeholder="请输入 名字" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[
              {
                required: true,
                message: '请输入 电话',
              },
            ]}
          >
            <Input                  
              placeholder="请输入 电话"
            />
          </Form.Item>
          <Form.Item
            name="photo"
            label="头像"
            rules={[
              {
                required: true,
                message: '请输入 头像',
              },
            ]}
          >
            <HUpload form = {form}></HUpload>
          </Form.Item>
          <Form.Item
            name="roleName"
            label="角色"
            rules={[
              {
                required: true,
                message: '请选择 角色',
              },
            ]}
          >            
            <Select
              labelRender={labelRender}
              options={roleNameList}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>

        </Form>
      </Drawer>

      {/* 信息提示 */}
      {contextHolder}
    </div>
  )
};
