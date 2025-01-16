import React, { useState } from "react";
import axios from "axios";
import ProductReturn from "./Product_Returnbound.jsx";

export function Modal_ReturnGreen({ close, data }) {
  const [hasVat, setHasVat] = useState(true); // สำหรับการเลือกว่ามี VAT หรือไม่
  const [remarks, setRemarks] = useState(""); // สำหรับเก็บหมายเหตุ
  const [isSubmitting, setIsSubmitting] = useState(false); // สำหรับแสดงสถานะการส่งข้อมูล
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับการเปิด/ปิด modal สำหรับดูรายการ
  const [selectedProductId, setSelectedProductId] = useState(null); // สำหรับเก็บ ID ของสินค้าที่เลือก

  const openProductReturnModal = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeProductReturnModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null); // เคลียร์ ID เมื่อปิด modal
  };

  const handleVatChange = (e) => {
    // เปลี่ยนสถานะ VAT
    setHasVat(e.target.value === "true");
  };

  const handleRemarksChange = (e) => {
    // เปลี่ยนข้อความในหมายเหตุ
    setRemarks(e.target.value);
  };

  const handleSubmit = async (id) => {
    if (!data || !data[0]?.receip_number) {
      alert("ไม่พบข้อมูลใบเสร็จ");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const url = `http://localhost:8000/v1/product/return/return-status`;
      const response = await axios.post(
        url,
        {
          id: id, // ส่ง id ของสินค้าที่เลือกไปด้วย
          receipt_number: data[0].receip_number,
          has_defects: hasVat,
          description: remarks,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        }
      );

      if (response.data.code === 200) {
        alert("ส่งคืนสินค้าเรียบร้อยแล้ว");
        close(); // ปิด Modal หลัก
      } else {
        throw new Error(
          response.data.message || "เกิดข้อผิดพลาดในการส่งคืนสินค้า"
        );
      }
    } catch (error) {
      console.error("Error returning product:", error);
      alert("เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถส่งคืนสินค้าได้"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const calToThaiDate = (actualOut, daysToAdd) => {
    if (!actualOut) {
      return "วันที่ไม่พร้อมใช้งาน";
    }
    const actualOutDate = new Date(actualOut);
    const tempDate = new Date(actualOut);
    tempDate.setDate(tempDate.getDate() + parseInt(daysToAdd, 10));

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
    const oldDay = actualOutDate.getDate();
    const oldMonth = thaiMonthsShort[actualOutDate.getMonth()];
    const oldYear = actualOutDate.getFullYear() + 543;
    return `${oldDay} ${oldMonth} ${oldYear}`;
  };

  const calculateNewDate = (actualOut, daysToAdd) => {
    if (!actualOut) {
      return "วันที่ไม่พร้อมใช้งาน";
    }

    const actualOutDate = new Date(actualOut);
    const tempDate = new Date(actualOut);
    tempDate.setDate(tempDate.getDate() + parseInt(daysToAdd, 10) + 1); // เพิ่ม 1 วัน

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

    const oldDay = actualOutDate.getDate();
    const oldMonth = thaiMonthsShort[actualOutDate.getMonth()];
    const oldYear = actualOutDate.getFullYear() + 543;

    const newDay = tempDate.getDate();
    const newMonth = thaiMonthsShort[tempDate.getMonth()];
    const newYear = tempDate.getFullYear() + 543;

    return `${newDay} ${newMonth} ${newYear}`;
  };

  const today = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("th-TH", options);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
      <div className="w-[750px] h-[750px] rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-green-200 border-green-700 border-2">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-green-700">
          <div></div>
          <h2 className="text-3xl font-bold">คืนสินค้า</h2>
          <button
            className="text-lg hover:text-red-300 transition"
            onClick={close}
          >
            ✖
          </button>
        </div>

        {/* Form Section */}
        <div className="overflow-y-auto flex-grow">
          {data &&
            Array.isArray(data) &&
            data.map((items, index) => (
              <div className="grid grid-cols-3 gap-x-6 gap-y-6" key={index}>
                {/* Branch Name */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    สาขา:
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-xl text-gray-600 h-full flex items-center justify-start">
                    {items.branch_name}
                  </label>
                </div>

                {/* Receipt Number */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    เลขที่ใบเสร็จ:
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-xl text-gray-600 h-full flex items-center justify-start">
                    {items.receip_number}
                  </label>
                </div>

                {/* Customer Name */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    นามลูกค้า/ชื่อบริษัท:
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-xl text-gray-600 h-full flex items-center justify-start">
                    {items.customer_name}
                  </label>
                </div>

                {/* Date Out */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    วันที่ส่งของ :
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-xl text-gray-600 h-full flex items-center justify-start">
                    {items.actual_out
                      ? calToThaiDate(items.actual_out, 0)
                      : "ไม่มีวันที่ส่งของ"}
                  </label>
                </div>

                {/* Rental Dates */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    วันที่เริ่มเช่า:
                  </label>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <label className="text-xl text-gray-600 h-full">
                    {items.actual_out
                      ? calculateNewDate(items.actual_out, 0)
                      : "ไม่มีวันที่เริ่มต้น"}
                    <label className="pl-10 pr-10 text-xl font-bold text-gray-600">
                      ถึง
                    </label>
                    {items.actual_out && items.date
                      ? calculateNewDate(items.actual_out, items.date)
                      : "ไม่มีวันที่สิ้นสุด"}
                  </label>
                </div>

                {/* Return Date */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    วันที่ลูกค้าคืนของ :
                  </label>
                </div>
                <div className="col-span-2">
                  <div className="border-2 border-gray-400 rounded-md w-[70%] h-10 flex justify-start items-center text-lg pl-4 bg-white">
                    {formattedDate}
                  </div>
                </div>

                {/* Defects */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-center justify-end">
                    ตรวจสอบตำหนิสินค้า:
                  </label>
                </div>
                <div className="col-span-2">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={hasVat}
                    value="true"
                    onChange={handleVatChange}
                  />
                  <label>ปกติ</label>
                  <input
                    type="radio"
                    className="mr-2 ml-2"
                    checked={!hasVat}
                    value="false"
                    onChange={handleVatChange}
                  />
                  <label>เสียหาย</label>
                </div>

                {/* Remarks */}
                <div className="col-span-1">
                  <label className="text-xl font-bold text-gray-600 h-full flex items-start justify-end">
                    หมายเหตุ:
                  </label>
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-[70%] h-40 px-4 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={remarks}
                    onChange={handleRemarksChange}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="p-6 flex justify-center gap-4">
          <div>
            {/* ปุ่มเพื่อเปิด/ปิด Modal */}
            <button
              onClick={() => {
                if (isModalOpen) {
                  // หาก modal เปิดอยู่, ให้ปิด modal
                  closeProductReturnModal();
                  setIsModalOpen(false); // ปิด modal
                } else {
                  // หาก modal ปิดอยู่, ให้เปิด modal
                  openProductReturnModal(data[0]?.id);
                  setIsModalOpen(true); // เปิด modal
                }
              }}
              
              className="px-6 py-3 w-full text-white rounded-md text-lg font-semibold transition-all duration-300 transform bg-red-500 hover:bg-red-700 active:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "กำลังเปิดดูรายการ..."
                : isModalOpen
                ? "ปิดรายการ"
                : "เปิดดูรายการ"}
            </button>

            {/* แสดง Modal เมื่อเปิด */}
            {isModalOpen && selectedProductId && (
              <ProductReturn
                id={selectedProductId}
                close={() => {
                  // ฟังก์ชันปิด modal
                  closeProductReturnModal();
                  setIsModalOpen(false); // ปิด modal
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

}

