import React, { useState, useEffect } from "react";
import BranchSelector from "./BranchSelector";
import InventoryTable from "./InventoryTable";
import EditModal from "./editModal"; // Import EditModal

import axios from "axios";

function Inventory() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [products, setProducts] = useState([]);
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditIcons, setShowEditIcons] = useState(false); // This state is needed for toggle visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // หรือจาก context หรือ cookies ที่เก็บ token ไว้
        if (!token) {
          console.error("Token not found");
        } else {
          const response = await axios.get("http://192.168.195.75:5000/v1/product/list/all-product", {
            headers: {
              "Authorization": token, // Send the token directly (no 'Bearer' prefix)
              "Content-Type": "application/json", // Set Content-Type header
              "x-api-key": "1234567890abcdef", // Your API key
            },
          });

          if (response.data.code === 200) {
            const data = response.data.data; // Assuming response has a `data` field with products
            let filteredProducts = [];

            if (selectedBranch === "chonburi") {
              filteredProducts = data.product_chonburi.map(item => ({
                ...item,
                branchName: "ชลบุรี", // เพิ่มชื่อสาขา
              }));
            } else if (selectedBranch === "samutsakhon") {
              filteredProducts = data.product_samutsakhon.map(item => ({
                ...item,
                branchName: "โคกขาม", // เพิ่มชื่อสาขา
              }));
            } else if (selectedBranch === "pathumthani") {
              filteredProducts = data.product_pathumthani.map(item => ({
                ...item,
                branchName: "นพวงศ์", // เพิ่มชื่อสาขา
              }));
            } else {
              // Combine all products from different branches and add branch names
              filteredProducts = [
                ...data.product_chonburi.map(item => ({
                  ...item,
                  branchName: "ชลบุรี", // เพิ่มชื่อสาขา
                })),
                ...data.product_samutsakhon.map(item => ({
                  ...item, 
                  branchName: "นพวงศ์", // เพิ่มชื่อสาขา
                })),
              ];
            }

            setProducts(filteredProducts);
          } else {
            console.error("Error fetching data: ", response.data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedBranch]);

  const handleEditClick = (id) => {
    setEditingProductId(id);
    setIsModalOpen(true); // Open modal on edit
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null); // Reset product ID when closing modal
  };

  const toggleEditIcons = () => {
    setShowEditIcons(!showEditIcons); // Toggle edit icon visibility
  };

  return (
    <div>
      <BranchSelector onSelectBranch={setSelectedBranch} toggleEditIcons={toggleEditIcons} />
      <InventoryTable products={products} showEditIcons={showEditIcons} onEditClick={handleEditClick} />

      {isModalOpen && <EditModal productId={editingProductId} onClose={closeModal} />}
    </div>
  );
}

export default Inventory;
