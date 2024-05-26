
import React, { useState, useEffect } from 'react';
// AntDesign
import {Drawer, Card, Flex, DatePicker,Space,
  Form,Input,Button,Popconfirm,ConfigProvider,Descriptions
 } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

// api
import { $getrooms, $gettypes, $updateroom } from '../../api/roomApi';
import { $getclients,$updateclient,$addclient,$outroomclient,$beforepay} from '../../api/clientApi';

dayjs.extend(customParseFormat);
dayjs.locale('zh-cn');


export default function HRoom() {
  const [fetchedOnce, setFetchedOnce] = useState(false);  // 初始化执行一次数据获取操作
  const [types, setTypes ]= useState([])  // 房间类型列表
  const [cardList, setCardList ]= useState([])  // 房间卡片列表
  const [inClientList, setInClientList ]= useState([])  // 入住客户列表
  const [outClientList, setOutClientList ]= useState([])  // 退房客户列表
  const [oldClientList, setOldClientList ]= useState([])  // 归档客户列表
  const [open, setOpen] = useState(false);  // 抽屉是否打开
  const [roomObj, setRoomObj ]= useState({})  // 当前房间对象
  const [clientObj, setClientObj ]= useState({})  // 当前客户信息

  const [inDate, setInDate ]= useState(null)  // 入住日期
  const [preOutDate, setPreOutDate ]= useState(null)  // 预估退房日期
  const [outDate, setOutDate] = useState(null);  // 退房时间

  const [writeRoom, setWriteRoom ]= useState(false)  // 房间修改中

  const [form] = Form.useForm();  // 表单对象 
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';

  useEffect(() => {  // 实时 用户信息 
    form.setFieldsValue(clientObj)
    // 设置日期控件值
    setInDate(clientObj.inDate)
    setPreOutDate(clientObj.preOutDate)
    setOutDate(clientObj.outDate)
  }, [clientObj]); 
  useEffect(() => {  // 组件更新 执行一次数据获取操作
    if (!fetchedOnce) {
      getonce();
      setFetchedOnce(true); // 设置 fetchedOnce 为 true，表示已经获取过数据
    }
  }, [fetchedOnce]); 

  const onRec = async (onRecTime,recordId)  => {   // 归档 按钮
    let updateObj= { ... form.getFieldsValue(), 
      recordId: recordId, onRecTime:onRecTime,status:'归档',
      onRecOperator: 'fresh'} // 归档客户信息
    await $updateclient(updateObj)    
    onClose() // 关闭抽屉
    await updateData(types) // 更新数据   
  }
  const onBeforePay = async (recordId)  => {   // 付款前 更新 按钮
    let updateObj= { ... form.getFieldsValue(), 
      recordId: recordId, 
      onRecOperator: 'fresh'} 
    await $updateclient(updateObj)    
    onClose() // 关闭抽屉
    await updateData(types) // 更新数据   
  }
  const onLeave = async (recordId)  => {   // 入住客户 退房 按钮
    let updateObj= { ... form.getFieldsValue(), 
      recordId: recordId, 
      outDate: outDate,
      outOperator: 'fresh',
      status: '退房'} // 房间信息
    await $updateclient(updateObj)    
    await $updateroom({roomId:roomObj.roomId, status: '空闲'}) // 房间状态改为空闲    
    onClose() // 关闭抽屉
    await updateData(types) // 更新数据   
  }
  const UpdateClient = async (recordId) => {   // 用表单和id 更新客户信息
    let updateObj= { ... form.getFieldsValue(), ...{recordId: recordId}} // 房间信息
    await $updateclient(updateObj)    
    onClose() // 关闭抽屉
    updateData(types) // 更新数据    
  }
  const onBookIn =async () => { // 登记入住  点击
    form.setFieldValue('inDate', inDate)
    form.setFieldValue('preOutDate', preOutDate)
    setWriteRoom(false) // 房间修改结束  
    const mergedObj = { ...roomObj, ...form.getFieldsValue(), ...{status: '入住',inOperator: 'fresh'}} // 房间状态改为入住,入住办理人为fresh
    await $addclient(mergedObj)  // 用户表 插入用户信息
    await $updateroom({roomId:roomObj.roomId, status: '入住'}) // 房间表 修改房间状态
    onClose() // 关闭抽屉
    updateData(types) // 更新数据    
  }
  const onDateChange = (date, dateString,pickername) => { // 日期选择器 dateString
    if(pickername === 'inDate'){
      setInDate(dateString)
      form.setFieldValue('inDate', dateString)
    }else if(pickername === 'preOutDate'){
      setPreOutDate(dateString)
      form.setFieldValue('preOutDate', dateString)
    }else if(pickername === 'outDate'){
      setOutDate(dateString)
      form.setFieldValue('outDate', dateString)
    }
  }
  const onBooking = () => { // 空房 点击入住
    // 设置 入住日期和预估退房日期
    setInDate(dayjs().format(dateFormat))
    setPreOutDate(dayjs().add(1, 'day').format(dateFormat))
    setWriteRoom(true) // 房间 进入 修改界面
  }
  const onCardClick = (card) => { // 房间卡片点击 打开抽屉
    form.resetFields(); // 表单重置
    setRoomObj(card); // 存储当前房间对象 绑定抽屉显示内容
    let currentClient= {}
    if(card.status === '入住'){   // 入住客户
      currentClient= inClientList.find(client => client.roomId === card.roomId);
      setClientObj(currentClient) // 存储当前客户信息
      setOpen(true);  // 打开抽屉
      form.setFieldsValue(clientObj) // 表单绑定客户信息
    }else if(card.status === '空闲'){ // 空闲房间
      setOpen(true);  // 打开抽屉 显示空闲房间信息
    }else if(card.status === '退房'){ // 退房房间  
      const indays =dayjs(card.outDate).diff(dayjs(card.inDate), 'day')  // 计算入住天数
      const shouldpay = (card.price * indays)   // 计算应付金额
      const unpaid = shouldpay - card.paid  // 计算应付金额
      card = { ...card,  indays: indays , shouldpay: shouldpay , unpaid: unpaid } // 添加数据
      setClientObj(card) // 存储当前客户信息
      setOpen(true);  // 打开抽屉 显示退房房间信息
      form.setFieldsValue(clientObj) // 表单绑定客户信息
    }
  }
  const onClose = () => { // 清除内容 关闭抽屉 
    form.resetFields();
    setWriteRoom(false)
    setOpen(false);
  }
  const updateData = async (types) => {  // 页面刷新 更新数据函数 cardList,inClientList,outClientList
    let rooms = await $getrooms()     // 获取房间数据  
    let clients = await $getclients()  // 获取客户数据
    let inClients = clients.filter(client => client.status === '入住')  // 设定在店的客户
    let outClients = clients.filter(client => client.status === '退房')  // 设定退房的客户
    let oldClients = clients.filter(client => client.status === '归档')  // 归档的客户
    setInClientList(inClients)  // 在店客户列表
    setOutClientList(outClients) // 退房客户列表
    setOldClientList(oldClients) // 归档客户列表
    let cards = ([...rooms, ... outClients])    // 添加 退房卡片  通过退房客户信息生成
    let cardsWithTypes = cards.map(room => {  // 将房型信息匹配到房间数据中
        let typeInfo = types.find(type => type.type === room.type);
        return {
            ...room,  price: typeInfo.price, beds: typeInfo.beds,
        };
    });
    setCardList(cardsWithTypes); // 更新包含房型信息的房间卡数据    
  }
  const getonce = async ()=>{   // 页面初始  获取一次值  并存储
    let types = await $gettypes()  
    setTypes(types)  // 存储房间类型 备用
    updateData(types)  // 更新数据
  } 

  

  return (
    <Flex wrap gap="large">
      {/*  房间列表  绑定cardList  传出onCardClick(cardList[i])  */}
      {cardList.map((card, index) => (
        <Card
          key={index}
          style={{  
            background: 
              card.status === '入住' ? '#ffd764':
              card.status === '退房' ? '#cbc337'   
              : '#edf2fa',
            width: 135,
          }}
          hoverable={true}
          onClick={() => onCardClick(card)}   // 点击房间显示抽屉，传递房间卡对象
        >
          <h2>{card.roomId}房</h2>
          <h2>{card.type}</h2>
          {card.status === '入住' ?(<>
            <p>{dayjs(card.inDate).format('YYYY-MM-DD')}</p>
            <h2>入住</h2> 
          </>): card.status === '退房' ?(<>
            <p>{dayjs(card.outDate).format('YYYY-MM-DD')}</p>
            <h2>退房</h2>  
          </>)  :<h2>空闲</h2> }      
        </Card>
      ))}

      {/* 抽屉  */}
      <Drawer
        title={roomObj.roomId + '房 ' +roomObj.type}
        width={360}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 60,
          },
        }}
      >
        <Form 
          form = {form}       
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 360,
          }}     
          autoComplete='off'  
          requiredMark   
          onFinish={onBookIn}
        >
          {/* 公共信息部分 */}
          <Form.Item label="床数" > {roomObj.beds} </Form.Item>
          <Form.Item label="价格">{roomObj.price} 元/日 </Form.Item>

           {/* 空闲房状态显示 */}
           {roomObj.status === '空闲' && (
            <>
              <Form.Item label="状态">{roomObj.status}</Form.Item>
              <Form.Item label="需要1.5倍的押金" > {roomObj.price * 1.5} 元/天  </Form.Item>
              {!writeRoom ? (  // 房间未修改
                <Form.Item >
                  <Button  type='primary' onClick={onBooking}>入住</Button>
                </Form.Item> 
              ) : (   // 房间修改中
                <>
                  <Form.Item label="客户姓名" name='clientName' 
                  rules={[
                    {
                      required: true,
                      message: '请输入客户姓名!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入客户姓名"  />
                  </Form.Item>
                  <Form.Item label="身份证号" name='ID'
                  rules={[
                    {
                      required: true,
                      message: '请输入客户身份证号!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入身份证号"   />
                  </Form.Item>
                  <Form.Item label="性别" name='gender'
                  rules={[
                    {
                      required: true,
                      message: '请输入性别!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入性别" />
                  </Form.Item>
                  <Form.Item label="电话" name='tel'
                  rules={[
                    {
                      required: true,
                      message: '请输入电话!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入电话" />
                  </Form.Item>
                  <Form.Item label="年龄" name='age'
                  rules={[
                    {
                      required: true,
                      message: '请输入客户年龄!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入年龄"  />
                  </Form.Item>
                  <Form.Item label="人数" name='people'
                  rules={[
                    {
                      required: true,
                      message: '请输入入住人数!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入入住人数" />
                  </Form.Item>
                  <Form.Item label="押金" name='paid'
                  rules={[
                    {
                      required: true,
                      message: '请输入押金!',
                      whitespace: true,
                    },
                  ]}
                  >
                    <Input placholder="请输入押金" />
                  </Form.Item>
                  <Form.Item label="入住日期" name='inDate'>
                    <ConfigProvider locale={locale}>
                      <DatePicker 
                        onChange={ (date, dateString) => onDateChange(date,dateString,'inDate')} 
                        value={dayjs(inDate , dateFormat)}
                        format={dateFormat}
                        needConfirm={true}
                        showTime
                      />                  
                    </ConfigProvider>                
                  </Form.Item>              
                  <Form.Item label="预约退房日期" name='preOutDate'>              
                    <ConfigProvider locale={locale}>
                      <DatePicker 
                        onChange={ (date, dateString) => onDateChange(date,dateString,'preOutDate')} 
                        value={dayjs(preOutDate , dateFormat)}
                        format={dateFormat}
                        needConfirm={true}
                        showTime
                      />                  
                    </ConfigProvider>                
                  </Form.Item> 
                  {/* 按钮 */}      
                  <Form.Item >
                    <Button type='primary' htmlType='submit'>确认入住</Button>
                  </Form.Item>            
                </>
              )}
            </>
          )}

          {/* 入住房状态显示 */}
          {roomObj.status === '入住' && (
            <>
              <Form.Item label="客户姓名" name='clientName' 
              rules={[
                {
                  required: true,
                  message: '请输入客户姓名!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入客户姓名"  />
              </Form.Item>
              <Form.Item label="身份证号" name='ID'
              rules={[
                {
                  required: true,
                  message: '请输入客户身份证号!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入身份证号"   />
              </Form.Item>
              <Form.Item label="性别" name='gender'
              rules={[
                {
                  required: true,
                  message: '请输入性别!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入性别" />
              </Form.Item>
              <Form.Item label="电话" name='tel'
              rules={[
                {
                  required: true,
                  message: '请输入电话!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入电话" />
              </Form.Item>
              <Form.Item label="年龄" name='age'
              rules={[
                {
                  required: true,
                  message: '请输入客户年龄!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入年龄"  />
              </Form.Item>
              <Form.Item label="人数" name='people'
              rules={[
                {
                  required: true,
                  message: '请输入入住人数!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入入住人数" />
              </Form.Item>
              <Form.Item label="押金" name='paid'
              rules={[
                {
                  required: true,
                  message: '请输入押金!',
                  whitespace: true,
                },
              ]}
              >
                <Input placholder="请输入押金" />
              </Form.Item>
              <Form.Item label="入住日期" name='inDate'>
                <ConfigProvider locale={locale}>
                  <DatePicker 
                    onChange={ (date, dateString) => onDateChange(date,dateString,'inDate')} 
                    value={dayjs(inDate , dateFormat)}
                    format={dateFormat}
                    needConfirm={true}
                    showTime
                  />                  
                </ConfigProvider>                
              </Form.Item>
              {clientObj.status === '入住' && (   //入住期间
                <>
                <Form.Item label="预约退房日期" name='preOutDate'>              
                  <ConfigProvider locale={locale}>
                    <DatePicker 
                      onChange={ (date, dateString) => onDateChange(date,dateString,'preOutDate')} 
                      value={dayjs(preOutDate , dateFormat)}
                      format={dateFormat}
                      needConfirm={true}
                      showTime
                    />                  
                  </ConfigProvider>                
                </Form.Item>     
                {/* 按钮组  //   更新、退房  都使用当前 用户id 作为参数  */}
                <Form.Item >    
                  <Space>
                    <Button type='primary' onClick={() => UpdateClient(clientObj.recordId)}  >更新</Button>
                    <Popconfirm
                      title="客人确定要退房吗？"
                      description="退房后无法返回"
                      onConfirm={() => onLeave(clientObj.recordId)}              
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button onClick={() => {setOutDate(dayjs().format('YYYY-MM-DD HH:mm:ss'))}}>
                        退房
                      </Button>                  
                    </Popconfirm>
                  </Space>                
                </Form.Item> 
                </>
              )}

              {clientObj.status === '退房' && (   //退房后
                <>
                <Form.Item label="退房日期" name='outDate'>              
                  <ConfigProvider locale={locale}>
                    <DatePicker 
                      onChange={ (date, dateString) => onDateChange(date,dateString,'outDate')} 
                      value={dayjs(outDate , dateFormat)}
                      format={dateFormat}
                      needConfirm={true}
                      showTime
                    />                  
                  </ConfigProvider>                
                </Form.Item>     
                {/* 按钮组  //    用户id 作为参数  */}
                <Form.Item >    
                  <Space>
                    <Button type='primary' onClick={() => UpdateClient(clientObj.recordId)}  >修正</Button>
                    <Popconfirm
                      title="客人确定要退房吗？"
                      description="退房后无法返回"
                      onConfirm={() => onLeave(clientObj.recordId)}              
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button onClick={() => {setOutDate(dayjs().format('YYYY-MM-DD HH:mm:ss'))}}>
                        退房
                      </Button>                  
                    </Popconfirm>
                  </Space>                
                </Form.Item> 
                </>
              )}                
            </>
          )}

         

          {/* 退房状态显示 */}
          {roomObj.status === '退房' &&  (
            <>
              <Descriptions title="账单" items={[
                {
                  key: '1',
                  label: '入住',
                  children: clientObj.indays+'天',
                },{
                  key: '2',
                  label: '应付',
                  children: clientObj.shouldpay+'元',
                },{
                  key: '3',
                  label: '待付',
                  children:  clientObj.unpaid+'元',
                },
              ]} />              

            <Form.Item label="客户姓名" name='clientName' 
            rules={[
              {
                required: true,
                message: '请输入客户姓名!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入客户姓名"  />
            </Form.Item>
            <Form.Item label="身份证号" name='ID'
            rules={[
              {
                required: true,
                message: '请输入客户身份证号!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入身份证号"   />
            </Form.Item>
            <Form.Item label="性别" name='gender'
            rules={[
              {
                required: true,
                message: '请输入性别!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入性别" />
            </Form.Item>
            <Form.Item label="电话" name='tel'
            rules={[
              {
                required: true,
                message: '请输入电话!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入电话" />
            </Form.Item>
            <Form.Item label="年龄" name='age'
            rules={[
              {
                required: true,
                message: '请输入客户年龄!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入年龄"  />
            </Form.Item>
            <Form.Item label="人数" name='people'
            rules={[
              {
                required: true,
                message: '请输入入住人数!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入入住人数" />
            </Form.Item>
            <Form.Item label="押金" name='paid'
            rules={[
              {
                required: true,
                message: '请输入押金!',
                whitespace: true,
              },
            ]}
            >
              <Input placholder="请输入押金" />
            </Form.Item>
            <Form.Item label="入住日期" name='inDate'>
              <ConfigProvider locale={locale}>
                <DatePicker 
                  onChange={ (date, dateString) => onDateChange(date,dateString,'inDate')} 
                  value={dayjs(inDate , dateFormat)}
                  format={dateFormat}
                  needConfirm={true}
                  showTime
                />                  
              </ConfigProvider>                
            </Form.Item>
            <>
              <Form.Item label="退房日期" name='outDate'>              
                <ConfigProvider locale={locale}>
                  <DatePicker 
                    onChange={ (date, dateString) => onDateChange(date,dateString,'outDate')} 
                    value={dayjs(outDate , dateFormat)}
                    format={dateFormat}
                    needConfirm={true}
                    showTime
                  />                  
                </ConfigProvider>                
              </Form.Item>     
              {/* 按钮组  //    用户id 作为参数  */}
              <Form.Item >    
                <Space>
                  <Button type='primary' onClick={ () => onBeforePay(clientObj.recordId)}  >更正信息</Button>
                  <Popconfirm
                    title="确定归档"
                    description="是否把客户归档？"
                    onConfirm={() => onRec(dayjs().format('YYYY-MM-DD HH:mm:ss'),clientObj.recordId)}              
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button >
                      归档
                    </Button>                  
                  </Popconfirm>
                </Space>                
              </Form.Item> 
            </>
          </>
          )}
        </Form>
      </Drawer>
    </Flex>
  )
};
