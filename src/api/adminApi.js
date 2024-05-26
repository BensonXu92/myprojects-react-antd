import instance from "../utils/request";
// post
// 编辑账号
export const $edituser = async (values) => {
  let res =  await instance.post('/edituser',
      { params: values }          
  )
  console.log(res)
  return res.data.res
}
// 增加账号
export const $adduser = async (values) => {
  let res =  await instance.post('/adduser',
      { params: values }          
  )
  return res.data.res
}


// 删除账号
export const $deluser = async (values) => {
  let res =  await instance.get('/deluser',
      { params: values }          
  )
  return res
}
// get
// 获取账号列表
export const $getuser = async (values) => {
  let res =  await instance.get( '/getuser',{ params: values })
  return res.data.res
}

// 获取 roleName值 列表
export const $getroleName = async () => {
  let res =  await instance.get( '/getroleName')
  return res.data.res
}

// 登录
export const $login = async (values) => {
    let res = {}
    await instance.get('/login',
      { params: values }          
    )
    .then(function (response) {;
      res = response.data
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
    }); 
    return res
}