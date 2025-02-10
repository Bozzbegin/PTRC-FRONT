import Swal from 'sweetalert2'
import { NavLink, useLocation } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useEffect } from 'react';
import axios from 'axios';

export default function Sidebar() {
  const [f_name, setF_name] = useState('')
  const [position, setPosition] = useState('')
  const [locationPic, setLocationPic] = useState('https://static.thairath.co.th/media/4DQpjUtzLUwmJZZO80itzS42aLeUYNffMhzh75BcRd0d.jpg')

  const location = useLocation();
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem('token')
    Swal.fire({
      icon: 'success',
      text: "Logout Successfully",
      confirmButton: 'ok'
    }).then((res) => {
      navigate('login')
    })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('http://192.168.195.75:5000/v1/product/outbound/profile', {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
        "x-api-key": "1234567890abcdef",
      },
    }).then((res) => {
      if (res.status === 200) {
        setF_name(res.data.data.first_name)
        setPosition(res.data.data.position)
        setLocationPic(res.data.data.picture_location ? res.data.data.picture_location : "https://static.thairath.co.th/media/4DQpjUtzLUwmJZZO80itzS42aLeUYNffMhzh75BcRd0d.jpg");
      }
    })
  }, [])

  const isHomePage = location.pathname === "/";

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-center h-1/6 mt-3">
        <img src="img/logo.png" alt="image" width={250} />
      </div>

      <div className="flex flex-col justify-between h-full w-full mt-4">
        <div className="flex flex-col items-end h-5/6">
          <div className=" h-1/6 w-full flex items-center justify-center p-4">
            <div className="bg-[#CBDCEB] h-full flex justify-around items-center gap-2 w-full rounded-md p-6">
              <div className="hidden xl:block w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={locationPic}
                  alt="profile"
                  className="w-16 h-16 object-cover hidden xl:block"
                />
              </div>

              <div className="text-sm text-black flex flex-col items-center">
                <span className="hidden md:block xl:text-md 2xl:text-[20px]  text-center text-[#133E87] font-bold">
                  {f_name}
                </span>
                <span className="hidden text-[#608BC1] text-[15px] xl:block ">
                  {position}
                </span>
              </div>
            </div>
          </div>

          {/* รายการเมนู */}
          {isSidebarOpen && !isHomePage && (
            <>
              <NavLink
                to="/"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-house-chimney w-10 mr-2"></i>
                <span>หน้าแรก</span>
              </NavLink>

              <NavLink
                to="/inbound"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-file w-10 mr-2"></i>
                <span>นำเข้าสินค้า</span>
              </NavLink>

              <NavLink
                to="/outbound"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-file-import w-10 mr-2"></i>{" "}
                <span>ส่งออกสินค้า</span>
              </NavLink>

              <NavLink
                to="/status"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-list-check w-10 mr-2"></i>
                <span>สถานะสินค้า</span>
              </NavLink>

              <NavLink
                to="/returnitem"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-recycle w-10 mr-2"></i>
                <span>คืนสินค้า</span>
              </NavLink>

              <NavLink
                to="/stock"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-store w-10 mr-2"></i>
                <span>สินค้าคงคลัง</span>
              </NavLink>

              <NavLink
                to="/allptc"
                className={({ isActive }) =>
                  `sidebar-menu my-1
                        ${isActive ? "activeclass" : ""}`
                }
              >
                <i className="fa-solid fa-clipboard-list w-10 mr-2"></i>
                <span>รายการทั้งหมด</span>
              </NavLink>
            </>
          )}
          {/* รายการเมนู */}
        </div>

        <div className="text-xl text-[#608BC1] h-1/6 w-full flex items-center justify-center">
          <div className="bg-[#133E87] w-3/4 p-1 text-sm cursor-pointer xl:p-2 rounded-md xl:text-lg text-center" onClick={logout}>
            <span className="text-white">
              <i className="text-[#ffffff] fa-solid fa-right-from-bracket mt-1 mr-1"></i> ออกจากระบบ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

//หน้าจอต่ำกว่า 1280 ต้องเปลี่ยนตรง sidebar แล้ว
