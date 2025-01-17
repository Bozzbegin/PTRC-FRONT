import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal_Outbound } from "./Modal_Outbound";
import { Modal_Assemble } from "./Modal_Assemble";
import { ModalDiscount } from "./Modal_Discount";
import { Modal_Create_Products } from "./Modal_Create_Products";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Outbound() {
  const [branch, setBranch] = useState("");
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [comName, setComName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [customer_tel, setcustomer_tel] = useState("");
  const [workside, setWorkside] = useState("");
  const [sell_date, setSell_date] = useState("");
  const [day_length, setDay_Length] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //------------------------------------------------------
  const [items, setItems] = useState([]);
  const [netPrice, setNetPrice] = useState(0);
  const [showmodal, setShowmodal] = useState(false);
  const [showmodalASM, setShowmodalASM] = useState(false);
  const [confirmitemASM, setConfirmitemASM] = useState([]);
  const [showModalDiscount, setShowModalDiscount] = useState(false);
  const [showmodal_create_product, setShowmodal_create_product] = useState(false);
  const [confirmitem, setConfirmitem] = useState([]);
  const [confirmitem_create, setConfirmItem_Create] = useState([]);
  const [withHolDing, setWithHolDing] = useState(true);
  const [hasVat, setHasVat] = useState(true);
  const [Item_sendto_database, setItem_sendto_database] = useState([]);
  const [validateModalInput, setValidateModalInput] = useState(false)
  const [alldata_default, setAlldata_default] = useState([{}]);

  const [formData, setFormData] = useState({});
  const [quantitySum, setQuantitySum] = useState(0);
  const navigate = useNavigate();
  const combinedItems = [
    ...confirmitem.map((item) => ({
      ...item,
      isAssemble: false,
    })),
    ...confirmitemASM.map((item) => ({
      ...item,
      id_asm: item.id_asm,
      isAssemble: true,
    })),
  ];

  useEffect(() => {
    console.log("Loading data from localStorage...");
    const savedData = JSON.parse(localStorage.getItem("outboundFormData"));
    if (savedData) {
      console.log("Loaded Data:", savedData);
      setBranch(savedData.branch || "");
      setProducts(savedData.products || []);
      setName(savedData.name || "");
      setComName(savedData.comName || "");
      setAddress(savedData.address || "");
      setPhone(savedData.phone || "");
      setcustomer_tel(savedData.customer_tel || "");
      setWorkside(savedData.workside || "");
      setSell_date(savedData.sell_date || "");
      setDay_Length(savedData.day_length || "");
      setItems(savedData.items || []);
      setNetPrice(savedData.netPrice || 0);
      setConfirmitem(savedData.confirmitem || []);
      setConfirmitemASM(savedData.confirmitemASM || []);
      setConfirmItem_Create(savedData.confirmitem_create || []);
      setHasVat(savedData.hasVat || true);
      setWithHolDing(savedData.withHolDing || true);
      setItem_sendto_database(savedData.Item_sendto_database || []);
      setValidateModalInput(savedData.validateModalInput || false);
      setAlldata_default(savedData.alldata_default || [{}]);
      setFormData(savedData.formData || {});
      setQuantitySum(savedData.quantitySum || 0);
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  const menu = [
    { title: "ชื่อผู้มาติดต่อ :", type: "text" },
    { title: "ชื่อบริษัท :", type: "text" },
    { title: "ชื่อไซต์งาน :", type: "text" },
    { title: "ที่อยู่ลูกค้า :", type: "text" },
    { title: "วันที่เสนอ :", type: "date" },
    { title: "เบอร์สำนักงาน :", type: "text" },
    { title: "เบอร์โทรศัพท์ :", type: "text" },

  ];

  const today = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("th-TH", options);

  const handleVatChange = (e) => {
    setHasVat(e.target.value === "true");
  };

  const handleWithHolDingChange = (e) => {
    setWithHolDing(e.target.value === "true");
  };

  useEffect(() => {
    const totalPrice = confirmitem.reduce(
      (total, item) =>
        total + ((item.price || item.price3D || 0) * (item.amount || 0)),
      0
    );

    const vat = hasVat ? totalPrice * 0.07 : 0;
    setNetPrice(totalPrice + vat);
  }, [confirmitem, hasVat]);

  const handleConfirm = (items) => {
    const updatedItems = items.map((item) => ({
      ...item,
      type: item.type || "เช่า",
      price: 0,
    }));
    setConfirmitem(updatedItems);
    updateQuantitySum();
  };
  const handleConfirmASM = (items) => {
    const updatedItemsASM = items.map((item) => ({
      ...item,
      type: item.type || "เช่า", // ค่าเริ่มต้น
      price: 0,                 // ค่าเริ่มต้น
      isAssemble: true,         // เพิ่ม isAssemble: true
    }));
    setConfirmitemASM(updatedItemsASM); // ต้องเรียก setConfirmitemASM แทน
    updateQuantitySum();
  };

  const handleConfirmDiscount = (items) => {
    const updatedItems = items.map((item) => ({
      ...item,
      type: item.type || "เช่า",
      price: 0,
    }));
    setConfirmitem(updatedItems);
  };


  const handleDateChange = (dateValue) => {
    const date = new Date(dateValue);
    const options = { day: "numeric", month: "short", year: "2-digit" };
    const formattedDate = date.toLocaleDateString("th-TH", options);
    setSell_date(formattedDate);
  };

  const parseThaiDate = (thaiDate) => {
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    const [day, month, year] = thaiDate.split(" ");
    const monthIndex = thaiMonths.indexOf(month);
    if (monthIndex === -1) return null;

    const fullYear = parseInt(year, 10) + 2500 - 543;
    return `${fullYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const calculateEndDate = (thaiStartDate, dayLength) => {
    const isoStartDate = parseThaiDate(thaiStartDate);
    if (!isoStartDate) return "วันที่ไม่ถูกต้อง";

    const start = new Date(isoStartDate);
    if (isNaN(start.getTime())) return "กรอกจำนวนวันที่เช่าก่อน";

    start.setDate(start.getDate() + parseInt(dayLength, 10));
    const options = { day: "numeric", month: "short", year: "2-digit" };
    return start.toLocaleDateString("th-TH", options);
  };

  const updateQuantitySum = () => {
    const totalItems = confirmitem.length + confirmitemASM.length;
    console.log(confirmitemASM.length);
    console.log(confirmitem.length);
    // รวมจำนวนรายการสินค้าธรรมดาและ Assemble
    setQuantitySum(totalItems);
  };

  // ฟังก์ชันปิด Modal สินค้าปกติ
  const closeModal = (data) => {
    updateQuantitySum(); // อัปเดตจำนวนรายการ
    setShowmodal(false); // ปิด modal
  };

  // ฟังก์ชันปิด Modal ASM
  const closeModalASM = (data) => {
    if (data) {
      setFormData(data);
    }
    updateQuantitySum(); // อัปเดตจำนวนรายการ
    setShowmodalASM(false); // ปิด modal ASM
  };

  const closeModalDiscount = (data) => {
    if (data) {
      setFormData(data);
    }
    setShowModalDiscount(false);
  };

  const closeModal_Create = () => {
    setShowmodal_create_product(false);
    setValidateModalInput(false)
  };

  const handleModelChange = (id, value, isAssemble = false) => {
    if (isAssemble) {
      // สำหรับสินค้าประกอบ (confirmitemASM)
      const index = confirmitemASM.findIndex((item) => item.id_asm === id);
      if (index !== -1) {
        const updatedConfirmItemASM = [...confirmitemASM];
        updatedConfirmItemASM[index] = {
          ...updatedConfirmItemASM[index],
          type: value, // อัปเดตค่า type
        };
        setConfirmitemASM(updatedConfirmItemASM);
      }
    } else {
      // สำหรับสินค้าปกติ (confirmitem)
      const index = confirmitem.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedConfirmItem = [...confirmitem];
        updatedConfirmItem[index] = {
          ...updatedConfirmItem[index],
          type: value, // อัปเดตค่า type
        };
        setConfirmitem(updatedConfirmItem);
      }
    }
  };


  const handleAmountChange = (id, value, isAssemble = false) => {
    const parsedValue = parseInt(value, 10) || 0; // แปลงค่า input เป็นจำนวนเต็ม
    if (isAssemble) {
      // สำหรับสินค้าประกอบ
      const index = confirmitemASM.findIndex((item) => item.id_asm === id);
      if (index !== -1) {
        const updatedConfirmItemASM = [...confirmitemASM];
        updatedConfirmItemASM[index] = {
          ...updatedConfirmItemASM[index],
          amountASM: parsedValue, // อัปเดตจำนวนสินค้า
        };
        setConfirmitemASM(updatedConfirmItemASM);
      } else {
        console.error("Invalid id_asm:", id);
      }
    } else {
      // สำหรับสินค้าปกติ
      const index = confirmitem.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedConfirmItem = [...confirmitem];

        // เช็คเงื่อนไข 30 วัน และกำหนดราคา
        const priceToUse =
          day_length > 30
            ? updatedConfirmItem[index].price30D || updatedConfirmItem[index].price || 0
            : updatedConfirmItem[index].price || updatedConfirmItem[index].price3D || 0;

        updatedConfirmItem[index] = {
          ...updatedConfirmItem[index], // รักษาข้อมูลเดิม
          amount: parsedValue, // อัปเดตจำนวนสินค้า
          calculatedPrice: priceToUse, // กำหนดราคาที่เหมาะสม
        };

        setConfirmitem(updatedConfirmItem);
      } else {
        console.error("Invalid id:", id);
      }
    }
  };

  const handlePriceAPI = (id, value, isAssemble = false) => {
    const parsedValue = parseFloat(value) || 0; // แปลงค่า input เป็นจำนวนเต็ม
    if (isAssemble) {
      const index = confirmitemASM.findIndex((item) => item.id_asm === id);
      if (index !== -1) {
        const updatedConfirmItemASM = [...confirmitemASM];
        updatedConfirmItemASM[index] = {
          ...updatedConfirmItemASM[index],
          assemble_price: parsedValue, // อัปเดตราคา
        };
        setConfirmitemASM(updatedConfirmItemASM);
      } else {
        console.error("Invalid id_asm:", id);
      }
    } else {
      // สำหรับสินค้าปกติ
      const index = confirmitem.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedConfirmItem = [...confirmitem];
        updatedConfirmItem[index] = {
          ...updatedConfirmItem[index],
          price: parsedValue, // อัปเดตราคา
        };
        setConfirmitem(updatedConfirmItem);
      } else {
        console.error("Invalid id:", id);
      }
    }
  };

  // ฟังก์ชันลบสินค้า
  const handleDeleteItem = (isAssemble, id) => {
    if (isAssemble) {
      // ลบสินค้าประกอบ (ASM)
      const updatedConfirmItemASM = confirmitemASM.filter((item) => item.id_asm !== id);
      setConfirmitemASM(updatedConfirmItemASM);
    } else {
      // ลบสินค้าปกติ
      const updatedConfirmItem = confirmitem.filter((item) => item.id !== id);
      setConfirmitem(updatedConfirmItem);
    }
    updateQuantitySum();
  };

  const confirm_order = async () => {

    resetForm();

    if (!name || !workside || !address || !day_length || confirmitem.length === 0 || confirmitem.some((item) => !item.price && !item.price3D)) {

      Swal.fire({
        icon: "warning",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonText: "ตกลง"
      });
      return;

    }

    console.log(confirmitem.price);

    const reserve = [
      combinedItems.reduce(
        (acc, item) => {
          if (item.isAssemble) {
            acc.assemble.push(String(item.id_asm));
            acc.assemble_quantity.push(String(item.amountASM || 0));
            acc.assemble_price.push(String(item.assemble_price || 0));
            acc.assemble_service_price.push(String(item.assemble_service_price || 0));
          } else {
            acc.code.push(item.code || "");
            acc.product_id.push(String(item.id));
            acc.price.push(
              item.type === "ขาย"
                ? String(item.price || 0)
                : String(item.price3D || 0)
            );
            acc.quantity.push(String(item.amount || 0));
            acc.size.push(item.size || "");
            acc.type.push(item.type === "เช่า" ? "0" : "1");
          }
          return acc;
        },
        {
          code: [],
          product_id: [],
          price: [],
          quantity: [],
          size: [],
          assemble: [],
          assemble_quantity: [],
          assemble_price: [],
          assemble_service_price: [],
          type: [],
          typeASM: [],
        }
      ),
    ];

    const newOrder = {
      customer_name: name,
      company_name: comName,
      place_name: workside,
      phone: phone,
      address,
      date: day_length,
      date_sell: sell_date,
      customer_tel: customer_tel, // เพิ่ม customer_tel เพื่อให้ตรงกับ API
      reserve: reserve,
      assemble_status: confirmitem_create.assemble_status || false,
      vat: hasVat ? "vat" : "nvat",
      ...formData,
      proponent_name: "bossinwza007",
      average_price: 0,
    };

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://192.168.195.75:5000/v1/product/outbound/create-reserve",
        newOrder,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "x-api-key": "1234567890abcdef",
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "เพิ่มข้อมูลสำเร็จ",
        confirmButtonText: "ตกลง",
      }).then(() => {
        navigate("/status");
      });
      console.log("send success");
    } catch (err) {
      console.error("Error sending order:", err);
      Swal.fire({
        icon: "error",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setIsLoading(false); // ปิดสถานะกำลังโหลด
    }

    setItem_sendto_database((predata) => [...predata, newOrder]);
  };
  useEffect(() => {
    updateQuantitySum(); // อัปเดตจำนวนเมื่อ confirmitem หรือ confirmitemASM เปลี่ยน
  }, [confirmitem, confirmitemASM]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://192.168.195.75:5000/v1/product/outbound/profile", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setBranch(res.data.data.branch_name);
        }
      });

  }, []);

  const inputs = [name, address, workside, sell_date, day_length];

  useEffect(() => {
    const allInputsValid = inputs.every(input => input.length > 0);
    setValidateModalInput(allInputsValid);
  }, [inputs]);

  const handlePreview = () => {
    if (hasVat === true) {
      navigate("/preoutbound-vat");
    } else {
      navigate("/preoutbound-nvat");
    }
  };

  const saveToLocalStorage = () => {
    const reserveData = {
      code: [],
      product_name: [],
      product_id: [],
      price: [],
      quantity: [],
      size: [],
      centimeter: [],
      meter: [],
      type: [],
      assemble: [],
      assemble_name: [],
      assemble_quantity: [],
      assemble_price: [],
      description: [],
      assemble_service_price: [],
    };

    combinedItems.forEach(item => {
      if (item.isAssemble) {
        reserveData.assemble.push(String(item.id_asm || ""));
        reserveData.assemble_name.push(String(item.assemble_name || ""));
        reserveData.assemble_quantity.push(String(item.amountASM || 0));
        reserveData.assemble_price.push(String(item.assemble_price || 0));
        reserveData.description.push(String(item.description || ""));
        reserveData.assemble_service_price.push(String(item.assemble_service_price || 0));
      } else {
        reserveData.code.push(item.code || "");
        reserveData.product_id.push(String(item.id || ""));
        reserveData.product_name.push(String(item.name || ""));
        reserveData.price.push(String(item.type === "ขาย" ? item.price || 0 : item.price3D || 0));
        reserveData.quantity.push(String(item.amount || 0));
        reserveData.size.push(item.size || "");
        reserveData.centimeter.push(item.centimeter || "");
        reserveData.meter.push(item.meter || "");
        reserveData.type.push(item.type === "ขาย" ? "1" : "2");
      }
    });

    const totalPrice = calculateTotalPrice(); // คำนวณราคารวม
    const vat = calculateVAT(totalPrice);    // คำนวณ VAT
    const netPrice = totalPrice + vat;

    // ตรวจสอบค่าก่อนคำนวณ
    const shippingCost = parseFloat(formData.shipping_cost || 0);
    const movePrice = parseFloat(formData.move_price || 0);
    const guaranteePrice = parseFloat(formData.guarantee_price || 0);
    const discount = parseFloat(formData.discount || 0);

    // คำนวณราคาสุทธิหลังรวมค่าขนส่ง ส่วนลด และค่าบริการ
    const PriceAfterShipOrDiscount = netPrice + shippingCost + movePrice + guaranteePrice - discount;

    // คำนวณราคาสุดท้ายตามระยะเวลาเช่า
    const rentalDays = parseFloat(day_length || 0); // ตรวจสอบว่า day_length เป็นตัวเลข
    const FinalPrice = netPrice * rentalDays;

    const outboundData = {

      customer_name: name,
      place_name: workside,
      branch: branch,
      address,
      date: day_length,
      vat: hasVat ? "vat" : "nvat",
      shipping_cost: formData.shipping_cost || 0,
      discount: formData.discount || 0,
      move_price: formData.move_price || 0,
      guarantee_price: formData.guarantee_price || 0,
      company_name: comName,
      phone,
      customer_tel,
      sell_date: sell_date,
      total_price: totalPrice, // เพิ่มราคารวม
      vat_amount: vat,         // เพิ่ม VAT
      net_price: netPrice,
      finalPrice: FinalPrice,
      totalPriceMain: PriceAfterShipOrDiscount,
      reserve: [reserveData],
    };

    localStorage.setItem("outboundData", JSON.stringify(outboundData));

    const formDataToSave = {
      branch,
      products,
      name,
      comName,
      address,
      phone,
      workside,
      sell_date,
      day_length,
      customer_tel,
      items,
      netPrice,
      confirmitem,
      confirmitemASM,
      confirmitem_create,
      hasVat,
      withHolDing,
      Item_sendto_database,
      validateModalInput,
      alldata_default,
      formData,
      quantitySum,
      total_price: totalPrice, // เพิ่มราคารวม
      vat_amount: vat,         // เพิ่ม VAT
      net_price: netPrice,     // เพิ่มราคาสุทธิ
      reserve: [reserveData],
    };

    localStorage.setItem("outboundFormData", JSON.stringify(formDataToSave));
    console.log("Auto-saved to localStorage:", formDataToSave);
  };

  useEffect(() => {

    if (name || comName || address || confirmitem.length > 0) {
      console.log("Auto-saving data...");
      saveToLocalStorage();
    }

  }, [
    branch,
    products,
    name,
    comName,
    address,
    phone,
    workside,
    sell_date,
    day_length,
    customer_tel,
    items,
    netPrice,
    confirmitem,
    confirmitemASM,
    confirmitem_create,
    hasVat,
    withHolDing,
    Item_sendto_database,
    validateModalInput,
    alldata_default,
    formData,
    quantitySum,
    combinedItems,
  ]);

  const calculateTotalPrice = () => {
    return combinedItems.reduce((total, item) => {
      // เลือกใช้ราคาที่เหมาะสมสำหรับสินค้าปกติ
      const priceToUse = day_length >= 30
        ? item.price30D || item.price || 0 // ใช้ price30D หากมากกว่า 30 วัน
        : item.price || item.price3D || 0; // ใช้ price หรือ price3D ในกรณีปกติ

      // คำนวณรวมราคาสินค้า
      const itemTotal = item.isAssemble
        ? ((item.assemble_price || 0) * (item.amountASM || 0)) // ราคาสินค้าประกอบรวม service // ราคาสินค้าประกอบ
        : priceToUse * (item.amount || 0); // ราคาสินค้าปกติ

      return total + itemTotal;
    }, 0);
  };

  const calculateVAT = (total) => {
    return hasVat ? total * 0.07 : 0; // คำนวณ VAT 7% หากมีภาษี
  };

  const calculateNetPrice = () => {
    const total = calculateTotalPrice();
    const vat = calculateVAT(total);
    return total + vat; // ราคาสุทธิ = ราคารวม + VAT
  };

  const resetForm = () => {
    setProducts([]);
    setName("");
    setComName("");
    setAddress("");
    setPhone("");
    setcustomer_tel("");
    setWorkside("");
    setSell_date("");
    setDay_Length("");
    setItems([]);
    setNetPrice(0);
    setShowmodal(false);
    setShowModalDiscount(false);
    setShowmodal_create_product(false);
    setConfirmitem([]);
    setConfirmitemASM([]);
    setConfirmItem_Create([]);
    setHasVat(true);
    setWithHolDing(true);
    setItem_sendto_database([]);
    setValidateModalInput(false);
    setAlldata_default([{}]);
    setFormData({});
    setQuantitySum(0);

    // Clear localStorage
    localStorage.removeItem("outboundFormData");
    localStorage.removeItem("outboundData");
  };
  const formatNumber = (value) => {
    if (isNaN(Number(value)) || value === null || value === undefined) {
      return 'Invalid input';
    }
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (

    <div className="w-full h-[100%] mt-5">
      <HelmetProvider>
        <Helmet>
          <title>ส่งออกสินค้า</title>
        </Helmet>
      </HelmetProvider>

      {showmodal ? (
        <Modal_Outbound
          close={closeModal}
          confirm={handleConfirm}
          ititialData={confirmitem || []}
        />
      ) : null}
      {showmodalASM ? (
        <Modal_Assemble
          close={closeModalASM}
          confirm={handleConfirmASM}
          ititialDataASM={confirmitemASM || []}
        />
      ) : null}
      {showmodal_create_product && validateModalInput ? (
        <Modal_Create_Products
          close={closeModal_Create}
          createitem={handleConfirmItem_Create}
          datadefault={alldata_default}
        />
      ) : null}

      {showModalDiscount ? (
        <ModalDiscount
          close={closeModalDiscount}
          consfirm={handleConfirmDiscount}
        />
      ) : null}

      <div className="w-full h-[100%] grid grid-cols-5 overflow-auto no-scrollbar overflow-y-hidden">
        <div className="col-span-2 grid grid-rows-6 ">
          <div className="row-span-4 items-center text-base ">
            <div className="grid justify-end items-center grid-cols-4 ">
              <span className="col-span-1 grid justify-end pr-2">สาขา : </span>
              <select
                name="branch"
                id="branch"
                className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500"
              >
                <option>{branch}</option>
              </select>
            </div>

            {menu.map((item, index) => (
              <div
                key={index}
                className="grid justify-end items-center grid-cols-4 pt-10 "
              >
                <span className="col-span-1 grid justify-end  pr-2">
                  {item.title}
                </span>
                <input
                  type={item.type}
                  onChange={
                    item.title === "ชื่อผู้มาติดต่อ :"
                      ? (e) => setName(e.target.value)
                      : item.title === "ชื่อบริษัท :"
                        ? (e) => setComName(e.target.value)
                        : item.title === "วันที่เสนอ :"
                          ? (e) => handleDateChange(e.target.value)
                          : item.title === "ชื่อไซต์งาน :"
                            ? (e) => setWorkside(e.target.value)
                            : item.title === "ที่อยู่ลูกค้า :"
                              ? (e) => setAddress(e.target.value)
                              : item.title === "เบอร์สำนักงาน :"
                                ? (e) => setPhone(e.target.value)
                                : item.title === "เบอร์โทรศัพท์ :"
                                  ? (e) => setcustomer_tel(e.target.value)
                                  : null
                  }
                  value={
                    item.title === "ชื่อผู้มาติดต่อ :"
                      ? name
                      : item.title === "ชื่อบริษัท :"
                        ? comName
                        : item.title === "วันที่เสนอ :"
                          ? sell_date
                          : item.title === "ชื่อไซต์งาน :"
                            ? workside
                            : item.title === "ที่อยู่ลูกค้า :"
                              ? address
                              : item.title === "เบอร์สำนักงาน :"
                                ? phone
                                : item.title === "เบอร์โทรศัพท์ :"
                                  ? customer_tel
                                  : ""
                  }
                  className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
                />
              </div>
            ))}

            <div className="grid justify-end items-center grid-cols-4 pt-10">
              <span className="col-span-1 grid justify-end pr-2 ">
                ระยะเวลา :
              </span>
              <input
                type="number"
                className="col-span-2 h-10 rounded-lg border border-gray-500 p-2"
                value={day_length}
                onChange={(e) => setDay_Length(e.target.value)}
              />
              <span className="col-span-1 pl-5">วัน</span>
            </div>

            <div className="flex justify-center space-x-4 pt-10">
              <button
                className="w-[170px] bg-[#31AB31] h-10 rounded-md text-white hover:bg-[#2a7e2d] transition duration-300"
                onClick={() => setShowmodal(true)}
              >
                <i className="fa-solid fa-plus mr-2"></i>จองสินค้า
              </button>
              <button
                className="w-[170px] bg-orange-400 h-10 rounded-md text-white hover:bg-orange-600 transition duration-300"
                onClick={() => setShowmodalASM(true)}
              >
                <i className="fa-solid fa-plus mr-2"></i>สินค้าประกอบ
              </button>
              <button
                className="w-[170px] bg-blue-500 h-10 rounded-md text-white hover:bg-blue-600 transition duration-300"
                onClick={() => setShowModalDiscount(true)}
              >
                <i className="fa-solid fa-file-invoice mr-2"></i>กรอกข้อมูลเพิ่มเติม
              </button>
            </div>

          </div>
        </div>

        <div className="col-span-3 grid grid-rows-10 h-[755px]">
          <div className="row-span-9 grid grid-rows-4 border border-gray-500 rounded-lg">
            <div className="row-span-1 grid grid-cols-3 grid-rows-6 pl-4 pr-4 pt-3 ">
              <span className="col-span-1 grid justify-start items-center ">
                ห้างหุ้นส่วนจำกัด ภัทรชัย แบบเหล็ก
              </span>
              <span className="col-span-1 row-span-2 grid justify-center items-center text-xl font-bold">
                รายการส่งออกสินค้า
              </span>
              <span className="col-span-1 "></span>
              <span className="col-span-1 grid justify-start items-center">
                สาขา: {branch}
              </span>
              <span className="col-span-1 grid justify-end items-center">
                {formattedDate}
              </span>
              <span className="col-span-3 grid justify-start items-center">
                ชื่อผู้มาติดต่อ: {name}
              </span>
              <span className="col-span-3 grid justify-start items-center">
                ชื่อบริษัท: {comName}
              </span>
              <span className="col-span-1 grid justify-start items-center">
                ชื่อไซต์งาน: {workside}
              </span>
              <span className="col-span-1 grid justify-end items-center">
                เริ่มเช่า: {sell_date}
              </span>
              <span className="col-span-1 grid justify-end items-center">
                สิ้นสุดเช่า: {calculateEndDate(sell_date, day_length)}
              </span>
              <span className="col-span-2 row-span-2 grid grid-cols-7">
                <span className="col-span-1">ที่อยู่ลูกค้า:</span>
                <span className="col-span-6">{address}</span>
                ฺ </span>
              <span className="col-span-1 grid justify-end items-center">
                ระยะเวลาเช่า: {day_length} วัน
              </span>
            </div>

            <div className="row-span-3 grid grid-rows-3">
              <div className="row-span-3 no-scrollbar border-b-4 flex justify-center items-start mr-3 ml-3 ">
                <div className="overflow-y-auto no-scrollbar max-h-[calc(70vh-200px)] w-full">
                  <table className="w-full table-auto text-center border-collapse border-t-2 border-white">
                    <thead className="font-bold bg-blue-200 text-sky-800 sticky top-0 border-b-2">
                      <tr>
                        <th className="px-4 py-2 rounded-tl-lg">ลำดับ</th>
                        <th className="px-4 py-2">รายการ</th>
                        <th className="px-4 py-2">ขนาด</th>
                        <th className="px-4 py-2">รูปแบบ</th>
                        <th className="px-4 py-2">จำนวน</th>
                        <th className="px-4 py-2">ราคา</th>
                        <th className="px-4 py-2">รวม</th>
                        <th className="px-4 py-2 rounded-tr-lg">เลือก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinedItems.length > 0 ? (

                        combinedItems.map((item, index) => (
                          <tr
                            key={`${item.isAssemble ? `asm-${item.id_asm}` : `prd-${item.id || index}`}`}
                            className="border-b-2"
                          >
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{item.name || item.assemble_name}</td>
                            <td className="px-4 py-2">{item.size || "-"}</td>
                            <td className="px-4 py-2">
                              <select
                                name="model"
                                className="px-4 py-2 text-center"
                                value={item.type || ""}
                                onChange={(e) => handleModelChange(item.isAssemble ? item.id_asm : item.id, e.target.value, item.isAssemble)}
                              >
                                <option value="เช่า">เช่า</option>
                                <option value="ขาย">ขาย</option>
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                className="px-2 py-2 text-center w-[100px] border border-black rounded-md"
                                value={item.isAssemble ? item.amountASM || 0 : item.amount || 0} // ค่าเริ่มต้น
                                onChange={(e) => {
                                  handleAmountChange(
                                    item.isAssemble ? item.id_asm : item.id,
                                    e.target.value,
                                    item.isAssemble
                                  );
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              {item.type === 'เช่า' ? (
                                <input
                                  type="number"
                                  className="px-2 py-2 text-center w-[100px] border border-black rounded-md"
                                  value={item.isAssemble ? formatNumber(item.assemble_price || 0)
                                    : formatNumber(
                                      day_length >= 30
                                        ? item.price30D || item.price || 0
                                        : item.price || item.price3D || 0
                                    )}
                                  onChange={(e) => {
                                    handlePriceAPI(item.isAssemble ? item.id_asm : item.id, e.target.value, item.isAssemble);
                                  }}
                                />
                              ) : item.isAssemble ? formatNumber(item.assemble_price || 0) : formatNumber(
                                day_length >= 30
                                  ? item.price30D || item.price || 0
                                  : item.price || item.price3D || 0
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {/* คำนวณรวมราคาต่อรายการ */}
                              {item.isAssemble
                                ? formatNumber(
                                  ((item.assemble_price || 0) * (item.amountASM || 0) // ราคาสินค้าประกอบรวม service
                                  ))
                                : formatNumber(
                                  ((day_length >= 30 ? item.price30D || item.price || 0 : item.price || item.price3D || 0)) *
                                  (item.amount || 0) // ราคาสินค้าปกติ
                                )}
                            </td>

                            <td className="px-4 py-2">
                              <button
                                className="fa-solid fa-trash py-6"
                                onClick={() => handleDeleteItem(item.isAssemble, item.isAssemble ? item.id_asm : item.id)}
                              ></button>

                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-4 py-2 text-center">
                            ไม่มีข้อมูล
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>

            <div className="row-span-1 grid grid-cols-6 grid-rows-3">
              <span className="col-span-3 row-span-3 grid grid-cols-5 p-1">
                <span className="col-span-3 grid justify-end">
                  รวมรายการสินค้าที่ส่งออกทั้งหมด
                </span>
                <span className="col-span-1 grid justify-center">{quantitySum}</span>
                <span className="col-span-1 grid justify-start">รายการ</span>
              </span>
              <span className="col-span-3 row-span-3 grid grid-cols-4">
                <span className="col-span-1"></span>
                <span className="col-span-1 grid justify-end p-1">ราคารวม</span>
                <span className="col-span-1 grid justify-end p-1">
                  {formatNumber(calculateTotalPrice())}
                </span>
                <span className="col-span-1 grid justify-start p-1">บาท</span>

                <span className="col-span-2 grid justify-end p-1">ภาษีมูลค่าเพิ่ม (7%)</span>
                <span className="col-span-1 grid justify-end p-1">
                  {formatNumber(calculateVAT(calculateTotalPrice()))}
                </span>
                <span className="col-span-1 grid justify-start p-1">บาท</span>

                <span className="col-span-1"></span>
                <span className="col-span-1 grid justify-end p-1">ราคาสุทธิ</span>
                <span className="col-span-1 grid justify-end p-1 underline">
                  {formatNumber(calculateNetPrice())}
                </span>
                <span className="col-span-1 grid justify-start p-1">บาท</span>
              </span>
            </div>
          </div>

          <div className="row-span-1 grid grid-rows-2">
            <div className="row-span-1 flex items-center">
              <input
                type="radio"
                name="vat"
                value="true"
                className="mr-2"
                checked={hasVat}
                onChange={handleVatChange}
              />
              มีภาษีมูลค่าเพิ่ม

              <input
                type="radio"
                name="nvat"
                value="false"
                className="ml-3 mr-2"
                checked={!hasVat}
                onChange={handleVatChange}
              />
              ไม่มีภาษีมูลค่าเพิ่ม

            </div>

            <div className="row-span-1 items-center justify-end grid grid-cols-3 text-white mt-5 w-full ml-auto">
              <span className="col-span-1 flex justify-center">
                <button
                  className={`bg-blue-500 w-1/2 p-2 rounded-md hover:bg-blue-700 transition duration-300 flex justify-center items-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={confirm_order}
                  disabled={isLoading} // ปิดปุ่มเมื่อกำลังโหลด
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                      กำลังโหลด...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk mr-2"></i>บันทึก
                    </>
                  )}
                </button>
              </span>

              <span className="col-span-1 flex justify-center">
                <button
                  className="bg-red-500 w-1/2 p-2 rounded-md hover:bg-red-700 transition duration-300"
                  onClick={resetForm}
                >
                  <i className="fa-solid fa-x mr-2"></i>ยกเลิก
                </button>
              </span>

              <span className="col-span-1 flex justify-center">
                <button
                  className="bg-gray-500 w-1/2 p-2 rounded-md hover:bg-gray-700 transition duration-300"
                  onClick={handlePreview}
                >
                  <i className="fa-solid fa-file-export mr-2"></i>preview
                </button>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}