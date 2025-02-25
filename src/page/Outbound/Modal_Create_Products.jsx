import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";


export function Modal_Create_Products({ close, datadefault, createitem }) {
  const [products, setProducts] = useState([]);
  const [products_search, setProducts_search] = useState([]);
  const [keysearchItem, setkeysearchItem] = useState("");
  const [confirm_items, setConfirm_item] = useState([]);
  const [newitemname, setNewItemName] = useState('');
  const [newpriceitem, setNewPriceItem] = useState(0);
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // เริ่มต้นเป็น true

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // เริ่มโหลด
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://192.168.195.75:5000/v1/product/outbound/products", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "p@tt@r@ch@i2k24",
          },
        });
        if (res.status === 200) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false); // จบการโหลด
      }
    };
    fetchProducts();
  }, []);



  const filteritem_Search = () => {
    const itemFilter = products.filter(
      (item) =>
        item.code.includes(keysearchItem) ||
        item.name.toLowerCase().includes(keysearchItem.toLowerCase())
    );
    setProducts_search(itemFilter);
  };

  const select_Item = (item, value, type) => {
    const parsedValue = parseInt(value) || 0;

    setConfirm_item((prev) => {
      const existingItem = prev.find((i) => i.code === item.code);

      if (existingItem) {
        return prev.map((i) =>
          i.code === item.code
            ? {
              ...i,
              [type]: parsedValue,
            }
            : i
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            amount: type === "amount" ? parsedValue : 0,
            price: type === "price" ? parsedValue : 0,
            type: 1,
          },
        ];
      }
    });
  };

  const confirm_item = () => {
    if (confirm_items.length === 0) {
      Swal.fire({
        icon: "error",
        title: "ไม่มีสินค้า",
        text: "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ",
      });
      return;
    }


    if (!newitemname || newpriceitem <= 0 || newItemQuantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลสินค้าใหม่ให้ครบถ้วน",
      });
      return;
    }


    const item_merge = confirm_items.reduce(
      (acc, item) => {
        acc.code.push(String(item.code));
        acc.product_id.push(String(item.id) || "");
        acc.quantity.push(String(item.amount));
        acc.size.push(String(item.size) || "");
        acc.centimeter.push(item.centimeter || '');
        acc.meter.push(item.meter || '');
        acc.type.push(String(item.type) || "");
        return acc;
      },
      {
        code: [],
        product_id: [],
        quantity: [],
        size: [],
        centimeter: [],
        meter: [],
        type: [],
      }
    );

    const itemsuccess = {
      merge: [{ ...item_merge, assemble_name: newitemname, quantity_assemble: newItemQuantity, price: parseInt(newpriceitem), }],
      customer_name: datadefault.name,
      place_name: datadefault.workside,
      address: datadefault.address,
      date: datadefault.day_length,
      reserver: [],
      status_assemble: true,
      vat: "vat",
      discount: 200,
      shipping_cost: 2500,
      move_price: 1000,
      guarantee_price: 0,
      average_price: 0,
      assemble_status: true,
    }
    const mock = itemsuccess.merge[0]
    const token = localStorage.getItem("token");
    axios.post(
      "http://192.168.195.75:5000/v1/product/outbound/merge",
      mock,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "p@tt@r@ch@i2k24",
        },
      }
    ).then((res) => {
      //console.log(res);
    })

    createitem(itemsuccess);

    close();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-20 z-50">

      <div className="bg-white w-[900px] h-[800px] rounded-lg shadow-xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center p-4">
          <div></div>
          <h2 className="text-2xl font-semibold">เลือกสินค้าที่ต้องการสร้าง</h2>
          <button className="text-gray-500 hover:text-gray-700 text-[24px]" onClick={close}>
            X
          </button>
        </div>

        <div className="flex flex-col items-center justify-around w-3/4 ">
          <div className=" w-full flex items-center ">
            <div className="w-2/4 h-[60px] flex justify-around items-center">
              <span>ชื่อสินค้าใหม่: </span>
              <input
                type="text"
                onChange={(e) => setNewItemName(e.target.value)}
                required
                className="w-2/4 border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="w-2/4 h-[60px] flex justify-around items-center">
              <span>ราคาสินค้าใหม่:</span>
              <input
                type="number"
                onChange={(e) => setNewPriceItem(e.target.value)}
                required
                className="w-2/4 border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="w-full flex items-center mt-4">
            <div className="w-2/4 h-[60px] flex justify-around items-center">
              <span>จำนวนสินค้าใหม่:</span>
              <input
                type="number"
                min={1}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                required
                className="w-2/4 border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className=" flex w-full justify-around p-3 border-t border-gray">
            <div className="w-3/4">
              <span className="w-[150px] ml-3">รหัสสินค้า: </span>
              <input
                type="text"
                placeholder="รหัสสินค้า"
                className="w-[173px] border border-gray-300 rounded-md p-2 ml-12"
                onChange={(e) => setkeysearchItem(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-800 w-1/4 p-2 rounded-md text-white hover:bg-blue-900 transition duration-200"
              onClick={filteritem_Search}
            >
              ค้นหา
            </button>
          </div>
        </div>

           {isLoading ? ( // ตรวจสอบสถานะ isLoading
            <tr>
              <td colSpan="5" className="text-center py-4">
                <div className="flex justify-center items-center">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mr-2"></div>
                  <span>กำลังโหลดข้อมูล...</span>
                </div>
              </td>
            </tr>
        ) : (
          <div className="overflow-y-auto max-h-[410px] min-h-[410px] no-scrollbar w-3/4 border-2 border-blue-500 rounded-md">
            <table className="w-full text-center">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-blue-500 text-[#133E87] font-bold">
                  <th className="px-4 py-2">รหัสสินค้า</th>
                  <th className="px-4 py-2">ชื่อสินค้า</th>
                  <th className="px-4 py-2">ขนาด</th>
                  <th className="px-4 py-2">คงเหลือ</th>
                  <th className="px-4 py-2">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {(products_search.length > 0 ? products_search : products).map(
                  (item, key) => (
                    <tr key={key} className="border-b border-blue-500">
                      <td className="px-4 py-2">{item.code}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.size}</td>
                      <td className="px-4 py-2 text-red-500">{item.quantity}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          name="amount"
                          className="w-[100px] p-2 text-center border border-black rounded-md"
                          onChange={(e) =>
                            select_Item(item, e.target.value, "amount")
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-center p-4 border-t w-3/4 mt-2">
          <button
            className="px-4 py-2 bg-[#31AB31] text-white rounded-md mr-2 w-1/4 text-center hover:bg-[#278427] transition duration-200"
            onClick={confirm_item}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
