import React, { useState } from "react";

export function Modal_Inbound({ close, confirm }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    size: "",
    meter: "",
    centimeter: "",
    price3D: "",
    price30D: "",
    price_sell: "",
    price_damage: "",
    unit: "",
    remark: "",
  });

  // ฟังก์ชัน handleChange สำหรับอัปเดตข้อมูลฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ตรวจสอบว่า field ที่มีดอกจันทั้งหมดถูกกรอกครบหรือไม่
  const isFormValid = () => {
    const requiredFields = [
      "code",
      "name",
      "price3D",
      "price30D",
      "price_damage",
    ];
    return requiredFields.every((field) => formData[field].trim() !== "");
  };

  const confirm_item = () => {
    // if (isFormValid()) {
    //   console.log(formData);
    //   confirm(formData);
    //   close();
    // }
    confirm(formData);
    close();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
      <div className="bg-white w-[700px] h-[700px] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-blue-400 text-white ">
          <h2 className="text-2xl font-bold ">รายละเอียดสินค้า</h2>
          <button
            className="text-lg hover:text-red-300 transition"
            onClick={close}
          >
            ✖
          </button>
        </div>

        {/* Form Section */}
        <div className="p-8 overflow-y-auto flex-grow">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {[
              { label: "รหัสสินค้า", name: "code", sub1: "*" },
              { label: "ชื่อสินค้า", name: "name", sub1: "*" },
              { label: "ขนาดสินค้า", name: "size" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lx text-gray-600 mb-2 font-bold">
                  <label className="text-red-500">{field.sub1}</label>{" "}
                  {field.label} :
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            {/* Custom Inputs for Meter and Centimeter */}
            <div className="flex items-center gap-x-4">
              <div className="flex-1">
                <label className="text-lx font-bold text-gray-600 mb-2 block">
                  เมตร :
                </label>
                <input
                  type="text"
                  name="meter"
                  value={formData.meter}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-gray-400 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex-1">
                <label className="text-lx font-bold text-gray-600 mb-2 block">
                  เซนติเมตร :
                </label>
                <input
                  type="text"
                  name="centimeter"
                  value={formData.centimeter}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {[
              { label: "ราคาเช่า 3 วัน", name: "price3D", sub1: "*" },
              { label: "ราคาเช่า 30 วัน", name: "price30D", sub1: "*" },
              { label: "ราคาขาย", name: "price_sell" },
              { label: "ราคาค่าปรับ", name: "price_damage", sub1: "*" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lx font-bold text-gray-600 mb-2">
                  <label className="text-red-500">{field.sub1}</label>{" "}
                  {field.label} :{" "}
                  
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
            {[
              { label: "หน่วย", name: "unit", sub: "(เช่น ท่อน แผ่น ชิ้น)" },
              { label: "หมายเหตุ", name: "remark" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lx font-bold text-gray-600 mb-2">
                  
                  {field.label} :{" "}
                  <label className="text-gray-500">{field.sub}</label>
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 flex justify-center border-t">
          <button
            className={` text-white rounded-md text-lg font-medium transition w-1/5  h-10  ${
              isFormValid()
                ? "bg-[#31AB31] hover:bg-green-600 active:bg-green-700 "
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={confirm_item}
            disabled={!isFormValid()} // ปุ่มจะถูก disable ถ้าไม่ valid
          >
            ยืนยัน
          </button>
          
        </div>
      </div>
    </div>
  );
}
