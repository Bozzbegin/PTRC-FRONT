import React, { useEffect, useState } from "react";

export function ModalDiscount({ close, confirm }) {

  const [formData, setFormData] = useState({
    shipping_cost: 0,
    move_price: 0,
    discount: 0,
    guarantee_price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const confirm_item = () => {
    close(formData);
  };

  if (!confirm) { null; }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
      <div className="bg-white w-[700px] h-[380px] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-blue-400 text-white ">
          <h2 className="text-xl font-bold ">กรอกข้อมูลส่วนลดเพิ่มเติม</h2>
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
              { label: "ค่าขนส่งไป-กลับ", name: "shipping_cost" },
              { label: "ค่าบริการเคลื่อนย้ายสินค้า", name: "move_price" },
              { label: "ส่วนลด", name: "discount" },

            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lx text-gray-600 mb-2 font-bold">
                  {field.label} :
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            {[
              { label: "ค่าประกันสินค้า", name: "guarantee_price" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lx font-bold text-gray-600 mb-2">
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

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 flex justify-center border-t">
          <button
            className={` text-white rounded-md text-lg font-medium transition w-1/5  h-10 bg-[#31AB31] hover:bg-green-600 active:bg-green-700`}
            onClick={confirm_item}
          >
            ยืนยัน
          </button>

        </div>
      </div>
    </div>
  );
}
