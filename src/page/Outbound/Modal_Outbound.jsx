import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export function Modal_Outbound({ close, confirm, ititialData }) {
  const [products, setProducts] = useState([]);
  const [products_search, setProducts_search] = useState([]);
  const [keysearchItem, setkeysearchItem] = useState('');
  const [confirm_items, setConfirm_item] = useState(ititialData || []);

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://192.168.195.75:5000/v1/product/outbound/product", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY,

        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.data);
        }
      });
  }, []);

  // ค้นหาสินค้าโดยใช้รหัสสินค้า
  const filteritem_Search = (searchTerm) => {
    setkeysearchItem(searchTerm); // อัปเดตค่าที่พิมพ์ในช่องค้นหา
    if (!searchTerm) {
      setProducts_search([]); // ล้างค่าถ้าไม่มีการค้นหา
      return;
    }
    const itemFilter = products.filter((item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts_search(itemFilter);
  };

  // ฟังก์ชันเลือกสินค้าพร้อมจำนวน
  const select_Item = (item, amount) => {
    const parsedAmount = parseInt(amount) || 0;

    setConfirm_item((prevItems) => {
      if (parsedAmount === 0) {
        return prevItems.filter((i) => i.code !== item.code);
      }

      const existingItemIndex = prevItems.findIndex((i) => i.code === item.code);

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...item,
          amount: parsedAmount,
          price: item.price3D || 0,
          isAssemble: false,
        };

        return updatedItems;
      } else {
        return [
          ...prevItems,
          { ...item, amount: parsedAmount, price: item.price3D || 0, isAssemble: false },
        ];
      }
    });
  };

  // ฟังก์ชันยืนยันรายการสินค้า
  const confirm_item = () => {
    if (confirm_items.length === 0) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาเลือกสินค้าอย่างน้อย 1 รายการก่อนยืนยัน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    confirm(confirm_items);
    close(confirm_items.length);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-20 z-50">
      <div className="bg-white w-[900px] h-[800px] rounded-lg shadow-xl flex flex-col items-center">

        {/* Header */}
        <div className="w-full flex justify-between items-center p-4">
          <div></div>
          <h2 className="text-2xl font-semibold">เลือกสินค้า </h2>
          <button className="text-gray-500 hover:text-gray-700 text-[24px]" onClick={() => close(0)}>X</button>
        </div>

        {/* Search */}
        <div className="flex items-center w-3/4 justify-center">
          <span className="text-black font-bold">รหัสสินค้า :</span>
          <div className="p-4 w-2/4">
            <input
              type="text"
              placeholder="รหัสสินค้า"
              className="w-full border border-gray-300 rounded-md p-2"
              onChange={(e) => filteritem_Search(e.target.value)}
              value={keysearchItem}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[550px] min-h-[550px] no-scrollbar w-3/4 border-2 border-blue-500 rounded-md">
          <table className="w-full text-center">
            <thead className="sticky top-0 bg-white z-10 text-[#133E87] font-bold">
              <tr className="border-b border-blue-500">
                <th className="px-4 py-2">รหัสสินค้า</th>
                <th className="px-4 py-2">ชื่อสินค้า</th>
                <th className="px-4 py-2">ขนาด</th>
                <th className="px-4 py-2">คงเหลือ</th>
                <th className="px-4 py-2">เลือก</th>
              </tr>
            </thead>
            <tbody>
              {(keysearchItem.length > 0 ? products_search : products).map((item, key) => (
                <tr key={key} className="border-b border-blue-500">
                  <td className="px-4 py-2">{item.code}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.size}</td>
                  <td className="px-4 py-2 text-red-500">{item.quantity}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      className="w-[100px] p-2 text-center border border-black rounded-md"
                      onChange={(e) => select_Item(item, e.target.value)}
                      value={confirm_items.find((i) => i.code === item.code)?.amount || ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 border-t w-3/4">
          <button
            className="px-4 py-2 bg-[#31AB31] hover:bg-green-700 text-white rounded-md mr-2 w-1/4 text-center"
            onClick={confirm_item}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
