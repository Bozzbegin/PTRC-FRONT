import React, { useState , useEffect } from "react";

export function Modal_ReturnItem({ close, data }) {

    
    const [dataitem,setDataitem] = useState([])
    
     useEffect(() => {
        setDataitem(data[0].products,)
     },[])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
            <div className="w-[950px] h-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-white border-cyan-800 border-2">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 text-cyan-800">
                    <div></div>
                    <h2 className="text-3xl font-bold">รายการเช่าต่อ</h2>
                    <button
                        className="text-lg hover:text-red-300 transition"
                        onClick={close}
                    >
                        ✖
                    </button>
                </div>

                {/* Form Section */}
                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                        <div className="col-span-3 px-10">
                            <table className="table-auto w-full border-collapse">
                                <thead className="bg-slate-200 border-l-2 h-14 text-indigo-800 text-xl sticky top-0 rounded-lg">
                                    <tr>
                                        <th className="px-4 border-l-2 py-2">เลขที่สินค้า</th>
                                        <th className="px-4 border-l-2 py-2">ชื่อสินค้า</th>
                                        <th className="px-4 border-l-2 py-2">ขนาด</th>
                                        <th className="px-4 border-l-2 py-2">จำนวน</th>
                                        <th className="px-4 border-l-2 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataitem.map((item, index) => (
                                        <tr key={index} className="border-2">
                                            <td className="text-center border-l-2 px-4 py-2">{item.code}</td>
                                            <td className="text-center border-l-2 px-4 py-2">{item.name}</td>
                                            <td className="text-center border-l-2 px-4 py-2">{item.size}</td>
                                            <td className="text-center border-l-2 py-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    className="border-2 w-20 rounded-lg h-9 pl-2"
                                                    readOnly
                                                />
                                            </td>
                                            <td className="text-center border-l-2 px-4 py-2">
                                                <input type="checkbox" className="w-4 h-4" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="col-span-3 pt-6 pb-6 text-center">
                    <label className="text-xl text-slate-400">
                        กรุณาเลือกสินค้าที่จะ <span className="text-yellow-500">"เช่าต่อ"</span>
                    </label>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-96 border-t-2 flex justify-center items-center p-4">
                        <button
                            className="px-6 py-2 text-white rounded-md text-lg font-medium transition w-2/6 bg-[#31AB31] hover:bg-green-600"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
