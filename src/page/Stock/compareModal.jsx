import { useState, useEffect } from "react";
import axios from "axios";

function EditModal({ isModalOpen, handleClose, id }) {
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newQuantity, setNewQuantity] = useState(""); // สำหรับเพิ่มจำนวนสินค้า
  const [isSubmitting, setIsSubmitting] = useState(false); // แสดงสถานะการบันทึกข้อมูล

  const fetchProductDetails = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token not found");

      const url = `http://192.168.195.75:5000/v1/product/stock/compare/${id}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_X_API_KEY,
        },
      });

      if (response.data.code === 200) {
        setProductDetails(response.data.data);
        
      } else {
        throw new Error(response.data.message || "Error fetching product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    setNewQuantity(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token not found");

      const url = `http://192.168.195.75:5000/v1/product/stock/update/${id}`;

      const response = await axios.post(
        url,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
           "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        }
      );

      if (response.data.code === 200) {
        alert("อัปเดตจำนวนสินค้าเรียบร้อยแล้ว");
        fetchProductDetails(id); // ดึงข้อมูลใหม่หลังจากอัปเดต
        setNewQuantity(""); // ล้างค่าในฟอร์ม
      } else {
        throw new Error(response.data.message || "Error updating product quantity");
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  if (!isModalOpen) return null;

  

  if (error) {
    return <div className="text-center text-red-500 p-6">เกิดข้อผิดพลาด: {error}</div>;
  }

  if (!productDetails) {
    return <div className="text-center p-6">ไม่มีข้อมูลสินค้า</div>;
  }

  const { product_samutsakhon } = productDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50">
      <div className="bg-white p-6 rounded-md w-3/4 mt-64 ml-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">เพิ่มจำนวนสินค้า</h2>

        <table className="border-collapse w-full text-sm">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="border p-3 text-center rounded-tl-md">รหัสสินค้า</th>
              <th className="border p-3 text-center">ชื่อสินค้า</th>
              <th className="border p-3 text-center rounded-tr-md">ขนาดสินค้า</th>
              <th className="border p-3 text-center rounded-tr-md">จำนวนสินค้า</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center odd:bg-gray-100 even:bg-gray-50">
              <td className="border p-3">{product_samutsakhon.code || "-"}</td>
              <td className="border p-3">{product_samutsakhon.name || "-"}</td>
              <td className="border p-3">{product_samutsakhon.size || "-"}</td>
              <td className="border p-3">{product_samutsakhon.quantity || "-"}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <input
            type="number"
            value={newQuantity}
            onChange={handleQuantityChange}
            className="border rounded-md p-2 w-full mb-3"
            placeholder="กรอกจำนวนสินค้า"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition mr-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
          <button
            onClick={handleClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            ปิ
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
