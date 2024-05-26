import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, message, Upload } from 'antd';
import {uploadURL,publicURL} from '../../config/index';

// 将小图片转换成base64编码url
// const getBase64 = (img, callback) => {
//   // 内置的 JavaScript 类，允许你读取存储在用户计算机上的文件内容。
//   const reader = new FileReader(); 
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// };
const beforeUpload = (file) => {  
  console.log(file)
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function HUpload({form}) {
  useEffect(()=>{
    let purl = form.getFieldValue('photo')
    if (purl) {
      setImageUrl(publicURL +'/' + purl)
    }
  },[form.getFieldValue('photo')])
  // 状态
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  // 事件 选择图片，自动上传。 
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 更新表单中photo值
      console.log(info)
      form.setFieldValue('photo', info.file.originFileObj.name)
      setLoading(false); 
      // getBase64(info.file.originFileObj, (url) => {
                     //   setImageUrl(url);
          // });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </button>
  );



  return (
    <Flex gap="middle" wrap>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadURL}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        crossOrigin= 'anonymous'
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      
    </Flex>
  );
};





    