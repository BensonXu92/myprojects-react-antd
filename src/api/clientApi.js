import instance from "../utils/request";

// post
export const $outroomclient = async (values) => {   // 退房客户信息
  let res =  await instance.post('/outroomclient',
      { params: values }          
  )
  return res.data.res
}
export const $beforepay = async (values) => {  // 付款前更新客户信息
  let res =  await instance.post('/beforepay',
      { params: values }          
  )
  console.log(res)
  return res.data.res
}
export const $updateclient = async (values) => {  // 更新客户信息
  let res =  await instance.post('/updateclient',
      { params: values }          
  )
  return res.data.res
}
export const $addclient = async (values) => {  // 新增客户信息
  let res =  await instance.post('/addclient',
      { params: values }          
  )
  console.log(res)
  return res.data.res
}




// get
export const $getclients = async (values) => {   // 获取客户列表
  let res =  await instance.get( '/getclients',{ params: values })
  return res.data.res
}

