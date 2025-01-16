import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";
export function CreateASM({ close }) {
    const [products, setProducts] = useState([]);
    const [asmName, setAsmName] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [description, setDescription] = useState("");
    const [assemblePrice, setAssemblePrice] = useState(0);
    const [assembleServicePrice, setAssembleServicePrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchCode, setSearchCode] = useState(""); // สำหรับค้นหารหัสสินค้า

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); // เริ่มโหลด
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://192.168.195.75:5000/v1/product/outbound/products", {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        "x-api-key": "1234567890abcdef",
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

    const handleSearchByCode = (code) => {
        setSearchCode(code);

        if (code.trim() === "") {
            // ถ้าช่องค้นหาว่างเปล่า แสดงข้อมูลสินค้าเดิมทั้งหมด
            const token = localStorage.getItem("token");
            axios
                .get("http://192.168.195.75:5000/v1/product/outbound/products", {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        "x-api-key": "1234567890abcdef",
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        setProducts(res.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                });
        } else {
            // กรองข้อมูลตามรหัสสินค้า
            const filtered = products
                .filter((product) => {
                    const searchText = code.toLowerCase();
                    return (
                        product.code.toLowerCase().includes(searchText) || // ค้นหาใน code
                        product.name.toLowerCase().includes(searchText)   // ค้นหาใน name
                    );
                })
                .sort((a, b) => {
                    const searchText = code.toLowerCase();
                    const aCodeIndex = a.code.toLowerCase().indexOf(searchText);
                    const bCodeIndex = b.code.toLowerCase().indexOf(searchText);
                    const aNameIndex = a.name.toLowerCase().indexOf(searchText);
                    const bNameIndex = b.name.toLowerCase().indexOf(searchText);

                    // จัดเรียงตาม code ก่อน หากไม่พบใน code ให้เรียงตาม name
                    if (aCodeIndex !== -1 && bCodeIndex !== -1) {
                        return aCodeIndex - bCodeIndex;
                    } else if (aCodeIndex !== -1) {
                        return -1;
                    } else if (bCodeIndex !== -1) {
                        return 1;
                    } else {
                        return aNameIndex - bNameIndex;
                    }
                });

            setProducts(filtered);

        }
    };


    const handleAddProduct = (product) => {
        if (!selectedProducts.find((p) => p.id === product.id)) {
            setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
        } else {
            Swal.fire({
                icon: "warning",
                text: "สินค้านี้ถูกเลือกแล้ว",
                confirmButtonText: "ตกลง",
            });
        }
    };

    const handleRemoveProduct = (index) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateASM = () => {
        if (!asmName || selectedProducts.length === 0) {
            Swal.fire({
                icon: "warning",
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        const newASM = {
            assemble_name: asmName,
            assemble_price: assemblePrice,
            assemble_service_price: assembleServicePrice,
            status: "rent",
            description: description,
            products: selectedProducts.map((p) => ({
                product_id: p.id,
                quantity: p.quantity,
                description: p.name,
            })),
        };

        const token = localStorage.getItem("token");
        axios
            .post("http://192.168.195.75:5000/v1/product/outbound/create-assemble", newASM, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    "x-api-key": "1234567890abcdef",
                },
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    text: "สร้างสินค้าประกอบสำเร็จ",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    close();
                    window.location.reload();
                });
            })
            .catch((error) => {
                console.error("Error creating ASM:", error);
                Swal.fire({
                    icon: "error",
                    text: "เกิดข้อผิดพลาดในการสร้างสินค้าประกอบ",
                    confirmButtonText: "ตกลง",
                });
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-20 z-50">
            <div className="bg-white w-[90%] h-[90%] rounded-lg shadow-xl flex">
                {/* Left Panel */}
                <div className="w-2/3 p-4 flex flex-col space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">สร้างสินค้าประกอบ</h2>

                    <div className="flex flex-col">
                        <label htmlFor="asmName" className="mb-2 text-lg font-bold text-gray-700">
                            ชื่อสินค้าประกอบ :
                        </label>
                        <input
                            id="asmName"
                            type="text"
                            value={asmName}
                            onChange={(e) => setAsmName(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 "
                            placeholder="กรุณากรอกชื่อสินค้าประกอบ"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="assemblePrice" className="mb-2 text-lg font-bold text-gray-700">
                            ราคา :
                        </label>
                        <input
                            id="assemblePrice"
                            type="number"
                            value={assemblePrice}
                            onChange={(e) => setAssemblePrice(parseFloat(e.target.value) || 0)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <input
                            id="asmName"
                            type="text"
                            value={searchCode}
                            onChange={(e) => handleSearchByCode(e.target.value)}
                            placeholder="ค้นหา"
                            className="border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <ReactLoading type="spin" color="#3498db" height={50} width={50} />
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[600px] border border-gray-300 rounded-md">
                            <table className="w-full text-center">
                                <thead className="sticky top-0 bg-blue-300 z-10 text-[#133E87] font-bold h-[40px]">
                                    <tr className="border-b text-lg">
                                        <th>ลำดับ</th>
                                        <th>ชื่อสินค้า</th>
                                        <th>รหัสสินค้า</th>
                                        <th>ขนาด</th>
                                        <th>คงเหลือ</th>
                                        <th>เลือก</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} `}>
                                            <td className="p-4">{product.id}</td> {/* เพิ่ม padding ในแต่ละเซลล์ */}
                                            <td className="p-4">{product.name}</td>
                                            <td className="p-4">{product.code}</td>
                                            <td className="p-4">{product.size}</td>
                                            <td className="p-4">{product.quantity}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleAddProduct(product)}
                                                    className="bg-green-500 text-sm text-white font-md p-1 rounded-md w-3/4 h-[35px] hover:bg-green-300 transition duration-150"
                                                >
                                                    เพิ่ม
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                                
                {/* Right Panel */}
                <div className="w-1/3 p-4 flex flex-col justify-between mt-16">
                    <div>
                        <h3 className="text-xl font-semibold">รายการที่เลือก</h3>
                        <div className="[calc(100%-150px)] border border-gray-300 rounded-md mt-4">
                            <table className="w-full text-center ">
                                <thead className="sticky top-0 bg-white z-10 text-[#133E87] font-bold">
                                    <tr className="border-b border-blue-500 bg-blue-300">
                                        <th className="px-2 py-1 text-center">ชื่อสินค้า</th>
                                        <th className="px-2 py-1 text-center">รหัสสินค้า</th>
                                        <th className="px-2 py-1 text-center">ขนาด</th>
                                        <th className="px-2 py-1 text-center">เลือกจำนวน</th>
                                        <th className="px-2 py-1 text-center">เลือก</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedProducts.length > 0 ? (
                                        selectedProducts.map((product, index) => (
                                            <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} `}>
                                                <td className="p-4">{product.name}</td>
                                                <td className="p-4">{product.code}</td>
                                                <td className="p-4">{product.size}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) => {
                                                            const updated = [...selectedProducts];
                                                            updated[index].quantity = parseInt(e.target.value, 10) || 0;
                                                            setSelectedProducts(updated);
                                                        }}
                                                        className="w-12 text-center border border-gray-300 rounded-md"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            onClick={() => handleRemoveProduct(index)}
                                                            className="bg-red-500 text-sm text-white p-2 rounded-md hover:bg-red-300 w-5/6 transition duration-150 h-[30px] flex justify-center items-center"
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                                <span>ไม่มีข้อมูล</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>

                        </div>
                        <div className="flex flex-col mt-5">
                            <label htmlFor="description" className="mb-2 text-lg font-bold text-gray-700">
                                คำอธิบาย :
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 h-80" // เพิ่มความสูงด้วย Tailwind CSS
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-400 transaction duration-150"
                            onClick={handleCreateASM}
                        >
                            สร้างสินค้าประกอบ
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400 transaction duration-150"
                            onClick={close}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
