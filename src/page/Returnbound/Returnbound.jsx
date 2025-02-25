import React from 'react'
import { useState, useEffect } from 'react'
import { Modal_ReturnGreen } from './Model_ReturnGreen';
import { Modal_ReturnRed } from './Model_ReturnRed';
import { Modal_ReturnYellow } from './Model_ReturnYellow';
import axios from 'axios';

export function ReturnItem() {


    const [filterReceipt, setFilterReceipt] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [dataMenuReturn, setDataMenuReturn] = useState([]);


    const filteredData = dataMenuReturn.filter(item =>
        item.receip_number.toLowerCase().includes(filterReceipt.toLowerCase()) &&
        item.created_at.includes(filterDate)
    );

    const [products, setProducts] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('http://192.168.195.75:5000/v1/product/inbound/show-branch', {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "x-api-key": "p@tt@r@ch@i2k24",
            },
        }).then((res) => {
            if (res.status === 200) {
                setProducts(res.data.data)
            }

        })
        axios.get('http://192.168.195.75:5000/v1/product/return/get-return-list', {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "x-api-key": "p@tt@r@ch@i2k24",
            },
        }).then((res) => {
            if (res.status === 200) {
                setDataMenuReturn(res.data.data)
            }
        })

    }, [])




    const [showmodalGreen, setShowmodalGreen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const closeModalGreen = () => {
        setShowmodalGreen(false);
        window.location.reload();
    };
    const [showmodalRed, setShowmodalRed] = useState(false);
    const closeModalRed = () => {
        setShowmodalRed(false);
    };

    const [showmodalYellow, setShowmodalYellow] = useState(false);
    const closeModalYellow = () => {
        setShowmodalYellow(false);
    };
    const [dataGreen, setDataGreen] = useState([])
    const [dataRed, setDataRed] = useState([])
    const [dataYellow, setDataYellow] = useState([])


    const handleOpenModal = (id, modalType) => {
        setSelectedReceipt(id); // เก็บค่า id

        // เปิด modal ตามประเภท
        if (modalType === 'green') {
            setShowmodalGreen(true);
        } else if (modalType === 'red') {
            setShowmodalRed(true);
        } else if (modalType === 'yellow') {
            setShowmodalYellow(true);
        }

        // เรียก API ด้วย id
        const token = localStorage.getItem('token');
        axios
            .get(`http://192.168.195.75:5000/v1/product/return/return/${id}`, {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                    "x-api-key": "p@tt@r@ch@i2k24",
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setDataGreen(res.data.data)
                    setDataRed(res.data.data)
                    setDataYellow(res.data.data)
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error); // จัดการข้อผิดพลาด
            });
    };

    const formatThaiDate = (dateString) => {
        if (!dateString) return ""; // ตรวจสอบว่ามีข้อมูลวันที่หรือไม่

        const [year, month, day] = dateString.split(" ")[0].split("-"); // แยกปี เดือน และวันจากวันที่
        const thaiMonthsShort = [
            "มกรา", "กุมภา", "มีนา", "เมษา", "พฤษภา", "มิถุนา",
            "กรกฎา", "สิงหา", "กันยา", "ตุลา", "พฤศจิกา", "ธันวา"
        ];
        const thaiYear = parseInt(year, 10) + 543; // แปลงปี ค.ศ. เป็น พ.ศ.

        return ` ${parseInt(day, 10)} ${thaiMonthsShort[parseInt(month, 10) - 1]} ${thaiYear}`; // คืนค่าที่จัดรูปแบบ
    };


    return (
        <div className='w-full h-[90%]  grid grid-rows-12'>

            {showmodalGreen ? (
                <Modal_ReturnGreen close={closeModalGreen} data={[dataGreen]} />
            ) : null}
            {showmodalRed ? (
                <Modal_ReturnRed close={closeModalRed} data={[dataRed]} />
            ) : null}
            {showmodalYellow ? (
                <Modal_ReturnYellow close={closeModalYellow} data={[dataYellow]} />
            ) : null}

            <div className='row-span-1 '>
                <span className='pr-2 font-bold text-xl text-sky-800'>สาขา :</span>
                <span>
                    <select
                        className="h-10 w-[220px] rounded-md border border-gray-500 p-2 "
                    >
                        <option value="">{products.branch_name}</option>
                    </select>
                </span>
                <span className='pr-2 pl-5 font-bold text-xl text-sky-800'>เลขที่ใบเสร็จ :</span>
                <span><input type='text' className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
                    value={filterReceipt}
                    onChange={(e) => setFilterReceipt(e.target.value)}
                // placeholder="ค้นหาใบเสร็จ"
                /></span>
                <span className='pr-2 pl-5 font-bold text-xl text-sky-800'>วันที่ทำรายการ :</span>
                <span><input type='date' className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                /></span>
                <span className='pr-2 pl-5 font-bold text-lg text-white'>
                    <button className='bg-blue-500 h-10 w-28 rounded-md hover:bg-blue-600'>ค้นหา</button>
                </span>

            </div>

            {filteredData.length === 0 ? (
                <p className="text-center text-2xl mt-4">ไม่พบรายการสินค้า</p>
            ) : (
                <div className='row-span-11 overflow-auto no-scrollbar '>

                    <table className="table-auto w-full border-collapse ">
                        <thead className='bg-blue-200 border-l-2  h-14 text-sky-800 text-lg sticky top-0 rounded-lg '>
                            <tr>
                                <th className=" px-4 border-l-2  py-2 rounded-tl-lg border-white">ลำดับที่</th>
                                <th className=" px-6 border-l-2  py-2">สาขา</th>
                                <th className=" px-4 border-l-2  py-2">เลขที่ใบเสร็จ</th>
                                <th className=" px-4 border-l-2 py-2">วันที่ทำรายการ</th>
                                <th className=" px-4 border-l-2 py-2">นามลูกค้า/ชื่อบริษัท</th>
                                <th className=" px-4 border-l-2 py-2">รูปแบบ</th>
                                <th className=" px-4 border-l-2 py-2">สถานะ</th>
                                <th className=" px-2 border-l-2 py-2 rounded-tr-lg">เพิ่มเติม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((items, index) => (
                                <tr key={index} className='  border-2'>
                                    <td className="text-center border-l-2 px-4 py-2 ">{index + 1}</td>
                                    <td className="text-center border-l-2 px-4 py-2 ">{items.branch_name}</td>
                                    <td className="text-center border-l-2 px-4 py-2">{items.receip_number}</td>
                                    <td className="text-center border-l-2 px-4 py-2">{formatThaiDate(items.created_at)}</td>
                                    <td className="text-start border-l-2 px-4 py-2">{items.customer_name}</td>
                                    <td className="text-center border-l-2 px-4 py-2">{items.type === 'hire' ? 'กำลังเช่า' : items.type === 'both' ? 'ขาย/เช่า' : items.type === 'sell' ? 'ขาย' : items.type}</td>
                                    <td className={`text-center border-l-2 px-4 py-2 
                                        ${items.status === 'late' ? 'text-red-500' : 'text-green-500'}`}>
                                        {items.status === 'late' ? 'เลยกำหนดส่งคืน' : 'รอส่งคืน'}
                                    </td>
                                    <td className="text-center py-2 border-l-2 border-r-2">
                                        {items.status === 'late' ? (
                                            <button className="bg-red-500   pt-2 pb-2 w-24 rounded-lg text-white  "
                                                onClick={() => handleOpenModal(items.id, 'green')}
                                            >เลยกำหนด</button>
                                        ) : items.status === 'hire' || items.status === 'continue' ? (
                                            <>
                                                <button className="bg-green-500 pt-2 pb-2 w-24 mx-3 rounded-lg text-white  "
                                                    onClick={() => handleOpenModal(items.id, 'green')}
                                                >ส่งคืน</button>
                                                {/* <button className="bg-yellow-300 pt-2 pb-2 w-24 mx-3 rounded-lg  "
                                                    onClick={() => handleOpenModal(items.id, 'yellow')}
                                                >เช่าต่อ</button> */}
                                            </>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>
            )}

        </div>


    )
}