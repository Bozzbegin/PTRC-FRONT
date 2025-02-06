import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { da, th } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const StatusProduct = () => {
  const [status, setStatus] = useState([]);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptNumberOut, setReceiptNumberOut] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [error, setError] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reserveId, setReserveId] = useState(0);
  const [isExporting, setIsExporting] = useState(false); // สำหรับการล็อกปุ่ม
  const [isExportingText, setIsExportingText] = useState("ส่งออกสินค้า"); // ข้อความในปุ่ม
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [selectMode, setSelectMode] = useState(false); // ควบคุมการแสดง Checkbox
  const [Id_status, setId_status] = useState([]); // เก็บค่า ID ที่เลือก

  // ฟังก์ชันจัดการการเลือก Checkbox
  const handleSelectStatus = (id) => {
    setId_status((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [...prev, { id }];
      }
    });
  };
  const handleRserve = async () => {
    if (Id_status.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกสถานะที่ต้องการเปลี่ยนกลับเป็นจอง",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const url = "http://192.168.195.75:5000/v1/product/status/set-reserve";

      // ✅ แสดง Swal Confirm ก่อนยกเลิก
      const result = await Swal.fire({
        title: "ยืนยันการเปลี่ยนสถานะกลับมาเป็นจอง ?",
        text: "คุณต้องการเปลี่ยนสถานะสินค้าที่เลือกเป็น 'จอง' หรือไม่?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // ✅ สีเขียวสด
        cancelButtonColor: "#d33", // ❌ สีแดง
        confirmButtonText: "ใช่, จองเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) {
        return; // ❌ ถ้ากดยกเลิก ให้หยุดทำงาน
      }

      // ✅ ส่ง API
      const response = await axios.post(
        url,
        { choose_status: Id_status },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        }
      );

      if (response.data.code === 200) {
        // ✅ แสดง Swal Success
        Swal.fire({
          icon: "success",
          title: "เปลี่ยนสถานะสำเร็จ!",
          text: "สถานะที่เลือกถูกเปลี่ยนเป็นเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload();
        });

        setId_status([]); // ✅ เคลียร์ค่า หลังส่ง API สำเร็จ

      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);

      // ✅ แสดง Swal Error
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: error.message || "ไม่สามารถดำเนินการได้",
        confirmButtonText: "ตกลง",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  // ฟังก์ชันส่ง API เพื่อยกเลิกสถานะ
  const handleCancel = async () => {
    if (Id_status.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกสถานะที่ต้องการยกเลิก",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const url = "http://192.168.195.75:5000/v1/product/status/set-cancel";

      // ✅ แสดง Swal Confirm ก่อนยกเลิก
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการยกเลิกสถานะที่เลือกหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ยกเลิกเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) {
        return; // ❌ ถ้ากดยกเลิก ให้หยุดทำงาน
      }

      // ✅ ส่ง API
      const response = await axios.post(
        url,
        { choose_status: Id_status },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        }
      );

      if (response.data.code === 200) {
        // ✅ แสดง Swal Success
        Swal.fire({
          icon: "success",
          title: "ยกเลิกสถานะสำเร็จ!",
          text: "สถานะที่เลือกถูกยกเลิกเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload();
        });

        setId_status([]); // ✅ เคลียร์ค่า หลังส่ง API สำเร็จ

      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);

      // ✅ แสดง Swal Error
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: error.message || "ไม่สามารถดำเนินการได้",
        confirmButtonText: "ตกลง",
      }).then(() => {
        window.location.reload();
      });
    }
  };



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
  }, [transactionDate, receiptNumber, branchName, receiptNumberOut]);

  const handleSearch = () => {

    const filtered = status.filter((item) => {
      // กรองข้อมูลตามเลขที่ใบเสร็จ
      const matchesReceiptNumber =
        !receiptNumber || item.export_number?.toLowerCase().includes(receiptNumber.toLowerCase().trim());

      const matchesReceiptNumberOut =
        !receiptNumberOut || item.export_number_out?.toLowerCase().includes(receiptNumber.toLowerCase().trim());

      // กรองข้อมูลตามวันที่
      const matchesTransactionDate =
        !transactionDate || formatDate(item.created_at) === transactionDate; // เปรียบเทียบวันที่ในรูปแบบ yyyy-mm-dd

      // กรองข้อมูลตามสาขา
      const matchesBranchName =
        !branchName || item.branch_name?.toLowerCase().includes(branchName.toLowerCase().trim());

      return matchesReceiptNumber && matchesTransactionDate && matchesBranchName && matchesReceiptNumberOut;
    });

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
    setDateExport(null);
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
              เลขที่ใบส่งค้า :
            </span>
            <input
              type="text"
              value={receiptNumberOut || ""}
              onChange={(e) => setReceiptNumberOut(e.target.value)}
              onKeyUp={handleSearch}  // ค้นหาเมื่อพิมพ์
              className="h-10 w-[220px] rounded-md border border-gray-500 p-2"
              placeholder="ค้นหาเลขที่ใบส่งสินค้า"
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
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectMode(!selectMode)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {selectMode ? "ยกเลิกการเลือก" : "เลือกหลายรายการ"}
              </button>
              {selectMode && (
                <div className="flex justify-center ms-4">
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    ยกเลิกรายการที่เลือก ({Id_status.length})
                  </button>
                  <div className="ms-4">
                    <button
                      onClick={handleRserve}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      เปลี่ยนเป็นจอง ({Id_status.length})
                    </button></div>

                </div>
              )}
            </div>

            <table className="table-auto w-full border-collapse">
              <thead className="bg-blue-200 border-l-2 h-14 text-sky-800 text-xl sticky top-0 rounded-lg">
                <tr>
                  <th className="px-4 py-2 border-l-2 rounded-tl-lg rounded-br-sm">เลขที่ใบเสร็จ</th>
                  <th className="px-4 py-2 border-l-2">วันที่ทำรายการ</th>
                  <th className="px-4 py-2 border-l-2">นามลูกค้า/ชื่อบริษัท</th>
                  <th className="px-4 py-2 border-l-2">รูปแบบ</th>
                  <th className="px-4 py-2 border-l-2">สถานะ</th>
                  <th className="px-4 py-2 border-l-2 rounded-tr-lg rounded-br-sm">เพิ่มเติม</th>
                  {selectMode && <th className="px-4 py-2 border-l-2">เลือก</th>} {/* Checkbox Header */}
                </tr>
              </thead>
              <tbody>
                {filteredStatus.map((item, index) => (
                  <tr key={index} className="border-2">
                    <td className="text-center border-l-2 px-4 py-2">{item.export_number_out || item.export_number}</td>
                    <td className="text-center border-l-2 px-4 py-2">{formatDate(item.created_at)}</td>
                    <td className="text-start border-l-2 px-4 py-2">{item.customer_name ? item.customer_name : item.company_name}</td>
                    <td className="text-center border-l-2 px-4 py-2">
                      {"เช่า"}
                    </td>
                    <td className="text-center text-xl border-l-2 px-4 py-2">
                      {item.status === "reserve" ? (
                        <div className="text-yellow-400 font-bold">จอง</div>
                      ) : item.status === "cancel" ? (
                        <div className="text-red-500 font-bold">ยกเลิก</div>
                      ) : item.status === "hire" ? (
                        <div className="text-green-500 font-bold">กำลังเช่า</div>
                      ) : item.status === "return" ? (
                        <div className="text-blue-500 font-bold">คืนสินค้าครบแล้ว</div>
                      ) : item.status === "late" ? (
                        <div className="text-white bg-red-300 rounded-md font-bold">เลยกำหนด</div>
                      ) : item.status === "continue" ? (
                        "เช่าต่อ"
                      ) : (
                        item.status
                      )}
                    </td>
                    <td className="text-center border-l-2 px-4 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(item.id, item.reserve_id);
                        }}
                        className="bg-green-500 text-white w-[100px] h-8 rounded-md border hover:bg-green-700 transition items-center justify-between px-2"
                      >
                        ดูข้อมูล
                      </button>
                    </td>
                    {selectMode && ( // แสดง Checkbox เมื่อกดปุ่ม "เลือกหลายรายการ"
                      <td className="text-center px-4 py-2 border-l-2">
                        <input
                          type="checkbox"
                          checked={Id_status.some((s) => s.id === item.id)}
                          onChange={() => handleSelectStatus(item.id)}
                          className="w-5 h-5"
                        />
                      </td>
                    )}
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
  const [DateExport, setDateExport] = useState(null);
  const [startDate, setStartDate] = useState(null); // กำหนด startDate
  const [endDate, setEndDate] = useState(null);
  const [rawDate, setRawDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");



  const formatDateModal = (selectedDate) => {
    const date = new Date(selectedDate);
    const buddhistYear = date.getFullYear() + 543;
    return format(date, "d MMMM yyyy", { locale: th }).replace(/[\d]{4}/, buddhistYear);
  };

  // แปลงจาก yyyy-mm-dd เป็น dd/mm/yyyy
  const formatToDDMMYYYY = (dateString) => {
    console.log("before", dateString);

    const [year, month, day] = dateString.split("-"); // แยกปี, เดือน, วัน
    return `${day}/${month}/${year}`; // จัดรูปแบบใหม่เป็น dd/mm/yyyy
  };

  // ฟังก์ชันแปลงวันที่เป็นวัน/เดือน/ปี ภาษาไทย
  const formatDateToThai = (date) => {
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');  // วัน
    const month = months[d.getMonth()];  // เดือน
    const year = d.getFullYear() + 543;  // ปีไทย (เพิ่ม 543)

    return `${day} ${month} ${year}`;
  };

  const handleDateExport = (event) => {
    const selectedDate = event.target.value; // ค่าที่เลือกในรูปแบบ yyyy-mm-dd
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Combine date and time into `YYYY-MM-DD HH:MM:SS`
    const formattedDateTime = `${selectedDate} ${hours}:${minutes}:${seconds}`;

    // Set to state (if using React)
    setDateExport(formattedDateTime);
    console.log(formattedDateTime);

    const nextDay = new Date(selectedDate);
    const formatted = formatDateToThai(selectedDate);
    // ตั้งค่าวันที่เริ่มเช่า (วันถัดไปจากวันที่เลือก)
    nextDay.setDate(nextDay.getDate() + 1);
    const formattedStartDate = formatDateToThai(nextDay); // ฟังก์ชันที่แปลงวันที่เป็นรูปแบบไทย
    setStartDate(formattedStartDate);


    // คำนวณวันสิ้นสุดเช่า (เพิ่มจำนวนวันที่จาก modalProductDetails.date)
    const endDateCalculated = new Date(nextDay);
    endDateCalculated.setDate(endDateCalculated.getDate() + (modalProductDetails.date) - 1); // เพิ่มจำนวนวันที่ตาม modalProductDetails.date
    const formattedEndDate = formatDateToThai(endDateCalculated);
    setEndDate(formattedEndDate);



    setRawDate(formatted);
    console.log("test", formatted);



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
          company_name: productData?.company_name || "",
          place_name: productData?.place_name || "",
          address: productData?.address || "",
          date: productData?.date || "",
          vat: productData?.vat || "",
          total_price: productData?.total_price_out?.toString() || "0",
          reserve_id: reserveId || "",
          payment: payMent || 0,
          actual_out: DateExport,
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
        title: "กรุณาเลือกวันที่ส่งของ",

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
                    : currentStatus === "cancel"
                      ? "ยกเลิก"
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

            <div className="w-3/4 mt-4">

              {currentStatus === 'reserve' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่จองสินค้า : </strong> <span className="ms-2"></span>
                  {formatDateModal(modalProductDetails.reserve_out)}
                </p>
              )}

              {currentStatus === 'hire' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่ส่งสินค้า : </strong><span className="ms-2"></span>
                  {formatDateModal(modalProductDetails.actual_out)}
                </p>
              )}


              {currentStatus === 'return' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่ครบกำหนดคืนสินค้า: </strong><span className="ms-2"></span>
                  {formatDateModal(new Date(
                    (new Date(modalProductDetails.actual_out).getTime() + 0 * 24 * 60 * 60 * 1000) + modalProductDetails.date * 24 * 60 * 60 * 1000
                  )
                  )}
                </p>
              )}

              {currentStatus === 'continue' && (
                <p className="mb-2">
                  <strong className="text-gray-700">วันที่เช่าต่อสินค้า : </strong>{" "}<span className="ms-2"></span>
                  {formatDateModal(modalProductDetails.reserve_out)}
                </p>
              )}

              <div className="flex items-center space-x-4 mb-2">
                <strong className="text-gray-700"> จำนวนวันที่เช่า : </strong>{" "}<span className="ms-1"></span>
                {modalProductDetails.date + " วัน "}
              </div>
              <div>

              </div>
              {modalProductDetails.status === 'reserve' && (
                <div className="flex items-center space-x-4 mb-2">
                  <strong className="text-gray-700">เลือกวันส่ง: </strong>
                  <input
                    type="date"
                    className="text-md"
                    value={rawDate}
                    onChange={handleDateExport}
                  />
                  <span>{rawDate ? `วันที่ที่เลือก: ${rawDate}` : "ยังไม่ได้เลือกวันที่"}</span>
                </div>
              )}

              <div>
                <>
                  {modalProductDetails.status === 'reserve' ? <><div className="flex items-center space-x-4 mb-2">
                    <strong className="text-gray-700">สัญญาเช่า: </strong><span className="ms-2"></span>
                    {startDate ? (
                      <>
                        {startDate} <span>-</span> <span></span>{endDate ? endDate : "คำนวณวันสิ้นสุด"}
                      </>
                    ) : (
                      "เลือกวันส่งก่อน"
                    )}
                  </div>

                    <div className="flex items-center space-x-4 mb-2">
                      <p>
                        <strong className="text-gray-700"> ชื่อผู้ติดต่อ : </strong> <span className="ms-2"></span>
                        {modalProductDetails.customer_name ? modalProductDetails.customer_name : "-"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <p>
                        <strong className="text-gray-700"> ชื่อบริษัท : </strong> <span className="ms-2"></span>
                        {modalProductDetails.company_name ? modalProductDetails.company_name : "-"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p>
                        <strong className="text-gray-700"> ที่อยู่ : </strong> <span className="ms-2"></span>
                        {modalProductDetails.address ? modalProductDetails.address : "-"}
                      </p>
                    </div>
                  </>
                    : <>
                      {modalProductDetails.status === 'hire' ? <>
                        <div className="flex items-center space-x-4 mb-2">
                          <strong className="text-gray-700">สัญญาเช่า: </strong><span className="ms-2"></span>
                          {formatDateModal(new Date(
                            (new Date(modalProductDetails.actual_out).getTime() + 1 * 24 * 60 * 60 * 1000)
                          )
                          )} <span>-</span><span></span>
                          {formatDateModal(new Date(
                            (new Date(modalProductDetails.actual_out).getTime() + 0 * 24 * 60 * 60 * 1000) + modalProductDetails.date * 24 * 60 * 60 * 1000
                          )
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                          <p>
                            <strong className="text-gray-700"> ชื่อผู้ติดต่อ : </strong> <span className="ms-2"></span>
                            {modalProductDetails.customer_name ? modalProductDetails.customer_name : "-"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <p>
                            <strong className="text-gray-700"> ชื่อบริษัท : </strong> <span className="ms-2"></span>
                            {modalProductDetails.company_name ? modalProductDetails.company_name : "-"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p>
                            <strong className="text-gray-700"> ที่อยู่ : </strong> <span className="ms-2"></span>
                            {modalProductDetails.address ? modalProductDetails.address : "-"}
                          </p>
                        </div>
                      </>
                        : <>
                          <div className="flex items-center space-x-4 mb-2">
                            <strong className="text-gray-700">สัญญาเช่า: </strong><span className="ms-2"></span>
                            {modalProductDetails ? (
                              <>
                                {startDate} <span>-</span> <span></span>{endDate ? endDate : "คำนวณวันสิ้นสุด"}
                              </>
                            ) : (
                              "เลือกวันส่งก่อน"
                            )}
                          </div>

                          <div className="flex items-center space-x-4 mb-2">
                            <p>
                              <strong className="text-gray-700"> ชื่อผู้ติดต่อ : </strong> <span className="ms-2"></span>
                              {modalProductDetails.customer_name ? modalProductDetails.customer_name : "-"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <p>
                              <strong className="text-gray-700"> ชื่อบริษัท : </strong> <span className="ms-2"></span>
                              {modalProductDetails.company_name ? modalProductDetails.company_name : "-"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p>
                              <strong className="text-gray-700"> ที่อยู่ : </strong> <span className="ms-2"></span>
                              {modalProductDetails.address ? modalProductDetails.address : "-"}
                            </p>
                          </div>
                        </>}
                    </>
                  }
                </>
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
