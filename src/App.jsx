import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Components/Layout_Components/Sidebar';
import { Get_DateTime } from './Components/Layout_Components/Datetimeshow';
import { useState, useEffect } from 'react';

function App() {
  const [datetime, setDatetime] = useState('');
  

  useEffect(() => {
    const currentDateTime = Get_DateTime();
    setDatetime(currentDateTime);

    const interval = setInterval(() => {
      const currentDateTime = Get_DateTime();
      setDatetime(currentDateTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // รายการของหน้า
  const pageData = [
    { title: 'ห้างหุ้นส่วนจำกัด ภัทรชัย แบบเหล็ก', route: '/' },
    { title: 'นำเข้าสินค้า', route: '/inbound' },
    { title: 'ส่งออกสินค้า', route: '/outbound' },
    { title: 'คืนสินค้า', route: '/returnitem' },
    { title: 'สถานะสินค้า', route: '/status' },
    { title: 'คลังสินค้า', route: '/stock' },
    { title: 'รายการทั้งหมด', route: '/allptc' },
  ];

  // เปรียบเทียบและดึงข้อมูลจาก route ปัจจุบัน
  const currentPage = pageData.find(page => page.route === window.location.pathname);
  
  // เปลี่ยนชื่อหน้าให้เหมาะสมตาม route
  const displayTitle = currentPage ? currentPage.title : 'ไม่พบหน้า';

  return (
    <div className="flex h-screen font-inria">
      <div className="h-full xl:w-[300px] xl:min-w-[300px] ">
        <Sidebar />
      </div>
      <main className="flex-grow shadow-[-5px_0px_3px_0px_rgba(0,0,0,0.200)] mt-4 mr-4 mb-4 border rounded-xl pl-5 pr-5">
        <div className="pt-3 pb-3 border-b-4  border-[#608BC1] flex justify-between items-center text-[#608BC1] mb-7">
          <div className="text-xl font-bold text-sky-800">
            {displayTitle} {/* แสดงชื่อหน้า */}
          </div>
          <div className="text-sm">{datetime}</div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
