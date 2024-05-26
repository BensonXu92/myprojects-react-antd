
import {  useNavigate } from 'react-router-dom';
import { FloatButton } from 'antd';

export default function Hgohome() {

  const navigate = useNavigate()
  return (  
      <FloatButton 
        shape='square'
        style={{
          right: '10vw',
          bottom: '10vw',
          // top:'10vw',
        }}
        description="首页"
        onClick={() => navigate('/')}
        tooltip={<div>返回首页</div>}          
      />            
  )
}