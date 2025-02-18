import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductReturn from "./Product_Returnbound.jsx";

export function Modal_ReturnGreen({ close, data }) {
  const [hasVat, setHasVat] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (data && data[0]?.id) {
      setSelectedProductId(data[0].id);
    }

  }, [data]);

  const resetState = () => {
    // รีเซตสถานะทั้งหมด
    setHasVat(true);
    setRemarks("");
    setIsSubmitting(false);
    setSelectedProductId(null);
  };

  const handleClose = () => {
    resetState(); // เรียกใช้ฟังก์ชันรีเซต
    close(); // ปิดโมดอล
  };

  const thaiMonthsShort = [
    "มกรา",
    "กุมภา",
    "มีนา",
    "เมษา",
    "พฤษภา",
    "มิถุนา",
    "กรกฎา",
    "สิงหา",
    "กันยา",
    "ตุลา",
    "พฤศจิกา",
    "ธันวา",
  ];

  const calToThaiDate = (actualOut, daysToAdd) => {
    if (!actualOut) {
      return "วันที่ไม่พร้อมใช้งาน";
    }
    const actualOutDate = new Date(actualOut);
    const tempDate = new Date(actualOut);
    tempDate.setDate(tempDate.getDate() + parseInt(daysToAdd, 10));

    const oldDay = actualOutDate.getDate();
    const oldMonth = thaiMonthsShort[actualOutDate.getMonth()];
    const oldYear = actualOutDate.getFullYear() + 543;

    const newDay = tempDate.getDate();
    const newMonth = thaiMonthsShort[tempDate.getMonth()];
    const newYear = tempDate.getFullYear() + 543;

    return `${newDay} ${newMonth} ${newYear}`;
  };

  const calculateNewDate = (actualOut, daysToAdd) => {
    if (!actualOut) {
      return "วันที่ไม่พร้อมใช้งาน";
    }

    const actualOutDate = new Date(actualOut);
    const tempDate = new Date(actualOut);
    tempDate.setDate(tempDate.getDate() + parseInt(daysToAdd, 10) + 1);

    const newDay = tempDate.getDate();
    const newMonth = thaiMonthsShort[tempDate.getMonth()];
    const newYear = tempDate.getFullYear() + 543;

    return `${newDay} ${newMonth} ${newYear}`;
  };

  const handleVatChange = (e) => {
    setHasVat(e.target.value === "true");
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const today = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("th-TH", options);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
      <div className="w-4/6 h-5/6 rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-gray-100 border-2">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-green-700">
          <h2 className="text-3xl font-bold"></h2>
          <h2 className="text-3xl font-bold">คืนสินค้า</h2>
          <button
            className="text-lg hover:text-red-300 transition"
            onClick={handleClose} // ใช้ฟังก์ชัน handleClose
          >
            ✖
          </button>
        </div>

        {/* Form Section */}
        <div className="overflow-y flex-grow">
          {data && Array.isArray(data) && data.map((items, index) => (
            <div className="flex flex-wrap gap-6" key={index}>
              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  สาขา:
                </label>
                <label className="text-xl text-gray-600 flex items-center justify-start ml-2">
                  {items.branch_name}
                </label>
              </div>

              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  เลขที่ใบเสร็จ:
                </label>
                <label className="text-xl text-gray-600 flex items-center justify-start ml-2">
                  {items.receip_number}
                </label>
              </div>

              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  นามลูกค้า/ชื่อบริษัท:
                </label>
                <label className="text-xl text-gray-600 flex items-center justify-start ml-2">
                  {items.customer_name}
                </label>
              </div>

              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  วันที่ส่งของ:
                </label>
                <label className="text-xl text-gray-600 flex items-center justify-start ml-2">
                  {items.actual_out ? calToThaiDate(items.actual_out, 0) : "ไม่มีวันที่ส่งของ"}
                </label>
              </div>

              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  วันที่เริ่มเช่า:
                </label>
                <label className="text-xl text-gray-600 flex items-center justify-start ml-2">
                  {items.actual_out ? calculateNewDate(items.actual_out, 0) : "ไม่มีวันที่เริ่มต้น"}
                  <span className="px-4">ถึง</span>
                  {items.actual_out && items.date ? calculateNewDate(items.actual_out, items.date - 1) : "ไม่มีวันที่สิ้นสุด"}
                  <span>(เช่า {items.date} วัน)</span>
                </label>
              </div>

              <div className="flex w-full ml-16 ">
                <label className="text-xl font-bold text-gray-600 flex items-center justify-start">
                  วันที่ลูกค้าคืนของ:
                </label>
                <div className="border-2 border-gray-400 rounded-md w-4/12 h-10 flex justify-center items-center text-lg pl-4 bg-white ml-2">
                  {formattedDate}
                  {items.status == 'late' ? <>
                  <div className="bg-red-400 ml-3 w-2/4 flex justify-center rounded-md">
                  เลยกำหนด
                  </div>
                </> : ""}
                </div>
              </div>
            </div>
          ))}
          <div className="bg-transparent">
            {selectedProductId && <ProductReturn id={selectedProductId} />}
          </div>
        </div>

      </div>
    </div>
  );
}
