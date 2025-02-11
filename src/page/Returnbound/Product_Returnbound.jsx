import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProductReturn({ id }) {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState({});
  const [outboundId, setOutboundId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id || hasFetched) return;

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

          const normalProducts = data.option.return_logs.map((log) => ({
            id: log.product_id,
            type: "normal",
            product_name: log.product_name || "สินค้า",
            code: log.code,
            borrowed_quantity: log.borrowed_quantity,
            remaining_quantity: log.borrowed_quantity - log.return_quantity - log.return_damage,
            unit: log.unit
          }));

          // เช็คว่า return_assemble_logs เป็น null หรือไม่
          const assembledProducts = data.option.return_assemble_logs
            ? data.option.return_assemble_logs.map((log) => ({
              id: log.assemble_id,
              type: "assemble",
              assemble_name: log.assemble_name || `สินค้าประกอบ ID: ${log.assemble_id}`,
              borrowed_quantity: log.assemble_quantity_borrow,
              remaining_quantity: log.assemble_quantity_borrow - log.assemble_quantity_return,
              descriptionASM: log.description || "ไม่มีคำอธิบาย", // เพิ่มส่วนนี้เพื่อเก็บคำอธิบาย
              unit_asm: log.unit_asm,
              product_details: log.product_id.split(",").map((id, index) => ({
                product_id: id,
                product_names: log.product_names.split(",")[index],
                borrowed_quantity: parseInt(log.product_quantity_borrow.split(",")[index]),
                return_quantity: parseInt(log.product_quantity_return.split(",")[index]),
                remaining_quantityASM:
                  parseInt(log.product_quantity_borrow.split(",")[index]) -
                  parseInt(log.product_quantity_return.split(",")[index]) -
                  parseInt(log.return_damage.split(",")[index]),
              })),
            }))
            : []; // กรณีที่ไม่มีสินค้าประกอบ, ให้เป็น array ว่าง

          const combinedData = [...normalProducts, ...assembledProducts];
          setProductData(combinedData);

          const initialReturnData = {};
          combinedData.forEach((item) => {
            if (item.type === "assemble") {
              item.product_details.forEach((detail) => {
                const key = `assemble_${item.id}_${detail.product_id}`;
                initialReturnData[key] = {
                  return_quantity: 0,
                  damage_quantity: 0,
                  description: "",
                };
              });
            } else {
              const key = `normal_${item.id}`;
              initialReturnData[key] = {
                return_quantity: 0,
                damage_quantity: 0,
                description: "",
              };
            }
          });

          setReturnData(initialReturnData);
          setHasFetched(true);
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
  }, [id, hasFetched]);


  const handleInputChange = (productId, field, value, assembleId = null) => {
    const key = assembleId ? `assemble_${assembleId}_${productId}` : `normal_${productId}`;
    setReturnData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };
  const handleReturnAllForNormalProduct = (productId, isChecked) => {
    setReturnData((prev) => {
      const updatedData = { ...prev };
      const key = `normal_${productId}`;

      updatedData[key] = {
        ...updatedData[key],
        return_all: isChecked,
        return_quantity: isChecked
          ? productData.find((item) => item.id === productId)?.remaining_quantity || 0
          : 0,
        damage_quantity: isChecked ? 0 : updatedData[key]?.damage_quantity || 0,
        description: isChecked ? "คืนสินค้าทั้งหมด" : "",
      };

      return updatedData;
    });
  };

  const handleReturnAllForProductDetail = (assembleId, productId, isChecked) => {
    setReturnData((prev) => {
      const updatedData = { ...prev };

      const key = `assemble_${assembleId}_${productId}`;
      updatedData[key] = {
        ...updatedData[key],
        return_all: isChecked,
        return_quantity: isChecked
          ? productData
            .find((item) => item.id === assembleId)
            ?.product_details.find((detail) => detail.product_id === productId)
            ?.remaining_quantityASM || 0
          : 0,
        damage_quantity: isChecked ? 0 : updatedData[key]?.damage_quantity || 0,
        description: isChecked ? "คืนทั้งหมดในสินค้าประกอบ" : "",
      };

      return updatedData;
    });
  };

  const renderNormalProducts = (item) => {
    const isFullyReturned = item.remaining_quantity === 0;

    return (
      <tr key={item.id} className="border-b">
        {[item.product_name, item.code, item.borrowed_quantity, item.remaining_quantity].map(
          (text, index) => (
            <td key={index} className="text-center py-3 text-lg align-middle">{text}</td>
          )
        )}
        <td className="text-center py-3 align-middle">
          <input
            type="checkbox"
            checked={returnData[`normal_${item.id}`]?.return_all || false}
            onChange={(e) => handleReturnAllForNormalProduct(item.id, e.target.checked)}
            className="w-5 h-4 cursor-pointer"
            disabled={isFullyReturned}
          />
        </td>
        {["return_quantity", "damage_quantity"].map((field, index) => (
          <td key={index} className="text-center align-middle">
            <input
              type="number"
              value={returnData[`normal_${item.id}`]?.[field] || 0}
              onChange={(e) => handleInputChange(item.id, field, e.target.value)}
              className="w-24 border rounded px-2 py-1 text-center"
              disabled={isFullyReturned}
            />
          </td>
        ))}
        <td className="text-center align-middle">
          <input
            type="text"
            value={isFullyReturned ? "คืนครบแล้ว" : returnData[`normal_${item.id}`]?.description || ""}
            onChange={(e) => handleInputChange(item.id, "description", e.target.value)}
            className="w-40 border rounded px-2 py-1 text-center"
            disabled={isFullyReturned}
          />
        </td>
      </tr>
    );
  };

  const renderAssembledProducts = (item) => (
    <React.Fragment key={item.id}>
      <tr className="border-b">
        <td className="text-center py-3 align-middle font-semibold">{item.assemble_name}</td>
        <td className="text-center py-3 align-middle">
          <button
            className="text-blue-500 underline focus:outline-none"
            onClick={() => toggleRow(item.id)}
          >
            <i className={`fa-solid ${expandedRows[item.id] ? "fa-caret-up" : "fa-caret-down"}`}></i>
          </button>
        </td>
        <td colSpan="6"></td>
      </tr>
      {expandedRows[item.id] &&
        item.product_details.map((detail) => {
          const isFullyReturned = detail.remaining_quantityASM === 0;
          return (
            <tr key={detail.product_id} className="border-b bg-gray-50">
              <td className="text-center align-middle">{detail.product_names}</td>
              <td className="text-center align-middle">-</td>
              <td className="text-center align-middle">{detail.borrowed_quantity}</td>
              <td className="text-center align-middle">{detail.remaining_quantityASM}</td>
              <td className="text-center align-middle">
                <input
                  type="checkbox"
                  checked={returnData[`assemble_${item.id}_${detail.product_id}`]?.return_all || false}
                  onChange={(e) =>
                    handleReturnAllForProductDetail(item.id, detail.product_id, e.target.checked)
                  }
                  className="w-5 h-4 cursor-pointer"
                  disabled={isFullyReturned}
                />
              </td>
              {["return_quantity", "damage_quantity"].map((field, index) => (
                <td key={index} className="text-center align-middle">
                  <input
                    type="number"
                    value={returnData[`assemble_${item.id}_${detail.product_id}`]?.[field] || 0}
                    onChange={(e) =>
                      handleInputChange(detail.product_id, field, e.target.value, item.id)
                    }
                    disabled={isFullyReturned}
                    className="w-24 border rounded px-2 py-1 text-center h"
                  />
                </td>
              ))}
              <td className="text-center align-middle">
                <input
                  type="text"
                  value={isFullyReturned ? "คืนครบแล้ว" : returnData[`assemble_${item.id}_${detail.product_id}`]?.description || ""}
                  onChange={(e) =>
                    handleInputChange(detail.product_id, "description", e.target.value, item.id)
                  }
                  className="w-40 border rounded px-2 h-3/4 text-center"
                  disabled={isFullyReturned}
                />
              </td>
            </tr>
          );
        })}
    </React.Fragment>
  );










  const handleReturnSubmit = async () => {
    try {
      const payload = {
        outbound_id: outboundId,
        returns: productData.flatMap((item) => {
          if (item.type === "assemble") {
            const productReturns = item.product_details.map((detail) => {
              const returnEntry = {
                product_id: parseInt(detail.product_id),
                return_quantity: parseInt(
                  returnData[`assemble_${item.id}_${detail.product_id}`]?.return_quantity || 0
                ),
                ...(returnData[`assemble_${item.id}_${detail.product_id}`]?.damage_quantity
                  ? {
                    damage_quantity: parseInt(
                      returnData[`assemble_${item.id}_${detail.product_id}`]?.damage_quantity
                    ),
                  }
                  : {}),
                description:
                  returnData[`assemble_${item.id}_${detail.product_id}`]?.description || "",
              };

              return returnEntry;
            });

            return {
              assemble_id: item.id,
              product_returns: productReturns,
              return_all: false,
              description: "คืนสินค้าประกอบบางส่วน",
            };
          } else {
            const returnEntry = {
              product_id: item.id,
              return_quantity: parseInt(returnData[`normal_${item.id}`]?.return_quantity || 0),
              ...(returnData[`normal_${item.id}`]?.damage_quantity
                ? {
                  damage_quantity: parseInt(returnData[`normal_${item.id}`]?.damage_quantity),
                }
                : {}),
              description: returnData[`normal_${item.id}`]?.description || "",
              return_all: false,
            };

            return returnEntry;
          }
        }),
      };

      console.log("Payload ที่ส่งไปยัง API:", payload);
      const token = localStorage.getItem("token");

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

      if (response.status === 200) {
        // แสดง SweetAlert เมื่อคืนสินค้าสำเร็จ
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "การคืนสินค้าสำเร็จ",
          confirmButtonText: "ตกลง",
        }).then(() => {
          // ปิด Modal (ปรับการปิด Modal ตามที่ใช้งาน เช่น setModalOpen(false))
          // setModalOpen(false); // หากใช้ React State สำหรับ Modal

          // รีเฟรชหน้า
          window.location.reload();
        });
      }
    } catch (error) {
      // แสดง SweetAlert เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.msg || "ไม่สามารถคืนสินค้าได้",
        confirmButtonText: "ตกลง",
      });
      console.error("เกิดข้อผิดพลาดในการคืนสินค้า:", error);
    }
  };





  if (isLoading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container p-6 h-screen flex flex-col">
      {/* ส่วนของตาราง */}
      <div className="flex-grow overflow-y-auto max-h-[300px] border-gray-300 rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-300 text-lg sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-center">ชื่อสินค้า</th>
              <th className="px-4 py-2 text-center">รายละเอียด/รหัส</th>
              <th className="px-4 py-2 text-center">เช่าไป</th>
              <th className="px-4 py-2 text-center">เหลือคืน</th>
              <th className="px-4 py-2 text-center">คืนทั้งหมด</th>
              <th className="px-4 py-2 text-center">จำนวนที่คืน</th>
              <th className="px-4 py-2 text-center">จำนวนที่เสียหาย</th>
              <th className="px-4 py-2 text-center">คำอธิบาย</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200 text-lg">
            {productData.map((item) =>
              item.type === "normal"
                ? renderNormalProducts(item)
                : renderAssembledProducts(item)
            )}
          </tbody>
        </table>
      </div>
  
      {/* ปุ่มอยู่ด้านล่าง */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleReturnSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow"
        >
          คืนสินค้า
        </button>
      </div>
    </div>
  );
  

}

