import React, { useState, useEffect } from "react";

const EditModal = ({ isOpen, toggleModal, id }) => {

  const [itemData, setItemData] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าโดยใช้ id
  useEffect(() => {
    // if (id) {
    // ทำการดึงข้อมูลของสินค้าที่ต้องการแก้ไขจาก ID (สามารถใช้ API หรือข้อมูลจาก props)
    // ตัวอย่าง: setItemData(fetchDataById(id));
    setItemData({
      id: id,
      name: "ตัวอย่างสินค้า", // เปลี่ยนเป็นข้อมูลจริงจากฐานข้อมูล
      price: 100, // เปลี่ยนเป็นข้อมูลจริง
    });
    // }
  }, [id]);

  // if (isOpen || itemData) return null;
  // console.log("ค่าส่งมาจากปุ่ม Edit"itemData.id);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">เพิ่ม ลดสินค้า</h2>

        {/* ฟอร์มแก้ไขสินค้า */}
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">ID:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={itemData.id}
              onChange={(e) => setItemData({ ...itemData, id: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">ชื่อสินค้า:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={itemData.name}
              onChange={(e) =>
                setItemData({ ...itemData, name: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">ราคา:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={itemData.price}
              onChange={(e) =>
                setItemData({ ...itemData, price: e.target.value })
              }
            />
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
              onClick={toggleModal}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
