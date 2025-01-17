import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal } from 'antd';
import { Modal_Inbound } from './Model_Inbound';
import Swal from 'sweetalert2';


export function Inbound() {
    const [products, setProducts] = useState([])

    const today = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = today.toLocaleDateString("th-TH", options);

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('http://192.168.195.75:5000/v1/product/inbound/show-branch', {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "x-api-key": "1234567890abcdef",
            },
        }).then((res) => {
            if (res.status === 200) {
                setProducts(res.data.data)
                // console.log(res.data.data);
            }

        })
    }, [])

    const handlePostData = () => {
        console.log('Data being sent:', dataconfirm[0]);

        const token = localStorage.getItem('token')
        console.log(token);
        
        axios.post('http://192.168.195.75:5000/v1/product/inbound/product',dataconfirm[0], {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "x-api-key": "1234567890abcdef",
            },
        }).then((res) => {
            console.log(res);
            if (res.status === 201) {
                console.log(res);
            } Swal.fire({
                                icon: "success",
                                text: "กรองข้อมูลสำเร็จ",
                                confirmButtonText: 'ตกลง'
                            }).then(() => {
                                // เปลี่ยนเส้นทางไปหน้า /inventory
                                setDataconfirm([])
                                setCount(0)
                            });
            
        }).catch((err) => {
            console.log(err);
            if (err.response ) {
                Modal.error({
                    title: 'ข้อมูลซ้ำ',
                    content: 'ข้อมูลที่คุณพยายามเพิ่มมีอยู่แล้วในระบบ โปรดลองใหม่อีกครั้ง.',
                    onOk() {
                    }
                });
            }
          })

    };



    // console.log(products, 'w');

    const [showmodal, setShowmodal] = useState(false);
    const closeModal = () => {
        setShowmodal(false);
    };


    const [dataconfirm, setDataconfirm] = useState([]);
    const [number, setNumber] = useState({ quantity: '0' });

    const handleChange = (e, index) => {
        const { value } = e.target;

        // Update the quantity in the formData state
        setNumber((prevData) => ({
            ...prevData,
            quantity: value,
        }));

        // Update the quantity in the dataconfirm state for the specific item
        setDataconfirm((prevItems) =>
            prevItems.map((item, idx) =>
                idx === index ? { ...item, quantity: value } : item
            )
        );

    };
    const allQuantitiesValid = dataconfirm.every((item) => item.quantity > 0);
    const calculateTotalQuantity = () => {
        return dataconfirm.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    };

    const [count, setCount] = useState(0);
    // กำหนดสถานะของ count
    const handleConfirm = (items) => {
        setCount(prevCount => prevCount + 1);  // เพิ่มค่า count ทีละ 1
        console.log(items, '1');
        setDataconfirm((prevItems) => [...prevItems, { ...items, quantity: number.quantity }]);

    };

    // console.log(dataconfirm, '2');
    const deletitem = (index) => {

        setDataconfirm((prevTotalpopup) => {
            const newList = prevTotalpopup.filter((_, i) => i !== index);

            return newList;
        });
        setCount(prevCount => prevCount - 1);

    };
    const reset = () => {
        setDataconfirm([])
    };

    return (
        <div className='w-full h-[90%] mt-5'>

            {showmodal ? (
                <Modal_Inbound close={closeModal} confirm={handleConfirm} />
            ) : null}
            
            <div className='w-full h-[100%] grid grid-cols-5  overflow-auto no-scrollbar overflow-y-hidden'>

                <div className=" col-span-2  grid grid-rows-6 ">

                    <div className='row-span-4  items-center text-base  ' >

                        <div className='grid justify-end items-center grid-cols-4 pt-20'>
                            <span className="col-span-1 grid justify-end pr-2">
                                สาขา :
                            </span>
                            <select name="" id="" className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500  pl-2 " >
                                <option value="" >{products.branch_name}</option>
                            </select>
                        </div>
                        <div className='grid justify-end items-center grid-cols-4 pt-10 '>
                            <span className="col-span-1 grid justify-end  pr-2">
                                วันที่นำเข้าสินค้า :

                            </span>
                            <div className='border border-gray-500 col-span-3 w-[80%] rounded-lg h-10 flex justify-start items-center text-lg pl-4'>{formattedDate}</div>
                        </div>
                        <div className='grid justify-end items-center grid-cols-4 pt-10 '>
                            <span className='col-span-1'></span>
                            <span className="col-span-2 flex justify-start  pr-2  text-sky-800 text-xl font-bold">
                                นำเข้าสินค้า
                            </span>
                        </div>

                        <div className='grid grid-cols-8 pt-5 '>
                            <span className='col-span-2 '></span>
                            <button className="col-span-3  w-[80%] bg-[#31AB31] hover:bg-[#2a7e2d] h-10 rounded-md text-white" onClick={() => setShowmodal(true)}>
                                <i className="fa-solid fa-plus mr-2 "></i>เพิ่มสินค้า
                            </button>
                        </div>

                    </div>

                </div>

                <div className=" col-span-3 grid grid-rows-10  ">

                    <div className='row-span-9 grid grid-rows-12 border border-gray-500  rounded-lg overflow-auto no-scrollbar '>

                        <div className='row-span-1 grid grid-cols-3 pl-4 pr-4  pt-3 '>
                            <span className='col-span-1  grid justify-start items-center'>ห้างหุ้นส่วนจำกัด ภัทรชัย แบบเหล็ก</span>
                            <span className='col-span-1 row-span-2  grid justify-center  items-center text-xl font-bold'>รายการนำเข้าสินค้า</span>
                            <span className='col-span-1 '></span>
                            <span className='col-span-1  grid justify-start items-center '>สาขา : {products.branch_name}</span>
                            <span className='col-span-1  grid justify-end items-center '>{formattedDate}</span>
                        </div>

                        <div className='row-span-10  grid grid-rows-3 mt-4 h-[580px] '>
                            <div className=' row-span-3 overflow-auto no-scrollbar  border-b-4 flex justify-center items-start mr-3 ml-3'>
                                <table className="w-full table-auto text-center border-collapse ">
                                    <thead className="font-bold  bg-blue-200 text-sky-800 sticky top-0 ">
                                        <tr >
                                            <th className="px-4 py-2 rounded-tl-lg border-white">ลำดับ</th>
                                            <th className="px-4 py-2">รหัสสินค้า</th>
                                            <th className="px-4 py-2">ชื่อสินค้า</th>
                                            <th className="px-4 py-2">ขนาด</th>
                                            <th className="px-4 py-2">เมตร</th>
                                            <th className="px-4 py-2">เซนติเมตร</th>
                                            <th className="px-4 py-2">จำนวน</th>
                                            <th className="px-4 py-2">หน่วย</th>
                                            <th className="px-4 py-2 rounded-tr-lg"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataconfirm.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4">
                                                    ไม่มีข้อมูล
                                                </td>
                                            </tr>
                                        ) : (
                                            dataconfirm.map((item, index) => (
                                                <tr className="border-b-2 " key={index}>
                                                    <td className="px-4 py-2 " >{index + 1}</td>
                                                    <td className="py-2 ">{item.code || '-'}</td>
                                                    <td className="px-8 py-2">{item.name || '-'}</td>
                                                    <td className="px-4 py-2">{item.size || '-'}</td>
                                                    <td className="px-4 py-2">{item.meter || '-'}</td>
                                                    <td className="px-4 py-2">{item.centimeter || '-'}</td>
                                                    <td className="py-2 w-16">
                                                        <input
                                                            type="number"
                                                            name="quantity"
                                                            value={item.quantity || number.quantity}
                                                            className="px-2 py-2 text-center border w-[100%] rounded-lg border-gray-500"
                                                            onChange={(e) => handleChange(e, index)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{item.unit || '-'}</td>
                                                    <td className="px-6 py-2">
                                                        <i className="fa-solid fa-trash text-red-600 text-xl cursor-pointer  hover:scale-125"
                                                            onClick={() => deletitem(index)}></i>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='row-span-1 grid grid-cols-6   justify-start items-center  '>
                            <span className="col-span-3  grid grid-cols-5  p-1">
                                <span className='col-span-3 grid justify-end'>
                                    รวมรายการสินค้าที่นำเข้าทั้งหมด
                                </span>
                                <span className='col-span-1 grid justify-center'>
                                    {count}
                                </span>
                                <span className='col-span-1 grid justify-start'>
                                    รายการ
                                </span>
                            </span>
                            <span className="col-span-3  grid grid-cols-4  ">
                                <span className='col-span-1 '></span>
                                <span className='col-span-1 grid justify-end p-1'>จำนวน</span>
                                <span className='col-span-1 grid justify-center p-1'>{calculateTotalQuantity()}</span>
                                <span className='col-span-1 grid justify-start p-1'> ชิ้น</span>
                            </span>
                        </div>
                    </div>

                    <div className='row-span-1 grid grid-rows-1 '>

                        <div className=" row-span-1  items-center justify-center grid grid-cols-2 text-white">
                            <span className='col-span-1 flex  justify-end pr-16 '>
                                <button
                                    className={`bg-blue-500 w-2/6 p-2 rounded-md ${count > 0 && allQuantitiesValid ? "hover:bg-blue-700" : "cursor-not-allowed opacity-50"
                                        }`}
                                    onClick={handlePostData}
                                    disabled={count <= 0 || !allQuantitiesValid } // ปุ่มจะถูก disable ถ้า count <= 0
                                ><i className="fa-solid fa-floppy-disk mr-2"></i>
                                    บันทึก
                                </button>                                
                            </span>
                            <span className='col-span-1 flex  justify-start pl-16 '>
                                <button className="bg-red-500  w-2/6 p-2 rounded-md hover:bg-red-700" onClick={reset}><i className="fa-solid fa-x mr-2"></i>ยกเลิก</button>
                            </span>

                        </div>
                    </div>

                </div>

            </div>
                                         
        </div>
    )
}
