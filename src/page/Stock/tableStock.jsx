import { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "./EditModal"; // Import Modal
import EditModall from "./editModal_copy"; // Import Modal

export function TableItem({
  selectedBranch,
  onSelectProduct,
  searchQuery,
}) {
  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // 📌 **อัปเดตฟังก์ชันให้รองรับโครงสร้างข้อมูลใหม่**
  const fetchProductDetails = async (branchId) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
  
      let url = "http://192.168.195.75:5000/v1/product/stock/all";
      if (branchId && branchId !== "") {
        url = `http://192.168.195.75:5000/v1/product/stock/product-bybranch/${branchId}`;
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      });
  
      if (!response.data || !response.data.data) {
        throw new Error("Invalid API response");
      }
  
      const responseData = response.data.data;
  
      let allProductDetails = [];
  
      if (Array.isArray(responseData)) {
        // 🔹 Case: `product-bybranch` returns an array
        allProductDetails = responseData.map((item) => ({
          ...item,
          branch_name: branchId === "1" ? "สมุทรสาคร (โคกขาม)"
            : branchId === "2" ? "ชลบุรี (บ้านเก่า)"
            : branchId === "3" ? "ปทุมธานี (นพวงศ์)"
            : "ไม่ทราบสาขา",
        }));
      } else {
        // 🔹 Case: `all-product` returns an object with branch keys
        const { product_samutsakhon, product_chonburi, product_pathumthani } = responseData;
        
        allProductDetails = [
          ...(product_samutsakhon || []).map((item) => ({ ...item, branch_name: "สมุทรสาคร (โคกขาม)" })),
          ...(product_chonburi || []).map((item) => ({ ...item, branch_name: "ชลบุรี (บ้านเก่า)" })),
          ...(product_pathumthani || []).map((item) => ({ ...item, branch_name: "ปทุมธานี (นพวงศ์)" })),
        ];
      }
  
      setProductDetails(allProductDetails);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProductDetails(selectedBranch);
  }, [selectedBranch]);

  const openModal = (productId, branchId) => {
    setSelectedProductId(productId);
    setSelectedBranchId(branchId);
    setIsModalOpen1(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen1(false);
    setSelectedProductId(null);
  };

  // 📌 **ฟังก์ชันกรองสินค้าตามคำค้นหา**
  const filteredProducts = productDetails.filter((product) => {
    return (
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (error)
    return <div className="text-center text-red-600">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">รายการสินค้า</h3>
      <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
        <table className="w-full table-auto border-collapse border shadow-sm">
          <thead className="bg-blue-200 text-blue-900 w-96 h-14">
            <tr>
              <th className="border p-2 text-center rounded-tl-lg rounded-br-sm">ลำดับที่</th>
              <th className="border p-2 text-center">สาขา</th>
              <th className="border p-2 text-center">รหัสสินค้า</th>
              <th className="border p-2 text-center">ชื่อสินค้า</th>
              <th className="border p-2 text-center">ขนาด</th>
              <th className="border p-2 text-center">จำนวนตั้งต้น</th>
              <th className="border p-2 text-center">จำนวนยอดจอง</th>
              <th className="border p-2 text-center">จำนวนที่ส่งออก</th>
              <th className="border p-2 text-center">จำนวนคงเหลือ</th>
              <th className="border p-2 text-center">เปรียบเทียบสินค้า</th>
              <th className="border p-2 text-center rounded-tr-lg rounded-br-sm">เพิ่มสินค้า</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-600">
                  ไม่มีข้อมูลสินค้าที่จะแสดง
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={`${product.product_id}-${index}`}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{product.branch_name}</td>
                  <td className="border p-2 text-center">{product.product_code || "-"}</td>
                  <td className="border p-2 text-center">{product.product_name || "-"}</td>
                  <td className="border p-2 text-center">{product.product_size || "-"}</td>
                  <td className="border p-2 text-center">{product.product_quantity || 0}</td>
                  <td className="border p-2 text-center text-red-700">
                    {product.total_reserved_quantity !== null ? product.total_reserved_quantity : 0}
                  </td>
                  <td className="border p-2 text-center">{0}</td>
                  <td className="border p-2 text-center">{product.product_quantity || 0}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                      onClick={() => onSelectProduct(product.product_id)}
                    >
                      เลือก
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-800"
                      onClick={() => openModal(product.product_id, product.product_branch)}
                    >
                      เพิ่ม <i className="fa-solid fa-prescription-bottle-medical"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditModal
        isModalOpen={isModalOpen}
        handleClose={closeModal}
        id={selectedProductId}
      />
      <EditModall
        isModalOpen={isModalOpen1}
        handleClose={closeModal}
        id={selectedProductId}
        branch_id={selectedBranchId}
      />
    </div>
  );
}

export default TableItem;
