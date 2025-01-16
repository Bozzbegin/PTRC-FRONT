import React, { useState } from "react";
import { Modal_ReturnItem } from "./Model_ReturnItem";

export function Modal_ReturnYellow({ close, data }) {


    console.log(data, "เหลืองมาแล้ว");



    const calculateNewDate = (actualOut, daysToAdd) => {
        if (!actualOut) {
            console.error("actualOut is missing:", actualOut);
            return "วันที่ไม่พร้อมใช้งาน";
        }
        if (isNaN(daysToAdd)) {
            console.error("daysToAdd is not a number:", daysToAdd);
            return "จำนวนวันไม่ถูกต้อง";
        }

        const actualOutDate = new Date(actualOut);
        if (isNaN(actualOutDate)) {
            console.error("Cannot parse actualOut:", actualOut);
            return "รูปแบบวันที่ไม่ถูกต้อง";
        }

        actualOutDate.setDate(actualOutDate.getDate() + parseInt(daysToAdd, 10));

        const thaiMonthsShort = [
            "มกรา", "กุมภา", "มีนา", "เมษา", "พฤษภา", "มิถุนา",
            "กรกฎา", "สิงหา", "กันยา", "ตุลา", "พฤศจิกา", "ธันวา"
        ];
        const day = actualOutDate.getDate();
        const month = thaiMonthsShort[actualOutDate.getMonth()];
        const year = actualOutDate.getFullYear() + 543;

        return `${day} ${month} ${year}`;
    };

    const [showmodalItem, setShowmodalItem] = useState(false);
    const closeModalItem = () => {
        setShowmodalItem(false);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50 ">
            {showmodalItem ? (
                <Modal_ReturnItem close={closeModalItem} data={data} />
            ) : null}
            <div className="w-[750px] h-[750px] rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-yellow-200 border-yellow-700 border-2">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4  text-yellow-700">
                    <div></div>
                    <h2 className="text-3xl font-bold">เช่าต่อ</h2>
                    <button
                        className="text-lg hover:text-red-300 transition"
                        onClick={close}
                    >
                        ✖
                    </button>
                </div>

                {/* Form Section */}
                <div className=" overflow-y-auto flex-grow">
                    {data && Array.isArray(data) && data.map((items, index) => (
                        <div className="grid grid-cols-3 gap-x-6 gap-y-6 " key={index}>

                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    สาขา :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    {items.branch_name}
                                </label>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    เลขที่ใบเสร็จ :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    {items.receip_number}
                                </label>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    นามลูกค้า/ชื่อบริษัท :
                                </label>
                            </div>
                            <div className=" col-span-2">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    {items.customer_name}
                                </label>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    วันที่เริ่มเช่า :
                                </label>
                            </div>
                            <div className=" col-span-2  flex items-center justify-between">
                                <label className="text-xl  text-gray-600 h-full  ">
                                    {/* แสดงวันที่เริ่มต้น */}
                                    {items.actual_out ? calculateNewDate(items.actual_out, 0) : "ไม่มีวันที่เริ่มต้น"}
                                    <label className="pl-10 pr-10 text-xl font-bold text-gray-600">ถึง</label>
                                    {/* แสดงวันที่สิ้นสุด */}
                                    {items.actual_out && items.date
                                        ? calculateNewDate(items.actual_out, items.date)
                                        : "ไม่มีวันที่สิ้นสุด"}
                                </label>

                            </div>

                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    วันที่ส่งคืนจริง :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <input type='date' className="w-[45%] h-10 px-4 border-2 border-gray-400 rounded-md" />

                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    จำนวนวัน :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    {items.date}  <label className="pl-5">วัน</label>
                                </label>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    รายการเช่าต่อ :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <button className="border-2 border-gray-400 pl-4 pr-4 pt-2 pb-2 rounded-md bg-slate-500 text-white"
                                    onClick={() => setShowmodalItem(true)}
                                >เลือกรายการ</button>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    สินค้าทั้งหมด :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    {items.products && Array.isArray(items.products)
                                        ? `${items.products.length}`
                                        : "ไม่มีข้อมูลสินค้า"}
                                    <label className="pl-5">รายการ</label>
                                </label>
                            </div>
                            <div className=" col-span-1  ">
                                <label className="text-xl font-bold text-gray-600    h-full flex items-center justify-end ">
                                    เช่าต่อ :
                                </label>
                            </div>
                            <div className=" col-span-2  ">
                                <label className="text-xl  text-gray-600 h-full flex items-center justify-start ">
                                    0  <label className="pl-5 pr-10">รายการ</label>
                                    <label className="pl-14 pr-5 text-xl font-bold text-gray-600 ">ส่งคืน :</label> 0 <label className="pl-5 ">รายการ</label>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6  flex justify-center ">
                    <button
                        className="px-6 py-3 text-white rounded-md text-lg font-medium transition w-1/4 bg-[#31AB31] hover:bg-green-600 active:bg-green-700"
                    >
                        ยืนยันเช่าต่อ
                    </button>

                </div>
            </div>
        </div>
    );
}
