import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { da, th } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const StatusProduct = () => {
  const [status, setStatus] = useState([]);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [error, setError] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reserveId, setReserveId] = useState(0);
  const [isExporting, setIsExporting] = useState(false); // สำหรับการล็อกปุ่ม
  const [isExportingText, setIsExportingText] = useState("ส่งออกสินค้า"); // ข้อความในปุ่ม
  const [filteredStatus, setFilteredStatus] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found");
        }

        const url = "http://192.168.195.75:5000/v1/product/status/status";

        const response = await axios.get(url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        });

        if (response.data.code === 200) {
          setStatus(response.data.data["Status Product"]);
          setFilteredStatus(response.data.data["Status Product"]);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found");
        }

        const url = "http://192.168.195.75:5000/v1/product/status/showbranch";

        const response = await axios.get(url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        });

        if (response.data.code === 200) {
          setBranchName(response.data.data.branch);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setError(error.message);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    handleSearch(); // เรียกค้นหาทุกครั้งที่มีการเปลี่ยนแปลงในฟิลด์ค้นหา
  }, [transactionDate, receiptNumber, branchName]);

  const handleSearch = () => {
    console.log("กำลังกรองข้อมูล...", { receiptNumber, transactionDate, branchName });

    const filtered = status.filter((item) => {
      // กรองข้อมูลตามเลขที่ใบเสร็จ
      const matchesReceiptNumber =
        !receiptNumber || item.export_number_out?.toLowerCase().includes(receiptNumber.toLowerCase().trim());

      // กรองข้อมูลตามวันที่
      const matchesTransactionDate =
        !transactionDate || formatDate(item.created_at) === transactionDate; // เปรียบเทียบวันที่ในรูปแบบ yyyy-mm-dd

      // กรองข้อมูลตามสาขา
      const matchesBranchName =
        !branchName || item.branch_name?.toLowerCase().includes(branchName.toLowerCase().trim());

      return matchesReceiptNumber && matchesTransactionDate && matchesBranchName;
    });

    // การจัดเรียงผลลัพธ์
    const sortedFiltered = filtered.sort((a, b) => {
      // เรียงลำดับตามวันที่ (จากล่าสุดไปเก่าสุด)
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (dateA > dateB) return -1; // ถ้า A ใหม่กว่า B, ให้ A ขึ้นมาก่อน
      if (dateA < dateB) return 1; // ถ้า B ใหม่กว่า A, ให้ B ขึ้นมาก่อน
      return 0; // ถ้าเท่ากัน, ไม่ต้องทำการเรียง
    });

    setFilteredStatus(sortedFiltered); // ตั้งค่าผลลัพธ์ที่กรองและเรียงแล้ว
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // ส่งกลับวันที่ในรูปแบบ yyyy-mm-dd
  };

  const openModal = (id, reserve_id) => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }
    setSelectedProductId(id);
    setIsModalOpen(true);
    setReserveId(reserve_id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <div className="w-full h-[90%] flex overflow-auto no-scrollbar">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full flex items-start justify-start gap-4">
          <div className="flex items-center gap-2">
            <span className="r-2 font-bold text-xl text-sky-800">สาขา :</span>
            <div
              className="h-10 w-[220px] rounded-md border border-gray-500 p-2 flex items-center"
              style={{ overflow: "visible", color: "black" }}
            >
              {/* <input
                type="text"
                value={branchName || ""}
                onChange={(e) => setBranchName(e.target.value)}
                className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
                placeholder="ค้นหาสาขา"
              /> */}
              <p>{branchName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="pr-2 pl-5 font-bold text-xl text-sky-800">
              เลขที่ใบเสร็จ :
            </span>
            <input
              type="text"
              value={receiptNumber || ""}
              onChange={(e) => setReceiptNumber(e.target.value)}
              onKeyUp={handleSearch}  // ค้นหาเมื่อพิมพ์
              className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
              placeholder="ค้นหาเลขที่ใบเสร็จ"
            />
          </div>
          <div className="flex items-center">
            <span className="pr-2 pl-5 font-bold text-xl text-sky-800">
              วันที่ทำรายการ :
            </span>
            <input
              type="date"
              value={transactionDate || ""}
              onChange={(e) => setTransactionDate(e.target.value)}
              onKeyUp={handleSearch}  // ค้นหาเมื่อพิมพ์
              className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
            />
          </div>
        </div>

        {filteredStatus.length === 0 ? (
          <p className="text-center text-2xl mt-10">ไม่พบรายการสินค้า</p>
        ) : (
          <div className="row-span-11 overflow-auto no-scrollbar">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-blue-200 border-l-2  h-14 text-sky-800 text-xl sticky top-0 rounded-lg">
                <tr>
                  <th className="px-4 border-l-2  py-2 rounded-tl-lg border-white">
                    สาขา
                  </th>
                  <th className="px-4 border-l-2  py-2">เลขที่ใบเสร็จ</th>
                  <th className="px-4 border-l-2  py-2">วันที่ทำรายการ</th>
                  <th className="px-4 border-l-2  py-2">
                    นามลูกค้า/ชื่อบริษัท
                  </th>
                  <th className="px-4 border-l-2  py-2">รูปแบบ</th>
                  <th className="px-4 border-l-2  py-2">สถานะ</th>
                  <th className="px-4 border-l-2  py-2 rounded-tr-lg">
                    เพิ่มเติม
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStatus.map((item, index) => (
                  <tr key={index} className="border-2">
                    <td className="text-center border-l-2 px-4 py-2">
                      {item.branch_name}
                    </td>
                    <td className="text-center border-l-2 px-4 py-2">
                      {item.export_number_out || item.export_number}
                    </td>
                    <td className="text-center border-l-2 px-4 py-2">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="text-start border-l-2 px-4 py-2">
                      {item.customer_name}
                    </td>
                    <td className="text-center border-l-2 px-4 py-2">
                      {item.type === 'hire' ? "เช่า" : item.type === 'sell' ? "ขาย" : "เช่า/ขาย"}
                    </td>
                    <td className="text-center border-l-2 px-4 py-2">
                      {item.status === 'reserve' ? "จอง" : "กำลังเช่า"}
                    </td>

                    <td className="text-center border-l-2 px-4 py-2">
                      <button
                        onClick={() => openModal(item.id, item.reserve_id)}
                        className="bg-green-500 text-white w-[100px] bg-[#FFFFFF] h-8 rounded-md border hover:bg-green-700 transition items-center justify-between px-2"
                      >
                        ดูข้อมูล
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal
          isModalOpen={isModalOpen}
          onClose={closeModal}
          itemId={selectedProductId}
          reserveId={reserveId}
          status={status}
          isExporting={isExporting}  // ส่ง isExporting ไปที่ Modal
          isExportingText={isExportingText}  // ส่ง isExportingText ไปที่ Modal
          setIsExporting={setIsExporting} // ส่งฟังก์ชัน setIsExporting ไปที่ Modal
          setIsExportingText={setIsExportingText} // ส่งฟังก์ชัน setIsExportingText ไปที่ Modal
        />

      </div>
    </div>
  );
}

const Modal = ({ isModalOpen, onClose, itemId, status, reserveId }) => {
  const [modalProductDetails, setModalProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [payMent, setPayment] = useState(0);
  const [showAlertShipping, setShowAlertShipping] = useState(false);
  const [vat, setVat] = useState(false);
  const [assemble, setAssemble] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // สำหรับการล็อกปุ่ม
  const [isExportingText, setIsExportingText] = useState("ส่งออกสินค้า"); // ข้อความในปุ่ม

  const formatDateModal = (dateString) => {
    const date = new Date(dateString);
    const buddhistYear = date.getFullYear() + 543;
    return format(date, "d MMMM yyyy", { locale: th }).replace(/[\d]{4}/, buddhistYear);
  };

  useEffect(() => {
    if (isModalOpen) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token not found");

          const url = `http://192.168.195.75:5000/v1/product/status/status-one/${itemId}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              "x-api-key": "1234567890abcdef",
            },
          });

          if (response.data.code === 200) {
            setModalProductDetails(response.data.data);
            if (response.data.data.vat === "vat") {
              setVat(true);
            }
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching item data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isModalOpen, itemId]);

  if (!isModalOpen) return null;


  const handleExportClick = async () => {
    if (!modalProductDetails || !modalProductDetails.products) {
      console.error("ไม่พบข้อมูลสินค้า");
      return;
    }

    // ตรวจสอบว่าอยู่ในระหว่างการส่งออกหรือไม่
    if (isExporting) {
      return; // ถ้ากำลังส่งออกอยู่แล้วจะไม่ทำการส่งออกซ้ำ
    }

    setIsExporting(true); // ตั้งค่า isExporting เป็น true เพื่อไม่ให้กดซ้ำ
    setIsExportingText("กำลังส่ง..."); // เปลี่ยนข้อความบนปุ่มเป็น "กำลังส่ง"

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const url = `http://192.168.195.75:5000/v1/product/outbound/reserve-item/${reserveId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      });

      if (response.data.code === 200) {
        const productData = response.data.data;
        const dataProduct = response.data.data.product;

        const newOutbound = {
          customer_name: productData?.customer_name || "",
          place_name: productData?.place_name || "",
          address: productData?.address || "",
          date: productData?.date || "",
          vat: productData?.vat || "",
          total_price: productData?.total_price_out?.toString() || "0",
          reserve_id: reserveId || "",
          payment: payMent || 0,
          outbound: [
            {
              code: Array.isArray(dataProduct?.code) ? dataProduct.code : [],
              product_id: Array.isArray(dataProduct?.product_id) ? dataProduct.product_id : [],
              price: Array.isArray(dataProduct?.price) ? dataProduct.price : [],
              quantity: Array.isArray(dataProduct?.quantity) ? dataProduct.quantity : [],
              type: Array.isArray(dataProduct?.type) ? dataProduct.type : [],
              size: Array.isArray(dataProduct?.size) ? dataProduct.size : [],
              meter: Array.isArray(dataProduct?.meter) ? dataProduct.meter : [],
              centimeter: Array.isArray(dataProduct?.centimeter) ? dataProduct.centimeter : [],
              assemble: Array.isArray(dataProduct?.assemble) ? dataProduct.assemble : [],
              assemble_price: Array.isArray(dataProduct?.assemble_price) ? dataProduct.assemble_price : [],
              assemble_quantity: Array.isArray(dataProduct?.assemble_quantity) ? dataProduct.assemble_quantity : [],
            },
          ],
        };

        const outboundUrl = `http://192.168.195.75:5000/v1/product/outbound/create-outbound`;
        const outboundResponse = await axios.post(outboundUrl, newOutbound, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        });

        if (outboundResponse.data.code === 201) {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ส่งออกสินค้าเรียบร้อย!",
          }).then(() => {
            onClose();
            window.location.reload();
          });
        } else {
          throw new Error(outboundResponse.data.message);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    } finally {
      setIsExporting(false); // เมื่อเสร็จการส่งออก ให้ปลดล็อกปุ่ม
      setIsExportingText("ส่งออกสินค้า"); // เปลี่ยนข้อความกลับมาเป็น "ส่งออกสินค้า"
    }
  };


  const handleShowAlert = () => {
    setShowAlert(true);
    setPayment(1);
  };

  const handleShowAlertShipping = () => {
    setShowAlertShipping(true);
  };

  const handlePreview = (id) => {
    if (vat === true) {
      navigate("/preorder", { state: { id } });
    } else if (vat === false) {
      navigate("/preorder-nvat", { state: { id } });
    }
  };

  const handleShippingCost = (id) => {
    if (vat === true) {
      navigate("/shipping-vat", { state: { id } });
    } else if (vat === false) {
      navigate("/shipping-nvat", { state: { id } });
    }
  };

  const handleExportToExcelShippingCost = (id) => {

    if (vat === true) {
      navigate("/rentalcontract-vat", { state: { id } });
    } else if (vat === false) {
      navigate("/rentalcontract-nvat", { state: { id } });
    }
  };

  const currentStatus = status.find((item) => item.id === itemId)?.status;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-4xl shadow-lg relative">
        <div className="relative flex items-center justify-center border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {currentStatus === "reserve"
              ? "จองสินค้า"
              : currentStatus === "late"
                ? "เลยกำหนดคืนสินค้า"
                : currentStatus === "hire"
                  ? "ใบส่งของ"
                  : currentStatus === "continue"
                    ? "เช่าต่อ"
                    : currentStatus === "return"
                      ? "ส่งคืนเเล้ว"
                      : currentStatus}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 text-red-500 hover:text-red-600 font-bold text-lg transition duration-300"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-center text-gray-600">กำลังโหล</p>
        ) : error ? (
          <p className="mt-6 text-center text-red-500">{error}</p>
        ) : modalProductDetails ? (

          <div className="mt-6 space-y-2">

            <div className="flex justify-end space-y-1">
              <p className="">
                <strong className="text-gray-700">เลขที่ Po : </strong>{" "}
                {modalProductDetails.reserve_number}
              </p>
            </div>

            {currentStatus != 'reserve' && (
              <p className="text-right mb-2">
                <strong className="text-gray-700">เลขที่สัญญาเช่า : </strong>{" "}
                {modalProductDetails.export_number_out}
              </p>
            )}

            <div className="w-1/2 mt-4">

              {currentStatus === 'reserve' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่จองสินค้า : </strong>{" "}
                  {formatDateModal(modalProductDetails.reserve_out)}
                </p>
              )}

              {currentStatus === 'hire' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่ส่งสินค้า : </strong>{" "}
                  {formatDateModal(modalProductDetails.reserve_out)}
                </p>
              )}

              {currentStatus === 'return' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่ครบกำหนดคืนสินค้า: </strong>{" "}
                  {formatDateModal(new Date(
                    (new Date(modalProductDetails.reserve_out).getTime() + 1 * 24 * 60 * 60 * 1000) + modalProductDetails.date * 24 * 60 * 60 * 1000
                  )
                  )}
                </p>
              )}

              {currentStatus === 'continue' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่เช่าต่อสินค้า : </strong>{" "}
                  {formatDateModal(modalProductDetails.reserve_out)}
                </p>
              )}

              <div className="flex items-center space-x-4 mb-2">
                <strong className="text-gray-700"> จำนวนวันที่เช่า : </strong>{" "}
                {modalProductDetails.date + " วัน " + "(" + formatDateModal(new Date(new Date(modalProductDetails.reserve_out).getTime() + 1 * 24 * 60 * 60 * 1000)) + " - " +
                  formatDateModal(
                    new Date(
                      (new Date(modalProductDetails.reserve_out).getTime() + 1 * 24 * 60 * 60 * 1000) + modalProductDetails.date * 24 * 60 * 60 * 1000
                    )
                  ) + ")"}
              </div>

              <div className="flex items-center space-x-4 mb-2">
                <p>
                  <strong className="text-gray-700"> ชื่อผู้ติดต่อ : </strong>
                  {modalProductDetails.customer_name ? modalProductDetails.customer_name : "-"}
                </p>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <p>
                  <strong className="text-gray-700"> ชื่อบริษัท : </strong>
                  {modalProductDetails.company_name ? modalProductDetails.company_name : "-"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <p>
                  <strong className="text-gray-700"> ที่อยู่ : </strong>
                  {modalProductDetails.address ? modalProductDetails.address : "-"}
                </p>
              </div>

            </div>


            <div className="mt-4 ">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                รายการสินค้า
              </h3>
              <div className="relative">
                <div className="absolute inset-0 bg-[url('https://example.com/path-to-your-image.png')] bg-no-repeat bg-center bg-contain opacity-20"></div>
                <div className="relative z-10">
                  <h1>
                    <div className="">
                      <table className="w-full border-collapse border shadow-sm">
                        <thead className="bg-blue-300 text-gray-700">
                          <tr>
                            <th className="border p-2">จำนวน</th>
                            <th className="border p-2">ชื่อสินค้า</th>
                            <th className="border p-2">ขนาด</th>
                          </tr>
                        </thead>
                        <tbody className="overflow-y-auto max-h-64">
                          {modalProductDetails.products.map((product, index) => (
                            <tr key={product.product_id} className="hover:bg-gray-50 transition duration-200">
                              <td className="border p-2 text-center">
                                {product.quantity} {product.unit ? product.unit : product.unit_asm}
                              </td>
                              <td className="border p-2 text-center">
                                {modalProductDetails.quotation_type === "with_assembled"
                                  ? product.assemble_name || `${product.name} (${product.code})`  // ถ้ามี assemble_name ให้ใช้ assemble_name ถ้าไม่มีก็ใช้ name
                                  : `${product.name} (${product.code})`}
                              </td>
                              <td className="border p-2 text-center">
                                {product.size}
                                {modalProductDetails.quotation_type === "with_assembled" && product.description
                                  ? ` ${product.description}`  // แสดง description ในกรณีที่เป็น "with_assembled" และมี description
                                  : ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  </h1>
                </div>
              </div>


            </div>

          </div>
        ) : (
          <p className="mt-6 text-center text-gray-600">ไม่พบข้อมูลสินค้า</p>
        )}

        {currentStatus === "reserve" && (
          <div className="mt-4 flex justify-around">
            <button
              onClick={() => handlePreview(itemId)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-700 transition duration-200"
            >
              <span className="fa-solid fa-print"></span>
              <span> พิมพ์ใบเสนอราคา</span>
            </button>

            <button
              onClick={handleExportClick}
              disabled={isExporting} // ปิดการใช้งานปุ่มเมื่อกำลังส่งออก
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition duration-200"
            >
              <span className="fa-solid fa-file-export"></span>
              <span>{isExportingText}</span> {/* เปลี่ยนข้อความของปุ่ม */}
            </button>


          </div>
        )}

        {currentStatus === "hire" && (
          <div className="mt-12 flex justify-around">
            <button
              onClick={() => handleShippingCost(itemId)}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700 transition duration-200"
            >
              <span className="fa-solid fa-print"></span>
              <span> พิมพ์ใบส่งของ</span>
            </button>
            <button
              onClick={() => handleExportToExcelShippingCost(itemId)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition duration-200"
            >
              <span className="fa-solid fa-print"></span>
              <span> พิมพ์ใบสัญญาเช่า</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusProduct;
