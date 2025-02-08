import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [datauser, setDatauser] = useState({ username: '', password: '', remember: false });
    const [loading, setLoading] = useState(false); // เพิ่มสถานะ loading
    const navigate = useNavigate();  // ใช้ navigate เพื่อไปยังหน้าถัดไป

    const changedata = (e) => {
        setDatauser(prevdata => ({
            ...prevdata,
            [e.target.name]: e.target.value
        }));
    };

    const handleRememberChange = (e) => {
        setDatauser(prevdata => ({
            ...prevdata,
            remember: e.target.checked
        }));
    };

    const confirm_login = async () => {

        if (!datauser.username.trim() || !datauser.password.trim()) {
            Swal.fire({
                icon: 'warning',
                text: 'กรุณากรอกชื่อผู้ใช้เเละรหัสผ่าน',
                confirmButtonText: 'ตกลง'
            });
        }

        setLoading(true); // เริ่มการโหลด

        try {
            const response = await axios.post('http://192.168.195.75:5000/auth/login', {
                username: datauser.username,
                password: datauser.password,
                remember: datauser.remember,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '1234567890abcdef',
                }
            });

            // เพิ่มการตรวจสอบ response
            console.log("Response data:", response.data);

            // Check if token is returned in the response
            if (response.status === 200 && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                // แสดง SweetAlert เมื่อสำเร็จ
                Swal.fire({
                    icon: "success",
                    text: "เข้าสู่ระบบสำเร็จ",
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    // เปลี่ยนเส้นทางไปหน้า /
                    navigate('/');
                });
            } else {
                // ถ้าไม่พบ token ใน response ให้แสดง error message
                Swal.fire({
                    icon: 'error',
                    text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                    confirmButtonText: "ตกลง"
                });
            }
        } catch (error) {
            // ถ้ามีข้อผิดพลาดในการส่งคำขอหรือในส่วนของ API
            console.log("Error:", error);
            Swal.fire({
                icon: 'error',
                text: "เกิดข้อผิดพลาดในการล็อกอิน",
                confirmButtonText: "ตกลง"
            });
        } finally {
            setLoading(false); // สิ้นสุดการโหลด
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            confirm_login();
        }
    };

    return (
        <HelmetProvider>
            <Helmet>
                <title>LOGIN</title>
            </Helmet>
            <div className="font-inria bg-blue-300/60 bg-opacity-60 backdrop-blur-lg w-screen h-screen flex justify-center items-center">
                <div className="bg-white p-2 w-2/6 h-5/6 border rounded-xl">
                    <div className="p-2 flex justify-center items-center mt-3">
                        <img src='/img/logo.png' alt='logo' width={250} height={250} />
                    </div>

                    <div className='text-2xl text-[#222770] text-center mt-3'>
                        เข้าสู่ระบบ
                    </div>

                    <div className='mt-2 flex flex-col p-5 justify-center items-center'>
                        <div className="flex w-4/6 h-full flex-col">
                            <label htmlFor="username" className='text-[#222770] font-bold'>ชื่อผู้ใช้ :</label>
                            <input
                                type='text'
                                placeholder='ชื่อผู้ใช้งาน'
                                name='username'
                                id='username'
                                className='w-full p-1 outline-none border-2 border-blue-800 mt-1 rounded-lg'
                                onChange={changedata}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="flex w-4/6 h-full flex-col mt-2">
                            <label htmlFor="password" className='text-[#222770] font-bold'>รหัสผ่าน :</label>
                            <input
                                type='password'
                                placeholder='รหัสผ่าน'
                                name="password"
                                id="password"
                                className='w-full p-1 outline-none border-2 border-blue-800 mt-1 rounded-lg'
                                onChange={changedata}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Checkbox สำหรับ Remember me */}
                        <div className="mt-3 flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                checked={datauser.remember}
                                onChange={handleRememberChange}
                                className="mr-2"
                            />
                            <label htmlFor="remember" className="text-[#222770]">จดจำฉัน</label>
                        </div>
                    </div>

                    <div className=' mt-5 p-5 w-full flex justify-center items-center'>
                        <button
                            className='bg-[#133E87] text-white w-4/6 p-2 rounded-lg'
                            onClick={confirm_login}
                            // onKeyDown={(e) => e.key === 'Enter' && confirm_login()}
                            disabled={loading} // ปิดการใช้งานปุ่มเมื่อกำลังโหลด
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </div>
                </div>
            </div>
        </HelmetProvider>
    );
};

export default Login;