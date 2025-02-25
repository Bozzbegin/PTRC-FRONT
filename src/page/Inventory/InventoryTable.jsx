import React, { useState } from "react";
import axios from "axios";

function InventoryTable({ products, showEditIcons, onEditClick }) {
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนสินค้าที่แสดงในแต่ละหน้า

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // คำนวณช่วงข้อมูลที่จะแสดงในตาราง
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API ตาม id
  const fetchProductDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.195.75:5000/v1/product/list/compare/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
            "x-api-key": "p@tt@r@ch@i2k24",
          },
        }
      );

      if (response.data.code === 200) {
        setModalData(response.data.data);
        setModalOpen(true);
      } else {
        console.error("Error fetching product details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">ตารางสินค้าคงคลัง</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border">ลำดับ</th>
            <th className="px-4 py-2 border">สาขา</th>
            <th className="px-4 py-2 border">รหัสสินค้า</th>
            <th className="px-4 py-2 border">ชื่อสินค้า</th>
            <th className="px-4 py-2 border">ขนาด</th>
            <th className="px-4 py-2 border">จำนวน</th>
            <th className="px-4 py-2 border">ราคา 3 วัน</th>
            <th className="px-4 py-2 border">ราคา 30 วัน</th>
            {showEditIcons && <th className="px-4 py-2 border">แก้ไข</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className="odd:bg-gray-100 even:bg-white">
              <td className="px-4 py-2 border">{item.id}</td>
              <td className="px-4 py-2 border">{item.branchName}</td>
              <td className="px-4 py-2 border flex items-center">
                {item.code}
                <a href="#" onClick={() => fetchProductDetails(item.id)}>
                  <img
                    className="ms-3 mt-1 w-5 h-5 cursor-pointer"
                    src="https://cdn-icons-png.flaticon.com/512/2038/2038806.png"
                    alt="Details"
                  />
                </a>
              </td>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border">{item.size}</td>
              <td className="px-4 py-2 border flex ">{item.quantity}<img
                src="/imgoil/utr.png"
                alt="Edit Icon"
                className="w-6 h-6 cursor-pointer ms-2"
                onClick={() => {
                  onEditClick(item.id);
                }}
              />
              </td>
              <td className="px-4 py-2 border">{item.price3D}</td>
              <td className="px-4 py-2 border">{item.price30D}</td>


            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w- max-w-3xl shadow-lg">
            <h3 className="text-2xl font-semibold text-indigo-600 mb-6">
              เปรียบเทียบสินค้า
            </h3>

            {loading ? (
              <p className="text-center text-gray-500">กำลังโหลด...</p>
            ) : (
              <div className="space-y-6">
                {/* Product Samutsakhon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-400 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">สาขา</label>
                    <span className="text-gray-800">
                      {modalData.product_samutsakhon.branch}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">ชื่อสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_samutsakhon.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">รหัสสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_samutsakhon.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">ขนาด</label>
                    <span className="text-gray-800">
                      {modalData.product_samutsakhon.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-700">จำนวนคงเหลือ</label>
                    <span className="text-gray-800">
                      {modalData.product_samutsakhon.quantity}
                    </span>
                  </div>
                </div>

                {/* Product Chonburi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-500 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">สาขา</label>
                    <span className="text-gray-800">
                      {modalData.product_chonburi.branch}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">ชื่อสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_chonburi.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">รหัสสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_chonburi.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">ขนาด</label>
                    <span className="text-gray-800">
                      {modalData.product_chonburi.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">จำนวนคงเหลือ</label>
                    <span className="text-gray-800">
                      {modalData.product_chonburi.quantity}
                    </span>
                  </div>
                </div>

                {/* Product Pathumthani */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-400 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">สาขา</label>
                    <span className="text-gray-800">
                      {modalData.product_pathumthani.branch}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">ชื่อสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_pathumthani.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">รหัสสินค้า</label>
                    <span className="text-gray-800">
                      {modalData.product_pathumthani.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">ขนาด</label>
                    <span className="text-gray-800">
                      {modalData.product_pathumthani.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">จำนวนคงเหลือ</label>
                    <span className="text-gray-800">
                      {modalData.product_pathumthani.quantity}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <button
                className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-all"
                onClick={() => setModalOpen(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
