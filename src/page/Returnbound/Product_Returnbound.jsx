import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // เพิ่ม SweetAlert
import axios from "axios";

export default function ProductReturn({ id }) {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState({});
  const [outboundId, setOutboundId] = useState(null);

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://192.168.195.75:5000/v1/product/return/product/${id}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              "x-api-key": "1234567890abcdef",
            },
          }
        );

        const data = response.data;

        if (data.status) {
          setOutboundId(data.option.outbound_id);
          setProductData(data.option.products);
          setReturnData(
            data.option.products.reduce((acc, product) => {
              acc[product.product_id] = { return_quantity: 0, return_all: false };
              return acc;
            }, {})
          );
        } else {
          setError("ไม่พบข้อมูลสินค้า");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // อัปเดตค่า return_quantity หรือ return_all
  const handleInputChange = (productId, field, value) => {
    setReturnData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  // Function to check if any product has been selected for return
  const isAnyProductSelected = () => {
    return Object.values(returnData).some(
      (product) => product.return_quantity > 0 || product.return_all
    );
  };

  // ส่งข้อมูลคืนสินค้าไปยัง API
  const handleReturnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        outbound_id: outboundId,
        // branch_id: 1,
        returns: Object.keys(returnData).map((productId) => ({
          product_id: parseInt(productId),
          return_quantity: parseInt(returnData[productId].return_quantity),
          return_all: returnData[productId].return_all,
        }))
      };

      const response = await axios.post(
        "http://192.168.195.75:5000/v1/product/return/return-product",
        payload,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        }
      );

      const data = response.data;

      if (data.status) {
        // แสดง SweetAlert เมื่อคืนสินค้าสำเร็จ
        Swal.fire({
          title: "สำเร็จ!",
          text: "คืนสินค้าสำเร็จแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload(); // รีโหลด modal
        });
      } else {
        throw new Error(data.msg || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error("Error submitting return data:", err);
      // แสดง SweetAlert เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: "ข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการคืนสินค้า",
        icon: "error",
        confirmButtonText: "ลองใหม่อีกครั้ง",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-center mb-6">รายละเอียดสินค้า</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ชื่อสินค้า</th>
            <th className="px-4 py-2">รหัสสินค้า</th>
            <th className="px-4 py-2">ยืมไป</th>
            <th className="px-4 py-2">เหลือคืน</th>
            <th className="px-4 py-2">คืนทั้งหมด</th>
            <th className="px-4 py-2">จำนวนที่คืน</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product) => (
            <tr key={product.product_id}>
              <td className="px-4 py-2">{product.product_name}</td>
              <td className="px-4 py-2">{product.code}</td>
              <td className="px-4 py-2">{product.borrowed_quantity}</td>
              <td className="px-4 py-2">{product.remaining_quantity}</td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={returnData[product.product_id]?.return_all || false}
                  onChange={(e) =>
                    handleInputChange(product.product_id, "return_all", e.target.checked)
                  }
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={returnData[product.product_id]?.return_quantity || 0}
                  min="0"
                  max={product.remaining_quantity}
                  disabled={returnData[product.product_id]?.return_all}
                  onChange={(e) =>
                    handleInputChange(product.product_id, "return_quantity", e.target.value)
                  }
                  className="border rounded px-2 py-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-center">
        <button
          onClick={handleReturnSubmit}
          className={`px-6 py-2 text-white rounded-lg transition-all ${
            isAnyProductSelected() ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={!isAnyProductSelected()}
        >
          คืนสินค้า
        </button>
      </div>
    </div>
  );
}

