import React, { useState } from "react";

function BranchSelector({ onSelectBranch }) {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [showEditIcons, setShowEditIcons] = useState(false);

  const handleSelectChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    onSelectBranch(branch); // ส่งค่าสาขาที่เลือกกลับไปยัง `Inventory`
  };

  const toggleEditIcons = () => {
    setShowEditIcons(!showEditIcons);
  };

  return (
    <div className="w-full h-[90%] bg-gray-100 flex items-center space-x-4 p-4">
      <div className="text-2xl">สาขา :</div>
      <select
        className="w-60 h-10 text-center bg-white border-2 border-black rounded-lg"
        onChange={handleSelectChange}
        value={selectedBranch}
      >
        <option value="all">ดูทั้งหมด</option>
        <option value="chonburi">สาขา ชลบุรี</option>
        <option value="samutsakhon">สาขา สมุทรสาคร</option>
        <option value="pathumthani">สาขา ปทุมธานี</option>
      </select>
      
      {/* ปุ่มแก้ไขสินค้าจะอยู่ข้างๆ select */}
      <button
        onClick={toggleEditIcons}  // Toggle internal state for edit icons
        className="h-10 px-4 bg-red-200 border border-black rounded-lg"
      >
        แก้ไขสินค้า
      </button>

      {/* Show the edit icons if showEditIcons is true */}
      {showEditIcons && (
        <div className="ml-4">
          <span>Icons for editing...</span>  {/* Example text, replace with actual icons */}
        </div>
      )}
    </div>
  );
}

export default BranchSelector;
