// Product_Returnbound.jsx

import React, { useState, useEffect } from 'react';
import { Modal_ReturnGreen } from './Modal_ReturnGreen'; // import modal ที่เราเตรียมไว้

export function Product_Returnbound() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // เก็บสินค้าที่เลือก

    useEffect(() => {
        // สมมุติว่าเรากำลังดึงข้อมูลสินค้าจาก API
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://example.com/api/products'); // API ที่คุณใช้
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true); // เปิด modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // ปิด modal
        setSelectedProduct(null); // เคลียร์ข้อมูลสินค้า
    };

    return (
        <div className="container">
            <h1 className="text-2xl font-bold">สินค้าที่ยังไม่ได้คืน</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.receipt_number}</p>
                        </div>
                        <button
                            className="btn btn-return"
                            onClick={() => openModal(product)}
                        >
                            ส่งคืนสินค้า
                        </button>
                    </div>
                ))}
            </div>

            {/* เปิด Modal ใหม่เมื่อ isModalOpen เป็น true */}
            {isModalOpen && selectedProduct && (
                <Modal_ReturnGreen close={closeModal} data={[selectedProduct]} />
            )}
        </div>
    );
}
