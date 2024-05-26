import { BrowserRouter, Routes, Route } from "react-router-dom";

// 导入主页
import Home from "./views/Home/Home";
// 导入项目组件
import Tbd from "./views/Tbd/Tbd";
import HAdmin from "./views/HAdmin/HAdmin";
  import HRoom from "./views/HRoom/HRoom";
  import HLogin from "./views/HLogin/HLogin";

  import HUser from "./views/HUser/HUser";
  



function App() {

  return (
    // 前端路由
    <BrowserRouter>
      <Routes>

        {/* 主页 */}
        <Route path="/" element={<Home></Home>}></Route>
        
        {/* 酒店管理系统 */}
        <Route path="/hadmin" element={<HAdmin></HAdmin>}>
          <Route path="room" element={<HRoom></HRoom>}></Route>
        </Route>
        <Route path="/hlogin" element={<HLogin></HLogin>}></Route>

        {/* 同步带计算 */}
        <Route path="/tbd" element={<Tbd></Tbd>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
