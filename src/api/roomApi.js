import instance from "../utils/request";


// get
// 获取rooms
export const $getrooms = async (values) => {
  let res =  await instance.get( '/getrooms',{ params: values })
  return res.data.res
}
// 获取房间types
export const $gettypes = async (values) => {  
  let res =  await instance.get( '/gettypes',{ params: values })
  return res.data.res
}



// post
export const $updateroom   = async (values) => {  //修改房间状态
  let res =  await instance.post('/updateroom',
      { params: values }          
  )
  return res.data.res
}