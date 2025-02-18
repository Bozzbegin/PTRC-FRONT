// src/components/NavStock.jsx
import React, { useState } from "react";
import EditModal from "./editModal"; // นำเข้า EditModal
import TableItem from "./tableStock"; // นำเข้า TableItem

export function NavStock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(""); // สถานะของสาขาที่เลือก
  const [productId, setProductId] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // สถานะสำหรับเก็บคำค้นหาจากช่องค้นหา

  // ฟังก์ชันเมื่อเลือกสินค้าจาก TableItem
  const onSelectProduct = (productId) => {
    setProductId(productId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false); // ปิด Modal
  };

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId); // เปลี่ยนสาขาที่เลือก
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // อัปเดตค่าคำค้นหาทุกครั้งที่ผู้ใช้กรอก
  };

  return (
    <div className="bg-white p-4 flex flex-col w-full space-y-4">
      {/* Select Box */}
      <div className="flex space-x-4 items-center">
        <select
          className="border p-2 rounded-md w-1/4 shadow-md"
          value={selectedBranch}
          onChange={(e) => handleBranchChange(e.target.value)}
        >
          <option value="">เลือกสาขาทั้งหมด</option>
          <option value="1">สมุทรสาคร(โคกขาม)</option>
          <option value="2">ชลบุรี(บ้านเก่า)</option>
          <option value="3">ปทุมธานี(นพวงศ์)</option>
        </select>

        <div className="w-1/4">
          <input
            className="border p-2 rounded-md w-full shadow-md"
            placeholder="ค้นหาประเภทสินค้า"
            type="text"
            value={searchQuery} // ผูกค่าของช่องค้นหากับ searchQuery
            onChange={handleSearchChange} // อัปเดตค่าของ searchQuery
          />
        </div>
      </div>

      {/* เรียกใช้ EditModal */}
      <EditModal
        isModalOpen={isModalOpen}
        handleClose={handleClose}
        id={productId} // ส่ง productId ไปที่ EditModal
        selectedBranch={selectedBranch}
      />

      {/* ส่ง handleBranchChange และ selectedBranch ไปยัง TableItem */}
      <div className="overflow-x-auto">
        <TableItem
          selectedBranch={selectedBranch}
          onSelectProduct={onSelectProduct}
          searchQuery={searchQuery} // ส่ง searchQuery ไปยัง TableItem
        />
      </div>
    </div>
  );
}

export default NavStock;
