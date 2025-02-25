import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";

export function Modal_EditAssemble({ id, close }) {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    `http://192.168.195.75:5000/v1/product/outbound/assemble/${id}`,
                    {
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json",
                            "x-api-key": "p@tt@r@ch@i2k24",
                        },
                    }
                );
                if (res.status === 200) {
                    setProduct(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถโหลดข้อมูลสินค้าได้",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const saveChanges = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            assemble_name: product.assemble_name,
            assemble_price: product.assemble_price,
            description: product.description,
            unit_asm: product.unit_asm,
            assemble_price_damage: product.assemble_price_damage,
            product: product.product.map((item) => ({
                id: item.id,
                quantity: item.quantity_use,
            })),
        };

        try {
            const res = await axios.put(
                `http://192.168.195.75:5000/v1/product/outbound/update-assemble/${id}`,
                payload,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        "x-api-key": "p@tt@r@ch@i2k24",
                    },
                }
            );

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: "แก้ไขสินค้าประกอบสำเร็จ",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    close();
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถแก้ไขข้อมูลได้",
                confirmButtonText: "ตกลง",
            });
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-20 z-50">
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <ReactLoading type="spin" color="#3498db" height={50} width={50} />
                </div>
            ) : (
                <div className="bg-white w-[1000px] h-[850px] rounded-lg shadow-lg p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold mb-2">แก้ไขข้อมูลสินค้า</h2>
                        <button
                            className="px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                            onClick={close}
                        >
                            X
                        </button>
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">ชื่อสินค้า :</label>
                        <input
                            type="text"
                            value={product?.assemble_name || ""}
                            onChange={(e) =>
                                setProduct({ ...product, assemble_name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-2" >
                        <label className="block text-gray-700">ราคา :</label>
                        <input
                            type="number"
                            value={product?.assemble_price || 0}
                            onChange={(e) =>
                                setProduct({ ...product, assemble_price: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">ขนาด :</label>
                        <input
                            type="text"
                            value={product?.description || ""}
                            onChange={(e) =>
                                setProduct({ ...product, description: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700">หน่วย :</label>
                        <input
                            type="text"
                            value={product?.unit_asm || ""}
                            onChange={(e) =>
                                setProduct({ ...product, unit_asm: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">ค่าปรับสินค้า :</label>
                        <input
                            type="number"
                            value={product?.assemble_price_damage || 0}
                            onChange={(e) =>
                                setProduct({ ...product, assemble_price_damage: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <h2 className="text-lg font-bold mb-2">สินค้าภายในสินค้าประกอบ</h2>
                    <div className="overflow-y-auto max-h-[400px] w-full border-2 border-blue-500 rounded-md mb-4">
                        <table className="w-full text-center">
                            <thead className="sticky top-0 bg-white z-10 text-[#133E87] font-bold h-[40px]">
                                <tr className="bg-blue-300">
                                    <th className="px-2">ชื่อสินค้า</th>
                                    <th className="px-2">รหัสสินค้า</th>
                                    <th className="px-2">ขนาด</th>
                                    <th className="px-2">จำนวน</th>

                                </tr>
                            </thead>
                            <tbody>
                                {product?.product.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-2">{item.name}</td>
                                        <td className="px-2">{item.code}</td>
                                        <td className="px-2">{item.size}</td>
                                        <td className="px-2">
                                            <input
                                                type="number"
                                                value={item.quantity_use || 0}
                                                onChange={(e) => {
                                                    const updatedItems = [...product.product];
                                                    updatedItems[index].quantity_use =
                                                        parseInt(e.target.value, 10) || 0;
                                                    setProduct({
                                                        ...product,
                                                        product: updatedItems,
                                                    });
                                                }}
                                                className="w-20 h-9 border border-gray-300 rounded-md p-2 text-center mt-2 mb-2"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200"
                            onClick={() => saveChanges(product)}
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            )}
        </div>
    );


}
