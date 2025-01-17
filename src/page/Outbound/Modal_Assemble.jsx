import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CreateASM } from "./Modal_CreateAssemble";
import ReactLoading from "react-loading";
import { Modal_EditAssemble } from "./Modal_EditAssemble";

export function Modal_Assemble({ close, confirm, ititialDataASM }) {
  const [ASMproducts, setASMProducts] = useState([]);
  const [products_search, setProducts_search] = useState([]);
  const [keysearchItem, setkeysearchItem] = useState("");
  const [confirm_itemsASM, setConfirm_item] = useState(ititialDataASM || []);
  const [selectedASMId, setSelectedASMId] = useState(null);
  const [showCreateASM, setShowCreateASM] = useState(false);
  const [showEditASM, setShowEditASM] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const toggleCreateASM = () => {
    setShowCreateASM(!showCreateASM);
  };

  const toggleEditASM = (id) => {
    setSelectedASMId(id);
    setShowEditASM(!showEditASM);
  };

  const handleDelete = (id) => {
    console.log(`กำลังลบรายการที่มี ID: ${id}`);
    const token = localStorage.getItem("token");

    axios
      .delete(`http://192.168.195.75:5000/v1/product/outbound/delete-assemble/${id}`, { // ใช้ Template Literal แทน {id}
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            text: "ลบสินค้าประกอบสำเร็จ",
            confirmButtonText: "ตกลง",
          }).then(() => {
            // ปิด modal และรีเฟรชหน้าหลังจากการลบสำเร็จ
            close();
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "ลบข้อมูลผิดพลาด",
            confirmButtonText: "ตกลง",
          });
        }
      })
      .catch((error) => {
        console.error("Error while deleting:", error);
        Swal.fire({
          icon: "error",
          text: "ลบข้อมูลผิดพลาด",
          confirmButtonText: "ตกลง",
        });
      });
  };



  useEffect(() => {
    const fetchASMProducts = async () => {
      setIsLoading(true); // เริ่มสถานะกำลังโหลด
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://192.168.195.75:5000/v1/product/outbound/assemble",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              "x-api-key": "1234567890abcdef",
            },
          }
        );
        if (response.status === 200) {
          setASMProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ASM products:", error);
      } finally {
        setIsLoading(false); // สิ้นสุดสถานะกำลังโหลด
      }
    };

    fetchASMProducts();
  }, []);


  const filteritem_Search = () => {
    const itemFilter = ASMproducts.filter((item) =>
      item.assemble_name.toLowerCase().includes(keysearchItem.toLowerCase())
    );
    setProducts_search(itemFilter);
  };
  const handleSearchByCode = (assemble_name) => {
    setkeysearchItem(assemble_name);

    if (assemble_name.trim() === "") {
      // ถ้าช่องค้นหาว่างเปล่า แสดงข้อมูลสินค้าเดิมทั้งหมด
      const token = localStorage.getItem("token");
      axios
        .get("http://192.168.195.75:5000/v1/product/outbound/assemble", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setProducts_search(res.data.data); // โหลดข้อมูลสินค้าเดิม
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } else {
      // กรองข้อมูลตามชื่อสินค้า
      const filtered = ASMproducts
        .filter((item) =>
          item.assemble_name.toLowerCase().includes(assemble_name.toLowerCase())
        )
        .sort((a, b) => {
          const aIndex = a.assemble_name.toLowerCase().indexOf(assemble_name.toLowerCase());
          const bIndex = b.assemble_name.toLowerCase().indexOf(assemble_name.toLowerCase());
          return aIndex - bIndex;
        });
      setProducts_search(filtered); // อัปเดตข้อมูลที่กรอง
    }
  };


  const select_Item = (item, amountASM) => {
    const parsedAmountASM = parseInt(amountASM, 10) || 0;

    setConfirm_item((prevItems) => {
      if (parsedAmountASM === 0) {
        return prevItems.filter((i) => i.id_asm !== item.id);
      }

      const existingItemIndex = prevItems.findIndex((i) => i.id_asm === item.id);

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          assemble_name: item.assemble_name,
          assemble_price: item.assemble_price,
          assemble_service_price: item.assemble_service_price,
          description: item.description,
          amountASM: parsedAmountASM,
          isAssemble: true,
          id_asm: item.id,
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            assemble_name: item.assemble_name,
            assemble_price: item.assemble_price,
            assemble_service_price: item.assemble_service_price,
            description: item.description,
            amountASM: parsedAmountASM,
            isAssemble: true,
            id_asm: item.id,
          },
        ];
      }
    });
  };

  const confirm_itemASM = () => {
    const filteredItemsASM = confirm_itemsASM.filter((item) => item.amountASM > 0);

    if (filteredItemsASM.length === 0) {
      alert("กรุณาเลือกสินค้าประกอบก่อนยืนยัน");
      return;
    }

    console.log("confirm modal = ", filteredItemsASM);
    confirm(filteredItemsASM);
    close(filteredItemsASM.length);
  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-20 z-50">
      <div className="bg-white w-[900px] max-h-[600px] rounded-lg shadow-xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center p-4">
          <h2 className="text-2xl font-semibold">สินค้าประกอบ</h2>
          <button className="text-gray-500 hover:text-gray-700 text-[24px]" onClick={() => close(0)}>
            X
          </button>
        </div>

        <div className="flex items-center justify-around w-3/4">
          <span className="text-black font-bold">ชื่อสินค้า :</span>
          <div className="p-4 w-2/4">
            <input
              type="text"
              placeholder="ชื่อสินค้า"
              className="w-full border border-gray-300 rounded-md p-2"
              value={keysearchItem}
              onChange={(e) => handleSearchByCode(e.target.value)}
            />

          </div>
          <button className="bg-blue-900 hover:bg-blue-800 w-1/4 p-2 rounded-md text-white" onClick={filteritem_Search}>
            ค้นหา
          </button>
        </div>

        <div className="overflow-y-auto max-h-[550px] w-[90%] border-2 border-blue-500 rounded-md">
          <table className="w-full text-center">
            <thead className="sticky top-0 bg-white z-10 text-[#133E87] font-bold">
              <tr className="border-b border-blue-500">
                <th className="px-4 py-2">ชื่อสินค้า</th>
                <th className="px-4 py-2">รายละเอียด</th>
                <th className="px-4 py-2">ราคา</th>
                <th className="px-4 py-2">เลือก</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mr-2"></div>
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : (products_search.length > 0 ? products_search : ASMproducts).length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    ไม่พบสินค้าสั่งประกอบ
                  </td>
                </tr>
              ) : (products_search.length > 0 ? products_search : ASMproducts).map((item, key) => (
                <tr key={key} className="border-t border-blue-500">
                  <td className="px-4 py-2">{item.assemble_name}</td>
                  <td className="px-4 py-2">{item.description ? item.description : "-"}</td>
                  <td className="px-4 py-2 text-red-500">{item.assemble_price}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={1}
                      className="w-[100px] p-2 text-center border border-black rounded-md"
                      onChange={(e) => select_Item(item, e.target.value)}
                      defaultValue={
                        confirm_itemsASM.find((i) => i.id_asm === item.id)?.amountASM ||
                        ititialDataASM.find((i) => i.id_asm === item.id)?.amountASM ||
                        0
                      }
                    />
                  </td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button className="flex items-center justify-center" onClick={() => toggleEditASM(item.id)}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/10336/10336582.png"
                        className="w-8 h-8"
                        alt="ลบ"
                      />
                    </button>
                    <button className="flex items-center justify-center" onClick={() => handleDelete(item.id)}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/9790/9790368.png"
                        className="w-8 h-8"
                        alt="แก้ไข"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center p-4 border-t w-3/4 ">
          <button className="me-4 px-4 py-2 bg-green-500 text-white rounded-md w-1/4 hover:bg-green-700 transaction durantion-150 " onClick={confirm_itemASM}>
            ยืนยัน
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transaction durantion-150"
            onClick={toggleCreateASM}
          >
            สร้างสินค้าประกอบใหม่
          </button>
        </div>
        
      </div>
      {showCreateASM && <CreateASM close={toggleCreateASM} />}
      {showEditASM && (
        <Modal_EditAssemble id={selectedASMId} close={toggleEditASM} />
      )}
    </div>
  );
}
