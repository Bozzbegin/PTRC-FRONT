import { useState } from "react";
import './test_table.css';

export default function TestTable() {
  const [items, setItems] = useState([]); // เก็บข้อมูลที่รวมแล้ว
  const [currentInputs, setCurrentInputs] = useState([]); // เก็บ input ที่กำลังพิมพ์

  const handleInputChange = (e) => {
    const { name, value, id } = e.target;
    setCurrentInputs((prev) => {
      // ค้นหา input ที่มี id ตรงกัน
      const existingInput = prev.find((input) => input.id === id);
      if (existingInput) {
        // ถ้ามีอยู่แล้ว, อัปเดตค่า amount
        return prev.map((input) =>
          input.id === id ? { ...input, amount: value } : input
        );
      }
      // ถ้ายังไม่มี, เพิ่ม input ใหม่
      return [...prev, { item: name, amount: value, id }];
    });
  };

  const handleSave = () => {
    setItems((prevItems) => {
      const mergedItems = [...prevItems];
      const m_itemKey = `m_item${prevItems.length + 1}`; // สร้าง key ใหม่ เช่น m_item1, m_item2

      // รวมข้อมูลจาก currentInputs
      const newItemGroup = {
        [m_itemKey]: currentInputs.map(({ item, amount, id }) => ({
          item,
          amount,
          id,
        })),
      };

      return [...mergedItems, newItemGroup]; // เพิ่มเข้าไปใน items
    });

    setCurrentInputs([]); // รีเซ็ต input
  };

  return (
    <>
      <div>
        <h3>กรอกข้อมูล</h3>
        <div>
          <input
            type="text"
            name="item1"
            id="60"
            onChange={handleInputChange}
            value={currentInputs.find((input) => input.id === "60")?.amount || ""}
          />
          item 1
        </div>
        <div>
          <input
            type="text"
            name="item2"
            id="71"
            onChange={handleInputChange}
            value={currentInputs.find((input) => input.id === "71")?.amount || ""}
          />
          item 2
        </div>
        <div>
          <input
            type="text"
            name="item3"
            id="72"
            onChange={handleInputChange}
            value={currentInputs.find((input) => input.id === "72")?.amount || ""}
          />
          item 3
        </div>
        <button onClick={handleSave}>ตกลง</button>
      </div>

      <div>
        <h3>รวมข้อมูล m_item</h3>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div>
    </>
  );
}
