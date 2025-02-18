import { useState, useEffect } from "react";
import axios from "axios";

export function TableItem({
  selectedBranch,
  onSelectAction, // เปลี่ยนชื่อให้เหมาะสม
}) {
  
  const [listAction, setListAction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [branchId, setBranchId] = useState(selectedBranch || ""); // เก็บ branchId
  const [actionType, setActionType] = useState(""); // เก็บประเภทการดำเนินการ
  const [dateFilter, setDateFilter] = useState(""); // เก็บวันที่สำหรับการค้นหา

  const fetchListAction = async (branchId, actionType, dateFilter) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      let url = "http://192.168.195.75:5000/v1/product/list/all-action";

      if (branchId || actionType || dateFilter) {
        const params = new URLSearchParams();
        if (branchId) params.append("branchId", branchId);
        if (actionType) params.append("actionType", actionType);
        if (dateFilter) params.append("date", dateFilter);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      });

      if (response.data && response.data.data) {
        setListAction(response.data.data);
      } else {
        throw new Error("Data is not in expected format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListAction(branchId, actionType, dateFilter);
  }, [branchId, actionType, dateFilter]);

  const handleBranchChange = (event) => {
    setBranchId(event.target.value); // อัปเดต branchId
  };

  const handleActionTypeChange = (event) => {
    setActionType(event.target.value); // อัปเดต actionType
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value); // อัปเดตวันที่
  };

  if (isLoading)
    return <div className="text-center text-gray-600">กำลังโหลดข้อมูล...</div>;
  if (error)
    return (
      <div className="text-center text-red-600">เกิดข้อผิดพลาด: {error}</div>
    );

  // ฟังก์ชันในการแปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // คืนค่าวันที่ในรูปแบบ YYYY-MM-DD
  };

  // กรองข้อมูลให้ตรงกับวันที่เลือก
  const filteredListAction = listAction.filter((action) => {
    const actionDate = formatDate(action.date_action);
    if (dateFilter) {
      return actionDate === dateFilter; // เปรียบเทียบวันที่
    }
    return true; // ถ้าไม่มีวันที่เลือกจะไม่กรอง
  });

  return (
    <div className="space-y-4">
      {/* กล่องเลือกสาขา, ประเภทการดำเนินการ และวันที่ */}
      <div className="flex items-center space-x-4">
        <label htmlFor="branch-select" className="text-gray-700 font-semibold text-lg">
          เลือกสาขา:
        </label>
        <select
          id="branch-select"
          value={branchId}
          onChange={handleBranchChange}
          className="border border-gray-300 p-2 rounded-md w-54"
        >
          <option value="">ทั้งหมด</option>
          <option value="1">สมุทรสาคร (โคกขาม)</option>
          <option value="2">ชลบุรี (บ้านเก่า)</option>
          <option value="3">ปทุมธานี (นพวงศ์)</option>
        </select>

        <label htmlFor="action-select" className="text-gray-700 font-semibold text-lg">
          ประเภทการดำเนินการ:
        </label>
        <select
          id="action-select"
          value={actionType}
          onChange={handleActionTypeChange}
          className="border border-gray-300 p-2 rounded-md w-52"
        >
          <option value="">ทั้งหมด</option>
          <option value="create">เช่า</option>
          <option value="update">ขาย</option>
          <option value="delete">จอง</option>
        </select>

        <label htmlFor="date-select" className="text-gray-700 font-semibold text-lg">
          วันที่ทำรายการ:
        </label>
        <input
          type="date"
          id="date-select"
          value={dateFilter}
          onChange={handleDateChange}
          className="border border-gray-300 p-2 rounded-md w-52"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">รายการการดำเนินการ</h3>
      <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
        <table className="w-full table-auto border-collapse border shadow-sm">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="border p-2 rounded-tl-md">ลำดับที่</th>
              <th className="border p-2">สาขา</th>
              <th className="border p-2">รายการการดำเนินการ</th>
              <th className="border p-2">วันที่ทำรายการ</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2">ผู้ทำรายการ</th>
              <th className="border p-2">เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {filteredListAction.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-600 ">
                  ไม่มีข้อมูลที่จะแสดง
                </td>
              </tr>
            ) : (
              filteredListAction.map((action, index) => (
                <tr key={`${action.id}-${index}`}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{action.branch_name}</td>
                  <td className="border p-2">{action.action === 'return' ? 'ส่งคืนสินค้า' : action.action === 'update' ? 'อัพเดทสินค้า' : "-"}</td>
                  <td className="border p-2">{action.date_action || "-"}</td>
                  <td className="border p-2">{action.description || "-"}</td>
                  <td className="border p-2 text-center">{action.first_name || "-"}</td>
                  <td className="flex justify-center items-center border p-1">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                      onClick={() => onSelectAction(action.id)}
                    >
                      เลือก
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableItem;
