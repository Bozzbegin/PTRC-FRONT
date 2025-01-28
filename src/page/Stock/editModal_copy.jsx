import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function EditModal({ isModalOpen, handleClose, id, branch_id }) {
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [changedFields, setChangedFields] = useState({});

  const thaiLabels = {
    code: "รหัสสินค้า",
    name: "ชื่อสินค้า",
    quantity: "จำนวนปัจจุบัน",
    description: "หมายเหตุ",
    size: "ขนาด",
    centimeter: "เซนติเมตร",
    meter: "เมตร",
    price3D: "ราคา 3 วัน",
    price30D: "ราคา 30 วัน",
    price_damage: "ค่าปรับ",
    status: "สถานะ",
    remark: "หมายเหตุ",
    price_sell: "ราคาขาย",
    unit: "หน่วย",
    quantityIcrease: "เพิ่มจำนวนสินค้า",
    quantityDecrease: "ลดจำนวนสินค้า"
  };
  const [formData, setFormData] = useState({
    branch: "",
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
    description: "",
    quantities: "",
    quantityIcrease: 0,
    quantityDecrease: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductDetails = async (id, branch_id) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token not found");

      const url = `http://192.168.195.75:5000/v1/product/stock/product/${id}/${branch_id}`;
      console.log("Fetching URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      });

      if (response.data.code === 200) {
        const selectedData = response.data.data;
        setProductDetails(selectedData);
        setFormData({
          code: selectedData.code || "",
          name: selectedData.name || "",
          size: selectedData.size || "",
          meter: selectedData.meter || "",
          centimeter: selectedData.centimeter || "",
          price3D: selectedData.price3D || "",
          price30D: selectedData.price30D || "",
          price_sell: selectedData.price_sell || "",
          price_damage: selectedData.price_damage || "",
          unit: selectedData.unit || "",
          remark: selectedData.remark || "",
          description: "",
          quantity: selectedData.quantity || "", // เปลี่ยนจาก quantities เป็น quantity
          quantityIcrease: 0,
          quantityDecrease: 0,
          status: selectedData.status || true,
        });
      } else {
        throw new Error(response.data.message || "Error fetching product details");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // เช็คว่าค่าใหม่ต่างจากค่าเดิมหรือไม่
    setChangedFields(prev => ({
      ...prev,
      [name]: value !== productDetails[name]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      // ตรวจสอบค่าที่ว่างใน formData และแทนด้วยค่าเดิมจาก productDetails
      const payload = {};
      Object.keys(formData).forEach(key => {
        // เช็คว่าค่าใน formData ต่างจากค่าใน productDetails หรือไม่
        if (formData[key] !== "" &&
          formData[key] !== null &&
          formData[key] !== productDetails[key]) {
          payload[key] = formData[key];
        }
      });
      if (Object.keys(payload).length === 0) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: "ไม่มีข้อมูลที่ถูกเปลี่ยนแปลง",
          icon: "info",
          confirmButtonText: "ตกลง",
        });
        setIsSubmitting(false);
        return;
      }
      const url = `http://192.168.195.75:5000/v1/product/stock/update/${id}/${branch_id}`;
      console.log("Submitting to URL:", url);
      console.log("Payload:", payload);

      const response = await axios.put(url, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      });

      if (response.data.code === 200) {
        Swal.fire({
          title: "สำเร็จ",
          text: "อัปเดตสินค้าเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload(); // รีเฟรชหน้าเว็บหลังจากกดตกลง
        });
      } else {
        throw new Error(response.data.message || "Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการอัปเดตสินค้า",
        icon: "error",
        confirmButtonText: "ลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (id && branch_id) {
      fetchProductDetails(id, branch_id);
    }
  }, [id, branch_id]);

  if (!isModalOpen) return null;



  if (error) {
    return <div className="text-center text-red-500 p-6">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          แก้ไขสินค้า
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-semibold text-gray-700 capitalize mb-1">
                {thaiLabels[key] || key}
              </label>
              {key === 'status' ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={`
          border rounded-md p-3 w-full shadow-sm 
          focus:ring-2 focus:ring-blue-500 transition
          ${changedFields[key] ? 'border-2 border-yellow-500 bg-yellow-50' : 'border-gray-300'}
        `}
                >
                  <option value={true}>เปิดใช้งาน</option>
                  <option value={false}>ปิดใช้งาน</option>
                </select>
              ) : (
                <input
                  type={['price3D', 'price30D', 'price_sell', 'price_damage', 'quantityIcrease', 'quantityDecrease'].includes(key) ? 'number' : 'text'}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className={`
          border rounded-md p-3 w-full shadow-sm 
          focus:ring-2 focus:ring-blue-500 transition
          ${changedFields[key] ? 'border-2 border-yellow-500 bg-yellow-50' : 'border-gray-300'}
          ${key === "quantity" ? 'bg-gray-100' : ''}
        `}
                  readOnly={key === "quantity"}
                />
              )}
              {changedFields[key] && (
                <small className="text-yellow-600 mt-1">
                  ค่าเดิม: {productDetails[key]}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
            disabled={isSubmitting || !Object.values(changedFields).some(Boolean)}
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditModal;
