import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal_Outbound } from "./Modal_Outbound";
import { Modal_Assemble } from "./Modal_Assemble";
import { ModalDiscount } from "./Modal_Discount";
import { Modal_Create_Products } from "./Modal_Create_Products";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import thaiBahtText from 'thai-baht-text';
import ExcelJS from 'exceljs';
import CreatableSelect from 'react-select/creatable';
import { set } from "lodash";


export function Outbound() {

  const [branch, setBranch] = useState("");
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [comName, setComName] = useState("");
  const [address, setAddress] = useState("");
  const [customer_tel, setcustomer_tel] = useState("");
  const [workside, setWorkside] = useState("");
  const [sell_date, setSell_date] = useState("");
  const [day_length, setDay_Length] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [quantitySum, setQuantitySum] = useState(0);
  const navigate = useNavigate();
  const [receiptNumber, setReceiptNumber] = useState('');
  const [rawSellDate, setRawSellDate] = useState("");
  const [customer_sell, setCustomer_sell] = useState([]);

  const [NameData, setNameData] = useState({ customer: [], companyNames: [] });
  const [isCustomerNameFocused, setIsCustomerNameFocused] = useState(false);
  const [isCompanyNameFocused, setIsCompanyNameFocused] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const inputRefs = useRef([]);

  const combinedItems = [
    ...confirmitem.map((item) => ({
      ...item,
      isAssemble: false,
    })),
    ...confirmitemASM.map((item) => ({
      ...item,
      id_asm: item.id_asm,
      isAssemble: true,
    }))
  ];

  const menu = [
    { title: "ชื่อผู้มาติดต่อ :", type: "text", api: "http://192.168.195.75:5000/v1/product/outbound/name-customer" },
    { title: "ชื่อบริษัท :", type: "text", api: "http://192.168.195.75:5000/v1/product/outbound/name-company" },
    { title: "ที่อยู่ลูกค้า :", type: "text" },
    { title: "ชื่อไซต์งาน :", type: "text" },
    { title: "วันที่เสนอ :", type: "date" },
    { title: "เบอร์โทรศัพท์ :", type: "text" },
  ];

  const fetchData = async (apiEndpoint) => {

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY,

        }
      });

      if (response.data.code === 200) {
        if (apiEndpoint === "http://192.168.195.75:5000/v1/product/outbound/name-customer") {
          setNameData((prevData) => ({
            ...prevData,
            customer: response.data.data.map(item => item.customer_name || "")
          }));
        } else if (apiEndpoint === "http://192.168.195.75:5000/v1/product/outbound/name-company") {
          setNameData((prevData) => ({
            ...prevData,
            companyNames: response.data.data.map(item => item.company_name || "")
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFocus = (title) => {
    if (title === "ชื่อผู้มาติดต่อ :") {
      setIsCustomerNameFocused(true);
      fetchData(menu[0].api);

    } else if (title === "ชื่อบริษัท :") {
      setIsCompanyNameFocused(true);
      fetchData(menu[1].api);
    }
  }

  const handleBlur = (title) => {
    if (title === "ชื่อผู้มาติดต่อ :") {
      setIsCustomerNameFocused(false);
    } else if (title === "ชื่อบริษัท :") {
      setIsCompanyNameFocused(false);
    }
  }

  const customerOptions = NameData.customer.map(name => ({ value: name, label: name }));
  const companyOptions = NameData.companyNames.map(name => ({ value: name, label: name }));

  const handleVatChange = (e) => {
    setHasVat(e.target.value === "true");
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
      // price: 0,
    }));
    setConfirmitem(updatedItems);
    updateQuantitySum();
  };

  const handleConfirmASM = (items) => {
    const updatedItemsASM = items.map((item) => ({
      ...item,
      type: item.type || "เช่า",
      price: 0,
      isAssemble: true,
    }));
    setConfirmitemASM(updatedItemsASM);
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
    setRawSellDate(dateValue);
    const date = new Date(dateValue);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("th-TH", options);
    setSell_date(formattedDate);
  };

  const updateQuantitySum = () => {
    const totalItems = confirmitem.length + confirmitemASM.length;
    setQuantitySum(totalItems);
  };

  const closeModal = (data) => {
    updateQuantitySum();
    setShowmodal(false);
  };

  const closeModalASM = (data) => {
    if (data) {
      setFormData(data);
    }
    updateQuantitySum();
    setShowmodalASM(false);
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

  const handleDeleteItem = (isAssemble, id) => {
    if (isAssemble) {
      const updatedConfirmItemASM = confirmitemASM.filter((item) => item.id_asm !== id);
      setConfirmitemASM(updatedConfirmItemASM);
    } else {
      const updatedConfirmItem = confirmitem.filter((item) => item.id !== id);
      setConfirmitem(updatedConfirmItem);
    }
    updateQuantitySum();
  };

  const confirm_order = async () => {

    // resetForm();
    // || confirmitem.length === 0 || confirmitem.some((item) => !item.price && !item.price3D)

    // if (!day_length) {

    //   Swal.fire({
    //     icon: "warning",
    //     text: "กรุณากรอกข้อมูลให้ครบถ้วน",
    //     confirmButtonText: "ตกลง"
    //   });
    //   return;

    // }

    const reserve = [
      combinedItems.reduce(
        (acc, item) => {
          // const storedItem = storedItems.confirmitem.find(i => i.id === item.id) || {};
          // const storedItemPrice = storedItem.price || (day_length >= 30 ? item.price30D : (day_length < 30 ? item.price3D : item.price));
          if (item.isAssemble) {
            acc.assemble.push(String(item.id_asm));
            acc.assemble_quantity.push(String(item.amountASM));
            acc.assemble_price.push(String(item.assemble_price));
            acc.assemble_service_price.push(String(item.assemble_service_price));
            acc.unit_asm.push(String(item.unit_asm));
            acc.assemble_price_damage.push(String(item.assemble_price_damage));
          } else {
            acc.code.push(item.code || "");
            acc.product_id.push(String(item.id));
            acc.price.push(day_length >= 30 ? String(item.price30D) : day_length < 30 ? String(item.price3D) : item.price);
            // acc.price.push(String(storedItemPrice));
            acc.quantity.push(String(item.amount));
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
          unit_asm: [],
          assemble_price_damage: [],
        }
      )

    ];

    const newOrder = {
      customer_name: selectedCustomer,
      company_name: selectedCompany,
      place_name: workside,
      address,
      date: day_length,
      date_sell: sell_date,
      customer_tel: customer_tel,
      customer_sell: customer_sell,
      reserve: reserve,
      assemble_status: confirmitem_create.assemble_status || false,
      vat: hasVat ? "vat" : "nvat",
      ...formData,
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
           "x-api-key": import.meta.env.VITE_X_API_KEY,

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

    } catch (err) {
      console.error("Error sending order:", err);
      Swal.fire({
        icon: "error",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        confirmButtonText: "ตกลง",
      });

    } finally {
      setIsLoading(false);
    }

    setItem_sendto_database((predata) => [...predata, newOrder]);
  };

  useEffect(() => {
    updateQuantitySum();
  }, [confirmitem, confirmitemASM]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://192.168.195.75:5000/v1/product/outbound/profile", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_X_API_KEY,

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

  const handleModelChange = (id, value, isAssemble = false) => {
    if (isAssemble) {
      const index = confirmitemASM.findIndex((item) => item.id_asm === id);
      if (index !== -1) {
        const updatedConfirmItemASM = [...confirmitemASM];
        updatedConfirmItemASM[index] = {
          ...updatedConfirmItemASM[index],
          type: value,
        };
        setConfirmitemASM(updatedConfirmItemASM);
      }
    } else {
      const index = confirmitem.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedConfirmItem = [...confirmitem];
        updatedConfirmItem[index] = {
          ...updatedConfirmItem[index],
          type: value,
        };
        setConfirmitem(updatedConfirmItem);
      }
    }
  };

  const handleAmountChange = (id, value, isAssemble = false) => {
    const parsedValue = parseInt(value, 10) || 0;
    if (isAssemble) {
      const index = confirmitemASM.findIndex((item) => item.id_asm === id);
      if (index !== -1) {
        const updatedConfirmItemASM = [...confirmitemASM];
        updatedConfirmItemASM[index] = {
          ...updatedConfirmItemASM[index],
          amountASM: parsedValue,
        };
        setConfirmitemASM(updatedConfirmItemASM);
      }

    } else {

      const index = confirmitem.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedConfirmItem = [...confirmitem];
        const priceToUse =
          day_length > 30
            ? updatedConfirmItem[index].price30D || updatedConfirmItem[index].price || 0
            : updatedConfirmItem[index].price || updatedConfirmItem[index].price3D || 0;

        updatedConfirmItem[index] = {
          ...updatedConfirmItem[index],
          amount: parsedValue,
          calculatedPrice: priceToUse,
        };
        setConfirmitem(updatedConfirmItem);
      }
    }
  };

  const handlePriceAPI = (id, value, isAssemble = false) => {
    const parsedValue = parseFloat(value);

    if (isAssemble) {
      setConfirmitemASM(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.id_asm === id ? { ...item, assemble_price: parsedValue } : item
        );
        //localStorage.setItem("confirmitemASM", JSON.stringify(updatedItems));
        return updatedItems;
      });
    } else {
      setConfirmitem(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.id === id
            ? {
              ...item,
              price: parsedValue,
              price30D: day_length >= 30 ? parsedValue : item.price30D,
              price3D: day_length < 30 ? parsedValue : item.price3D
            }
            : item
        );
        //localStorage.setItem("confirmitem", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }

    const savedOutboundData = localStorage.getItem("outboundData");
    if (savedOutboundData) {
      const outboundData = JSON.parse(savedOutboundData);
      outboundData.reserve[0].price = outboundData.reserve[0].price.map((p, index) =>
        outboundData.reserve[0].product_id[index] === String(id)
          ? String(parsedValue)
          : p
      );
      localStorage.setItem("outboundData", JSON.stringify(outboundData));
    }
  };

  const saveToLocalStorage = () => {

    const savedOutboundData = localStorage.getItem("outboundData");
    const savedOutboundDataASM = localStorage.getItem("confirmitemASM");

    const existingReserveData = savedOutboundData ? JSON.parse(savedOutboundData).reserve[0] : null;
    const prevConfirmASM = savedOutboundDataASM ? JSON.parse(savedOutboundDataASM) : null;

    const reserveData = {
      code: [],
      product_name: [],
      product_id: [],
      price: [],
      price_damage: [],
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
      unit_asm: [],
      unit: [],
      assemble_price_damage: [],
      assemble_service_price: [],
      productsASM: existingReserveData?.productsASM?.length ? existingReserveData.productsASM : prevConfirmASM || []
    };

    combinedItems.forEach((item) => {
      if (item.isAssemble) {
        reserveData.assemble.push(String(item.id_asm || ""));
        reserveData.assemble_name.push(String(item.assemble_name || ""));
        reserveData.assemble_quantity.push(String(item.amountASM || 0));
        reserveData.assemble_price.push(String(item.assemble_price || 0));
        reserveData.description.push(String(item.description || ""));
        reserveData.unit_asm.push(String(item.unit_asm || ""));
        reserveData.assemble_price_damage.push(String(item.assemble_price_damage || 0));
        reserveData.assemble_service_price.push(String(item.assemble_service_price || 0));
        reserveData.assemble_price_damage.push(String(item.assemble_price_damage || 0));
        reserveData.productsASM.push(item.products || []);

      } else {
        reserveData.code.push(item.code || "");
        reserveData.product_id.push(String(item.id || ""));
        reserveData.product_name.push(String(item.name || ""));
        reserveData.price.push(String(day_length >= 30 ? (item.price30D ?? item.price3D ?? 0) : (item.price3D ?? item.price30D ?? 0)));
        reserveData.price_damage.push(String(item.price_damage || 0));
        reserveData.quantity.push(String(item.amount || 0));
        reserveData.size.push(item.size || "");
        reserveData.centimeter.push(item.centimeter || "");
        reserveData.meter.push(item.meter || "");
        reserveData.unit.push(String(item.unit || ""));
        reserveData.type.push(item.type === "ขาย" ? "1" : "2");
      }
    });

    const totalPrice = calculateTotalPrice();
    const vat = calculateVAT(totalPrice);
    const netPrice = totalPrice + vat;

    const shippingCost = parseFloat(formData.shipping_cost || 0);
    const movePrice = parseFloat(formData.move_price || 0);
    const guaranteePrice = parseFloat(formData.guarantee_price || 0);
    const discount = parseFloat(formData.discount || 0);

    const PriceAfterShipOrDiscount = netPrice + shippingCost + movePrice + guaranteePrice - discount;
    const rentalDays = parseFloat(day_length || 0);
    const FinalPrice = netPrice * rentalDays;

    const outboundData = {
      customer_name: selectedCustomer,
      place_name: workside,
      branch: branch,
      address,
      date: day_length,
      vat: hasVat ? "vat" : "nvat",
      shipping_cost: formData.shipping_cost,
      discount: formData.discount,
      move_price: formData.move_price,
      guarantee_price: formData.guarantee_price,
      taxid: formData.taxid,
      remark1: formData.remark1,
      remark2: formData.remark2,
      remark3: formData.remark3,
      company_name: selectedCompany,
      customer_tel,
      customer_sell,
      sell_date: sell_date,
      total_price: totalPrice,
      vat_amount: vat,
      net_price: netPrice,
      finalPrice: FinalPrice,
      totalPriceMain: PriceAfterShipOrDiscount,
      reserve: [reserveData]
    };

    localStorage.setItem("outboundData", JSON.stringify(outboundData));
    localStorage.setItem("confirmitemASM", JSON.stringify(confirmitemASM));
  };

  useEffect(() => {

    if (selectedCustomer.length > 0 || selectedCompany.length > 0 || confirmitem.length > 0 || confirmitemASM.length > 0) {
      saveToLocalStorage();
    }

  }, [
    branch,
    products,
    selectedCustomer,
    selectedCompany,
    address,
    workside,
    sell_date,
    day_length,
    customer_tel,
    customer_sell,
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
    combinedItems
  ]);

  const calculateTotalPrice = () => {
    return combinedItems.reduce((total, item) => {
      const priceToUse = day_length >= 30 ? item.price30D : day_length < 30 ? item.price3D : item.price || 0;

      const itemTotal = item.isAssemble
        ? ((item.assemble_price || 0) * (item.amountASM || 0))
        : priceToUse * (item.amount || 0);

      return total + itemTotal;
    }, 0);
  };

  const calculateVAT = (total) => {
    return hasVat ? total * 0.07 : 0;
  };

  const resetForm = () => {
    setProducts([]);
    setName("");
    setComName("");
    setSelectedCompany("")
    setSelectedCustomer("")
    setCustomer_sell("");
    setAddress("");
    setcustomer_tel("");
    setWorkside("");
    setSell_date("");
    setDay_Length(0);
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

    localStorage.removeItem("outboundData");
    localStorage.removeItem("confirmitemASM");
    localStorage.removeItem("confirmitem");
    localStorage.removeItem("formData");

  };

  const formatNumber = (value) => {
    if (isNaN(Number(value)) || value === null || value === undefined) {
      return 'Invalid input';
    }
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem("outboundData");

    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);

      setProducts(parsedData.products || []);
      // setName(parsedData.customer_name || "");
      setSelectedCustomer(parsedData.customer_name || "");
      setSelectedCompany(parsedData.company_name || "");
      // setComName(parsedData.company_name || "");
      setAddress(parsedData.address || "");
      setcustomer_tel(parsedData.customer_tel || "");
      setCustomer_sell(parsedData.customer_sell || "");
      setWorkside(parsedData.place_name || "");
      setSell_date(parsedData.sell_date || "");
      setDay_Length(parsedData.date || "");
      setNetPrice(parsedData.net_price || 0);
      setFormData(parsedData.formData || {});
      setItems(parsedData.items || []);
      setConfirmItem_Create(parsedData.confirmitem_create || []);
      setHasVat(parsedData.hasVat || true);
      setItem_sendto_database(parsedData.Item_sendto_database || []);
      setAlldata_default(parsedData.alldata_default || [{}]);

      setShowmodal(parsedData.showModal || false);
      setShowModalDiscount(parsedData.showModalDiscount || false);
      setShowmodal_create_product(parsedData.showModalCreateProduct || false);
      setConfirmitem(parsedData.confirmitem || []);
      setConfirmitemASM(parsedData.confirmitemASM || []);
      setWithHolDing(parsedData.withHolDing || true);
      setValidateModalInput(parsedData.validateModalInput || false);
      setQuantitySum(parsedData.quantitySum || 0);

      if (parsedData.reserve && parsedData.reserve.length > 0) {
        const reserveData = parsedData.reserve[0];

        const confirmItems = reserveData.code.map((code, index) => ({
          code,
          id: reserveData.product_id[index],
          name: reserveData.product_name[index],
          price: parseFloat(reserveData?.price?.[index]),
          price30D: parseFloat(reserveData?.price30D?.[index] || reserveData?.price?.[index] || 0),
          price3D: parseFloat(reserveData?.price3D?.[index] || reserveData?.price?.[index] || 0),
          price_damage: parseFloat(reserveData.price_damage[index]),
          amount: parseInt(reserveData.quantity[index], 10),
          size: reserveData.size[index],
          unit: reserveData.unit[index],
          centimeter: reserveData.centimeter[index],
          meter: reserveData.meter[index],
          type: reserveData.type[index] === "1" ? "ขาย" : "เช่า"
        }));

        const confirmItemsASM = reserveData.assemble.map((id_asm, index) => ({
          id_asm,
          assemble_name: reserveData.assemble_name[index],
          amountASM: parseInt(reserveData.assemble_quantity[index], 10),
          assemble_price: parseFloat(reserveData.assemble_price[index]),
          description: reserveData.description[index],
          unit_asm: reserveData.unit_asm[index],
          assemble_price_damage: parseFloat(reserveData.assemble_price_damage[index]),
          assemble_service_price: parseFloat(reserveData.assemble_service_price[index]),
          productsASM: reserveData.productsASM[index]
        }));

        setConfirmitem(confirmItems);
        setConfirmitemASM(confirmItemsASM);
      }

    }
  }, []);

  const exportToExcelVat = () => {

    const retrievedData = localStorage.getItem("outboundData");
    const outboundData = JSON.parse(retrievedData);
    const retrievedDataASM = localStorage.getItem("confirmitemASM");
    const outboundDataASM = JSON.parse(retrievedDataASM);

    const productNameLength = outboundData.reserve[0].product_name.length;

    combinedItems.map((item, index) => (
      item.index = index + 1,
      item.price = item.price_damage
    ));

    const token = localStorage.getItem("token");
    axios
      .get("http://192.168.195.75:5000/v1/product/outbound/last-status", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY,

        },
      })
      .then((res) => {
        if (res.status === 200) {
          const lastReceiptNumber = res.data.data.receip_number;
          setData(lastReceiptNumber);
          const [prefix, number] = lastReceiptNumber.split('-');
          const incrementedNumber = (parseInt(number, 10) + 1).toString().padStart(3, '0');
          const newReceiptNumber = `${prefix}-${incrementedNumber}`;
          setReceiptNumber(newReceiptNumber);
          setData(res.data.data.receip_number);
        }

      }).catch(() => {
        const currentYear = (new Date().getFullYear() + 543).toString().slice(-2);
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
        const fallbackReceiptNumber = `${currentYear}${currentMonth}-001`;
        setReceiptNumber(fallbackReceiptNumber);
      });

    const formatThaiBahtText = (value) => {
      if (isNaN(Number(value)) || value === null || value === undefined) {
        return 'Invalid input';
      }
      return thaiBahtText(Number(value));
    };

    const formatNumber = (value) => {
      if (isNaN(Number(value)) || value === null || value === undefined) {
        return 'Invalid input';
      }
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const headerData = [
      [""],
      ["", "", "", "", "ห้างหุ้นส่วนจำกัด ภัทรชัย เเบบเหล็ก (สำนักงานใหญ่)"],
      ["", "", "", "", "PATTARACHAI BABLEK PART.,LTD.(HEAD OFFICE)"],
      ["", "", "", "", "12/8 หมู่ที่ 7 ต.โคกขาม อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000"],
      ["", "", "", "", "โทร : 034-133093     เลขประจำตัวผู้เสียภาษีอากร : 0-1335-62000-93-5"],
      ["", "", "", "", "สาขา: โคกขาม 084-1571097 / นพวงศ์ 084-1571094 / ชลบุรี 083-1653979"]
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Outbound Data');

    worksheet.pageSetup = {
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: 9
    };

    worksheet.getColumn(1).width = productNameLength > 10 ? 8 : 6;
    worksheet.getColumn(2).width = 4;
    worksheet.getColumn(3).width = productNameLength > 10 ? 13 : 11;
    worksheet.getColumn(4).width = productNameLength > 10 ? 5 : 3.9;
    worksheet.getColumn(5).width = productNameLength > 10 ? 10 : 8;
    worksheet.getColumn(6).width = productNameLength > 10 ? 10 : 8;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = productNameLength > 10 ? 12 : 10;
    worksheet.getColumn(9).width = 6;
    worksheet.getColumn(10).width = productNameLength > 10 ? 12 : 9;
    worksheet.getColumn(11).width = productNameLength > 10 ? 11 : 8;
    worksheet.getColumn(12).width = 14;
    worksheet.getColumn(13).width = productNameLength > 10 ? 13 : 11.8;

    worksheet.addRows(headerData);

    worksheet.getRow(1).height = 10;

    worksheet.getRow(2).height = 29;
    worksheet.getRow(3).height = 23;
    worksheet.getRow(4).height = 23;
    worksheet.getRow(5).height = 23;
    worksheet.getRow(6).height = 20;
    worksheet.getRow(7).height = 10;

    worksheet.getRow(8).height = 7;
    worksheet.getRow(9).height = 6;
    worksheet.getRow(10).height = 6;
    worksheet.getRow(11).height = 6;
    worksheet.getRow(12).height = 6;
    worksheet.getRow(13).height = 7;
    worksheet.getRow(14).height = 7;
    worksheet.getRow(15).height = 6;
    worksheet.getRow(16).height = 6;
    worksheet.getRow(17).height = 6;
    worksheet.getRow(18).height = 6;
    worksheet.getRow(19).height = 7;
    worksheet.getRow(20).height = 7;
    worksheet.getRow(21).height = 7;
    worksheet.getRow(22).height = 5;
    worksheet.getRow(23).height = 7;
    worksheet.getRow(24).height = 5;
    worksheet.getRow(25).height = 7;

    worksheet.getRow(26).height = 10;

    worksheet.getRow(48).height = 15;
    worksheet.getRow(49).height = 15;
    worksheet.getRow(50).height = 15;
    worksheet.getRow(51).height = 15;
    worksheet.getRow(52).height = 15;
    worksheet.getRow(53).height = 15;

    worksheet.getRow(54).height = 18;
    worksheet.getRow(55).height = 18;
    worksheet.getRow(56).height = 18;
    worksheet.getRow(57).height = 18;
    worksheet.getRow(58).height = 18;
    worksheet.getRow(59).height = 18;
    worksheet.getRow(60).height = 18;

    worksheet.getRow(68).height = 11;
    worksheet.getRow(69).height = 11;

    worksheet.getRow(70).height = 10;

    worksheet.getRow(71).height = 25;
    worksheet.getRow(72).height = 25;
    worksheet.getRow(73).height = 12;

    worksheet.getRow(2).font = { size: 24, bold: true, name: 'Angsana New' };
    worksheet.getRow(3).font = { size: 20, bold: true, name: 'Angsana New' };
    worksheet.getRow(4).font = { size: 15, bold: true, name: 'Angsana New' };
    worksheet.getRow(5).font = { size: 14, bold: true, name: 'Angsana New' };
    worksheet.getRow(6).font = { size: 13, bold: true, name: 'Angsana New' };

    worksheet.mergeCells('K4:M6');
    const cell = worksheet.getCell('K4');
    cell.value = "ใบเสนอราคา-เช่า / ใบเเจ้งหนี้";
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { size: 22, bold: true, name: 'Angsana New' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3fc9f7' }
    };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    };

    worksheet.mergeCells('A8:B10');
    const customer_name = worksheet.getCell('A8');
    customer_name.value = '   ชื่อผู้ติดต่อ :';
    customer_name.font = { size: 13, bold: true, name: 'Angsana New' };
    customer_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C8:F10');
    const customer_nameValue = worksheet.getCell('C8');
    customer_nameValue.value = selectedCustomer;
    customer_nameValue.font = { size: 13, name: 'Angsana New' };
    customer_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A11:B13');
    const company_name = worksheet.getCell('A11');
    company_name.value = '   ชื่อบริษัท :';
    company_name.font = { size: 13, bold: true, name: 'Angsana New' };
    company_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C11:J13');
    const company_nameValue = worksheet.getCell('C11');
    company_nameValue.value = selectedCompany;
    company_nameValue.font = { size: 13, name: 'Angsana New' };
    company_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A14:B16');
    const addressName = worksheet.getCell('A14');
    addressName.value = '   ที่อยู่ :';
    addressName.font = { size: 13, bold: true, name: 'Angsana New' };
    addressName.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C14:J16');
    const addressValue = worksheet.getCell('C14');
    addressValue.value = address;
    addressValue.font = { size: 13, name: 'Angsana New' };
    addressValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A17:B19');
    const space = worksheet.getCell('A17');

    worksheet.mergeCells('C17:J19');
    const placeValue = worksheet.getCell('C17');
    placeValue.value = "หน้างาน - " + workside;
    placeValue.font = { size: 13, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    placeValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A20:B22');
    const phone = worksheet.getCell('A20');
    phone.value = '   โทร :';
    phone.font = { size: 13, bold: true, name: 'Angsana New' };
    phone.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C20:I22');
    const phoneValue = worksheet.getCell('C20:E22');
    phoneValue.value = customer_tel;
    phoneValue.font = { size: 13, name: 'Angsana New' };
    phoneValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A23:C25');
    const taxId = worksheet.getCell('A23');
    taxId.value = '   เลขประจำตัวผู้เสียภาษีอากร:';
    taxId.font = { size: 13, bold: true, name: 'Angsana New' };
    taxId.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('D23:G25');
    const taxIdValue = worksheet.getCell('D23:G25');
    taxIdValue.value = formData.taxid;
    taxIdValue.font = { size: 13, name: 'Angsana New' };
    taxIdValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K8:K12');
    const taxNumber = worksheet.getCell('K8');
    taxNumber.value = 'เลขที่ Po :';
    taxNumber.font = { size: 13, bold: true, name: 'Angsana New' };
    taxNumber.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M8:M12');
    const taxNumberValue = worksheet.getCell('M8');
    taxNumberValue.value = receiptNumber;
    taxNumberValue.font = { size: 13, name: 'Angsana New' };
    taxNumberValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K13:L16');
    const date = worksheet.getCell('K13');
    date.value = '  วันที่เสนอ :';
    date.font = { size: 13, bold: true, name: 'Angsana New' };
    date.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M13:M16');
    const dateValue = worksheet.getCell('M13');
    dateValue.value = sell_date;
    dateValue.font = { size: 13, name: 'Angsana New' };
    dateValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K17:L20');
    const expDate = worksheet.getCell('K17');
    expDate.value = '  วันที่หมดอายุ :';
    expDate.font = { size: 13, bold: true, name: 'Angsana New' };
    expDate.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M17:M20');
    const expDateValue = worksheet.getCell('M17');
    expDateValue.value = '-';
    expDateValue.font = { size: 13, name: 'Angsana New' };
    expDateValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K21:L25');
    const condition = worksheet.getCell('K21');
    condition.value = '  เงื่อนไขการชำระเงิน :';
    condition.font = { size: 13, bold: true, name: 'Angsana New' };
    condition.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M21:M25');
    const conditionValue = worksheet.getCell('M21');
    conditionValue.value = 'เงินสด / โอน';
    conditionValue.font = { size: 13, name: 'Angsana New' };
    conditionValue.alignment = { vertical: 'middle', horizontal: 'left' };

    const indexNumber = worksheet.getCell('A27');
    indexNumber.value = 'ลำดับที่';
    indexNumber.font = { size: 14, bold: true, name: 'Angsana New' };
    indexNumber.alignment = { vertical: 'middle', horizontal: 'center' };

    const ListProductAll = outboundData.reserve[0];

    const ListASMs = ListProductAll.productsASM;
    let totalFinalPrice2 = 0;
    const Indexplus = 28;
    let currentIndex = 1;

    ListProductAll.product_name.forEach((product, index) => {
      const rowNumber = Indexplus + index;
      const productCell = worksheet.getCell(`A${rowNumber}`);

      productCell.value = `${currentIndex}`;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

      currentIndex++;
    });

    // if (ListProductAll.assemble) {
    //   ListProductAll.assemble.forEach((assembleItem, index) => {
    //     const rowNumber = Indexplus + ListProductAll.product_name.length + index;
    //     const assembleCell = worksheet.getCell(`A${rowNumber}`);

    //     assembleCell.value = `${currentIndex}`;
    //     assembleCell.font = { size: 14, name: 'Angsana New' };
    //     assembleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    //     currentIndex++;
    //   });
    // }

    worksheet.mergeCells('B27:G27');
    const listName = worksheet.getCell('B27');
    listName.value = 'รายการ';
    listName.font = { size: 14, bold: true, name: 'Angsana New' };
    listName.alignment = { vertical: 'middle', horizontal: 'center' };

    let rowNumber = 28
    let orderIndex = 1;

    ListProductAll.product_name.forEach((product, index) => {

      worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
      const productCell = worksheet.getCell(`B${rowNumber}`);

      productCell.value = product;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };

      rowNumber++;
      orderIndex++;

    });

    if (outboundDataASM) {

      outboundDataASM.forEach((asm, asmIndex) => {

        worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
        const asmNameCell = worksheet.getCell(`B${rowNumber}`);
        const productCell = worksheet.getCell(`A${rowNumber}`);

        productCell.value = `${orderIndex + 1 - 1}`;
        productCell.font = { size: 14, name: 'Angsana New' };
        productCell.alignment = { vertical: 'middle', horizontal: 'center' };

        asmNameCell.value = ListProductAll.assemble_name[asmIndex];
        asmNameCell.font = { size: 14, name: 'Angsana New' };
        asmNameCell.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
        const asmCell = worksheet.getCell(`H${rowNumber}`);

        asmCell.value = `${ListProductAll.assemble_quantity[asmIndex]} ${ListProductAll.unit_asm[asmIndex]}`;
        asmCell.font = { size: 14, name: 'Angsana New' };
        asmCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
        const subProductCell = worksheet.getCell(`D${rowNumber}`);

        subProductCell.value = `${ListProductAll.description[asmIndex]}`;
        subProductCell.font = { size: 14, name: 'Angsana New' };
        subProductCell.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells(`K${rowNumber}`);
        const productCellDate = worksheet.getCell(`K${rowNumber}`);

        productCellDate.value = `${outboundData.date}`;
        productCellDate.font = { size: 14, name: 'Angsana New' };
        productCellDate.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(`J${rowNumber}`);
        const productCellPerDay = worksheet.getCell(`J${rowNumber}`);

        productCellPerDay.value = `${formatNumber(ListProductAll.assemble_price[asmIndex]) ? formatNumber(ListProductAll.assemble_price[asmIndex]) : "-"} `;
        productCellPerDay.font = { size: 14, name: 'Angsana New' };
        productCellPerDay.alignment = { vertical: 'middle', horizontal: 'right' };

        worksheet.mergeCells(`L${rowNumber}`);
        const productCellPriceDamage = worksheet.getCell(`L${rowNumber}`);

        productCellPriceDamage.value = `${formatNumber(ListProductAll.assemble_price_damage[asmIndex]) ? formatNumber(ListProductAll.assemble_price_damage[asmIndex]) : "-"} `;
        productCellPriceDamage.font = { size: 14, name: 'Angsana New' };
        productCellPriceDamage.alignment = { vertical: 'middle', horizontal: 'right' };

        worksheet.mergeCells(`M${rowNumber}`);
        const productCellTotalPrice = worksheet.getCell(`M${rowNumber}`);

        productCellTotalPrice.value = `${formatNumber(parseFloat((ListProductAll.assemble_quantity[asmIndex] * ListProductAll.assemble_price[asmIndex]) * outboundData.date))} `;
        productCellTotalPrice.font = { size: 14, name: 'Angsana New' };
        productCellTotalPrice.alignment = { vertical: 'middle', horizontal: 'right' };

        const finalASMs = ListProductAll.assemble_price[asmIndex] * outboundData.date * ListProductAll.assemble_quantity[asmIndex]
        totalFinalPrice2 += finalASMs;

        rowNumber++;
        let subIndex = 1;
        orderIndex++;

        if (ListProductAll.productsASM && ListProductAll.productsASM.length > 0) {
          ListProductAll.productsASM[asmIndex].forEach((itemDetail, index) => {
            worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
            const subAsmCell = worksheet.getCell(`B${rowNumber}`);

            worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
            const subProductCell = worksheet.getCell(`D${rowNumber}`);

            subAsmCell.value = `${orderIndex - 1}.${subIndex} ${itemDetail.name_asm}`;
            subAsmCell.font = { size: 13, name: 'Angsana New' };

            subProductCell.value = itemDetail.size_asm;
            subProductCell.font = { size: 13, name: 'Angsana New' };
            subProductCell.alignment = { vertical: 'middle', horizontal: 'left' };

            rowNumber++;
            subIndex++;
          });
        }

      });

    }

    ListProductAll.size.forEach((product, index) => {
      let rowNumber = 28 + index;
      worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
      const productCell = worksheet.getCell(`D${rowNumber}`);
      productCell.value = product;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    worksheet.mergeCells('H27:I27');
    const amout = worksheet.getCell('H27');
    amout.value = 'จำนวน';
    amout.font = { size: 14, bold: true, name: 'Angsana New' };
    amout.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.quantity.forEach((product, index) => {
      let rowNumber = 28 + index;

      const mergeRange = `H${rowNumber}:I${rowNumber}`;
      if (!worksheet.getCell(`H${rowNumber}`).isMerged) {
        worksheet.mergeCells(mergeRange);
      }

      const productCell = worksheet.getCell(`H${rowNumber}`);
      const productCellValue = combinedItems[index].unit;

      productCell.value = `${product + " " + productCellValue}`;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

    });

    const pricePerDay = worksheet.getCell('J27');
    pricePerDay.value = 'ค่าเช่า / วัน';
    pricePerDay.font = { size: 14, bold: true, name: 'Angsana New' };
    pricePerDay.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 28 + index;

      worksheet.mergeCells(`J${rowNumber}`);
      const productCell = worksheet.getCell(`J${rowNumber}`);

      productCell.value = `${formatNumber(product)} `;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };

    });

    const numberDay = worksheet.getCell('K27');
    numberDay.value = 'จำนวนวัน';
    numberDay.font = { size: 14, bold: true, name: 'Angsana New' };
    numberDay.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 28 + index;

      worksheet.mergeCells(`K${rowNumber}`);
      const productCell = worksheet.getCell(`K${rowNumber}`);

      productCell.value = outboundData.date;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

    });

    const priceDamage = worksheet.getCell('L27');
    priceDamage.value = 'ค่าปรับสินค้า / ชิ้น';
    priceDamage.font = { size: 14, bold: true, name: 'Angsana New' };
    priceDamage.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 28 + index;

      worksheet.mergeCells(`L${rowNumber}`);
      const productCell = worksheet.getCell(`L${rowNumber}`);
      const productCellValue = combinedItems[index].price_damage;

      productCell.value = `${formatNumber(productCellValue ? productCellValue : "-")} `;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };

    });

    const finalPrice = worksheet.getCell('M27');
    finalPrice.value = 'จำนวนเงินรวม';
    finalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    finalPrice.alignment = { vertical: 'middle', horizontal: 'center' };

    let totalFinalPrice1 = 0;

    ListProductAll.price.forEach((product, index) => {

      const price = parseFloat(product);
      const quantity = parseFloat(ListProductAll.quantity[index]);
      const date = parseFloat(outboundData.date);

      if (!isNaN(price) && !isNaN(quantity) && !isNaN(date)) {
        let rowNumber = 28 + index;

        worksheet.mergeCells(`M${rowNumber}`);
        const productCell = worksheet.getCell(`M${rowNumber}`);
        const finalPrice = price * date * quantity;
        totalFinalPrice1 += finalPrice;

        productCell.value = `${formatNumber(finalPrice)} `;
        productCell.font = { size: 14, name: 'Angsana New' };
        productCell.alignment = { vertical: 'middle', horizontal: 'right' };

      }
    });

    const movePriceTotal = parseFloat(outboundData.move_price) || 0;
    const shippingCostTotal = parseFloat(outboundData.shipping_cost) || 0;
    const discountTotal = parseFloat(outboundData.discount) || 0;
    const guaranteePriceTotal = parseFloat(outboundData.guarantee_price) || 0;

    const total_Price_Discount = (Number(totalFinalPrice1 + totalFinalPrice2) + movePriceTotal + shippingCostTotal) - discountTotal;
    const finalTotalPrice = (total_Price_Discount * 0.07) + (guaranteePriceTotal ? guaranteePriceTotal : 0) + total_Price_Discount;

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`M${rowNumber}`);
      const productCell = worksheet.getCell(`M${rowNumber}`);

      productCell.value = `${formatNumber(parseFloat((product.quantity * price) * data.date))} `;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };
    });

    worksheet.mergeCells('A68:J69');
    const priceThb = worksheet.getCell('A68');
    priceThb.value = formatThaiBahtText(finalTotalPrice);
    priceThb.font = { size: 14, bold: true, name: 'Angsana New' };
    priceThb.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ddddde' }
    };
    priceThb.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K68:L69');
    const totalFinalPrice = worksheet.getCell('K68');
    totalFinalPrice.value = ' ยอดรวมที่ต้องชำระ';
    totalFinalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPrice.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M68:M69');
    const totalFinalPriceValue = worksheet.getCell('M68');
    totalFinalPriceValue.value = `${formatNumber(finalTotalPrice)} `;
    totalFinalPriceValue.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const guaranteePrice = worksheet.getCell('K67');
    guaranteePrice.value = ' ค่าประกันสินค้า';
    guaranteePrice.font = { size: 13, name: 'Angsana New', bold: true };
    guaranteePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const guaranteePriceValue = worksheet.getCell('M67');
    guaranteePriceValue.value = `${(outboundData.guarantee_price ? formatNumber(outboundData.guarantee_price) : "-")} `;
    guaranteePriceValue.font = { size: 13, name: 'Angsana New', bold: true };
    guaranteePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const vat = worksheet.getCell('K66');
    vat.value = ' ภาษีมูลค่าเพิ่ม / Vat 7%';
    vat.font = { size: 13, name: 'Angsana New' };
    vat.alignment = { vertical: 'middle', horizontal: 'left' };

    const vatValue = worksheet.getCell('M66');
    vatValue.value = `${formatNumber(total_Price_Discount * 0.07) ? formatNumber(total_Price_Discount * 0.07) : "-"} `;
    vatValue.font = { size: 13, name: 'Angsana New' };
    vatValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalDiscount = worksheet.getCell('K65');
    totalDiscount.value = ' รวมหลังหักส่วนลด';
    totalDiscount.font = { size: 13, name: 'Angsana New' };
    totalDiscount.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalDiscountValue = worksheet.getCell('M65');
    totalDiscountValue.value = `${formatNumber(total_Price_Discount)} `;
    totalDiscountValue.font = { size: 13, name: 'Angsana New' };
    totalDiscountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const discount = worksheet.getCell('K64');
    discount.value = ' ส่วนลด';
    discount.font = { size: 13, name: 'Angsana New' };
    discount.alignment = { vertical: 'middle', horizontal: 'left' };

    const discountValue = worksheet.getCell('M64');
    discountValue.value = `${(outboundData.discount ? formatNumber(outboundData.discount) : "-")} `;
    discountValue.font = { size: 13, name: 'Angsana New' };
    discountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const movePrice = worksheet.getCell('K63');
    movePrice.value = ' ค่าบริการเคลื่อนย้ายสินค้า';
    movePrice.font = { size: 13, name: 'Angsana New' };
    movePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const movePriceValue = worksheet.getCell('M63');
    movePriceValue.value = `${(outboundData.move_price ? formatNumber(outboundData.move_price) : "-")} `;
    movePriceValue.font = { size: 13, name: 'Angsana New' };
    movePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const shippingCost = worksheet.getCell('K62');
    shippingCost.value = ' ค่าขนส่งสินค้าไป - กลับ';
    shippingCost.font = { size: 13, name: 'Angsana New' };
    shippingCost.alignment = { vertical: 'middle', horizontal: 'left' };

    const shippingCostValue = worksheet.getCell('M62');
    shippingCostValue.value = `${(outboundData.shipping_cost ? formatNumber(outboundData.shipping_cost) : "-")} `;
    shippingCostValue.font = { size: 13, name: 'Angsana New' };
    shippingCostValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalPriceOut = worksheet.getCell('K61');
    totalPriceOut.value = ' รวมเงิน';
    totalPriceOut.font = { size: 13, name: 'Angsana New' };
    totalPriceOut.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalPriceOutValue = worksheet.getCell('M61');
    totalPriceOutValue.value = `${formatNumber(totalFinalPrice1 + totalFinalPrice2)} `;
    totalPriceOutValue.font = { size: 13, name: 'Angsana New' };
    totalPriceOutValue.alignment = { vertical: 'middle', horizontal: 'right' };

    worksheet.mergeCells('A65:B65');
    const note = worksheet.getCell('A65');
    note.value = ' หมายเหตุ :';
    note.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    note.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C65:J65');
    const remark1 = worksheet.getCell('C65');
    remark1.value = `${outboundData.remark1 ? outboundData.remark1 : ""}`;
    remark1.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C66:J66');
    const remark2 = worksheet.getCell('C66');
    remark2.value = `${outboundData.remark2 ? outboundData.remark2 : ""}`;
    remark2.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C67:J67');
    const remark3 = worksheet.getCell('C67');
    remark3.value = `${outboundData.remark3 ? outboundData.remark3 : ""}`;
    remark3.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A54:J54');
    const noteif = worksheet.getCell('A54');
    noteif.value = ' เงื่อนไขการเช่าสินค้า/โปรดอ่านเงื่อนไขก่อนทำการเช่า';
    noteif.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    noteif.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A55:J55');
    const note1 = worksheet.getCell('A55');
    note1.value = ' 1. ผู้เช่าต้องชำระค่าเช่า เงินประกัน และค่าใช้จ่ายอื่น ๆ ตามที่ตกลงในใบเสนอราคา ก่อนวันรับสินค้า';
    note1.font = { size: 10, bold: true, name: 'Angsana New' };
    note1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A56:J56');
    const note2 = worksheet.getCell('A56');
    note2.value = ' 2. ทางร้านจะทำการจัดส่งสินค้าให้หลังจากมีการชำระเงินครบตามจำนวนที่ตกลงกันไว้';
    note2.font = { size: 10, bold: true, name: 'Angsana New' };
    note2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A57:J57');
    const note3 = worksheet.getCell('A57');
    note3.value = ' 3. การรับสินค้าผู้เช่าจะต้องเป็นผู้รับภาระในค่าขนส่ง โดยคิดจากระยะทางส่งตามจริงและไม่สามารถเรียกเก็บค่าใช้จ่ายใดๆจากผู้ให้เช่าทั้งสิ้น';
    note3.font = { size: 10, bold: true, name: 'Angsana New' };
    note3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A58:J58');
    const note4 = worksheet.getCell('A58');
    note4.value = ' 4. หากสินค้าเช่าเกิดความเสียหายหรือสูญหายผู้ให้เช่าจะทำการปรับเงินตามราคาสินค้าที่แจ้งไว้จากู้เช่า';
    note4.font = { size: 10, bold: true, name: 'Angsana New' };
    note4.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A59:J59');
    const note5 = worksheet.getCell('A59');
    note5.value = ' 5. ผู้เช่าสามารถเช่าขั้นต่ำ 3 วันเท่านั้น - วันส่งสินค้าทางร้านจะไม่คิดค่าเช่า และจะเริ่มคิดวันถัดไป วันรับคืนสินค้าคิดค่าเช่าตามปกติ';
    note5.font = { size: 10, bold: true, name: 'Angsana New' };
    note5.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A60:J60');
    const note6 = worksheet.getCell('A60');
    note6.value = ' 6. หากผู้เช่าต้องการต่อสัญญา ผู้เช่าต้องแจ้งผู้ให้ทราบล่วงหน้าอย่างน้อย 1-2 วัน ก่อนหมดสัญญาเช่า หากไม่แจ้งล่วงหน้า';
    note6.font = { size: 10, bold: true, name: 'Angsana New' };
    note6.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A61:J61');
    const note8 = worksheet.getCell('A61');
    note8.value = '      ผู้ให้เช่าจะทำการเก็บสินค้ากลับในวันที่ครบกำหนดทันที หากผู้เช่ายังไม่รื้อของเช่า ผู้ให้เช่าจะทำการรื้อถอนด้วยตนเอง';
    note8.font = { size: 10, bold: true, name: 'Angsana New' };
    note8.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A62:J62');
    const note9 = worksheet.getCell('A62');
    note9.value = '      และจะไม่รับผิดชอบต่อความเสียหายใดๆ เพราะถือว่าผู้เช่าผิดสัญญาเช่าต่อผู้ให้เช่า และทำการยึดมัดจำทั้งหมด';
    note9.font = { size: 10, bold: true, name: 'Angsana New' };
    note9.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A63:J63');
    const note10 = worksheet.getCell('A63');
    note10.value = ' 7. กรณีต่อสัญญาเช่าสินค้า ผู้เช่าต้องชำระค่าต่อสัญญาเช่าภายใน 1-2 วันหลังต่อสัญญาเช่า และไม่สามารถนำมาหักเงินประกัน';
    note10.font = { size: 10, bold: true, name: 'Angsana New' };
    note10.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A64:J64');
    const note11 = worksheet.getCell('A64');
    note11.value = ' 8. ผู้เช่าต้องเป็นผู้ดำเนินการเคลื่อนย้ายสินค้าเองทุกครั้ง หากไม่เคลื่อนย้ายสินค้าเอง ผู้เช่าจะต้องจ่ายค่าบริการเคลื่อนย้ายสินค้าให้แก่ผู้ให้เช่า';
    note11.font = { size: 10, bold: true, name: 'Angsana New', underline: true };
    note11.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A51:C51');
    const payment1 = worksheet.getCell('A51');
    payment1.value = '  ช่องทางชำระเงิน:';
    payment1.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment1.alignment = { vertical: 'middle', horizontal: 'left' };
    payment1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('A52:C52');
    const payment2 = worksheet.getCell('A52');
    payment2.value = '  ธ.กสิกรไทย / หจก.ภัทรชัย เเบบเหล็ก';
    payment2.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment2.alignment = { vertical: 'middle', horizontal: 'left' };
    payment2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('A53:C53');
    const payment3 = worksheet.getCell('A53');
    payment3.value = '  เลขที่บัญชี: 125-8-29096-4';
    payment3.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment3.alignment = { vertical: 'middle', horizontal: 'left' };
    payment3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('D48:H48');
    const payment4 = worksheet.getCell('D48');
    payment4.value = 'สรุปยอดสำหรับหัก ณ ที่จ่าย';
    payment4.font = { size: 12, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment4.alignment = { vertical: 'middle', horizontal: 'center' };
    payment4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D49:E49');
    const payment5 = worksheet.getCell('D49');
    payment5.value = ' ค่าเช่า 5%';
    payment5.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment5.alignment = { vertical: 'middle', horizontal: 'left' };
    payment5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const totalPriceFivePercent = (totalFinalPrice1 + totalFinalPrice2) - (discountTotal ? discountTotal : 0);
    const newPrice = ((totalFinalPrice1 + totalFinalPrice2) - (discountTotal ? discountTotal : 0)) * 0.05;
    const totalNewPrice = ((totalFinalPrice1 + totalFinalPrice2) - (discountTotal ? discountTotal : 0)) - newPrice;

    const payment51 = worksheet.getCell('F49');
    payment51.value = formatNumber((totalPriceFivePercent));
    payment51.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment51.alignment = { vertical: 'middle', horizontal: 'right' };
    payment51.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment52 = worksheet.getCell('G49');
    payment52.value = formatNumber(newPrice);
    payment52.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment52.alignment = { vertical: 'middle', horizontal: 'right' };
    payment52.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment53 = worksheet.getCell('H49');
    payment53.value = formatNumber(totalNewPrice);
    payment53.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment53.alignment = { vertical: 'middle', horizontal: 'right' };
    payment53.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const newShippingCostPrice = ((shippingCostTotal ? shippingCostTotal : 0) + (movePriceTotal ? movePriceTotal : 0)) * 0.03;
    const totalShippingCost = ((shippingCostTotal ? shippingCostTotal : 0) + (movePriceTotal ? movePriceTotal : 0)) - newShippingCostPrice;

    worksheet.mergeCells('D50:E50');
    const payment6 = worksheet.getCell('D50');
    payment6.value = ' ค่าขนส่ง 3%';
    payment6.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment6.alignment = { vertical: 'middle', horizontal: 'left' };
    payment6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment61 = worksheet.getCell('F50');
    payment61.value = formatNumber((shippingCostTotal ? shippingCostTotal : 0) + (movePriceTotal ? movePriceTotal : 0));
    payment61.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment61.alignment = { vertical: 'middle', horizontal: 'right' };
    payment61.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment62 = worksheet.getCell('G50');
    payment62.value = formatNumber(newShippingCostPrice);
    payment62.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment62.alignment = { vertical: 'middle', horizontal: 'right' };
    payment62.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment63 = worksheet.getCell('H50');
    payment63.value = formatNumber(totalShippingCost);
    payment63.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment63.alignment = { vertical: 'middle', horizontal: 'right' };
    payment63.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };


    worksheet.mergeCells('D51:E51');
    const payment7 = worksheet.getCell('D51');
    payment7.value = '  Vat 7%';
    payment7.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment7.alignment = { vertical: 'middle', horizontal: 'left' };
    payment7.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment71 = worksheet.getCell('F51');
    payment71.value = '';
    payment71.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment71.alignment = { vertical: 'middle', horizontal: 'right' };
    payment71.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment72 = worksheet.getCell('G51');
    payment72.value = '';
    payment72.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment72.alignment = { vertical: 'middle', horizontal: 'right' };
    payment72.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment73 = worksheet.getCell('H51');
    payment73.value = `${formatNumber(total_Price_Discount * 0.07) ? formatNumber(total_Price_Discount * 0.07) : "-"} `;
    payment73.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment73.alignment = { vertical: 'middle', horizontal: 'right' };
    payment73.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D52:E52');
    const payment8 = worksheet.getCell('D52');
    payment8.value = ' ประกัน';
    payment8.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment8.alignment = { vertical: 'middle', horizontal: 'left' };
    payment8.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment81 = worksheet.getCell('F52');
    payment81.value = '';
    payment81.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment81.alignment = { vertical: 'middle', horizontal: 'right' };
    payment81.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment82 = worksheet.getCell('G52');
    payment82.value = '';
    payment82.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment82.alignment = { vertical: 'middle', horizontal: 'right' };
    payment82.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment83 = worksheet.getCell('H52');
    payment83.value = formatNumber(guaranteePriceTotal ? guaranteePriceTotal : 0);
    payment83.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment83.alignment = { vertical: 'middle', horizontal: 'right' };
    payment83.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D53:E53');
    const payment9 = worksheet.getCell('D53');
    payment9.value = ' รวมจ่าย';
    payment9.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment9.alignment = { vertical: 'middle', horizontal: 'left' };
    payment9.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment91 = worksheet.getCell('F53');
    payment91.value = '';
    payment91.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment91.alignment = { vertical: 'middle', horizontal: 'right' };
    payment91.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment92 = worksheet.getCell('G53');
    payment92.value = '';
    payment92.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment92.alignment = { vertical: 'middle', horizontal: 'right' };
    payment92.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const newFinalPrice = totalNewPrice + totalShippingCost + (total_Price_Discount * 0.07) + guaranteePriceTotal;

    const payment93 = worksheet.getCell('H53');
    payment93.value = formatNumber(newFinalPrice);
    payment93.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment93.alignment = { vertical: 'middle', horizontal: 'right' };
    payment93.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };

    worksheet.mergeCells('A71:B71');
    const nameCustomer = worksheet.getCell('A71');
    nameCustomer.value = 'ผู้อนุมัติ :';
    nameCustomer.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomer.alignment = { vertical: 'bottom', horizontal: 'right' };

    const nameCompany = worksheet.getCell('C71');
    nameCompany.value = `${name}`;
    nameCompany.font = { size: 14, bold: true, name: 'Angsana New' };
    nameCompany.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('A72:B72');
    const nameCustomerDate = worksheet.getCell('A72');
    nameCustomerDate.value = 'ลงวันที่ :';
    nameCustomerDate.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomerDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    worksheet.mergeCells('H71:I71');
    const namePle = worksheet.getCell('H71');
    namePle.value = 'ผู้เสนอ :';
    namePle.font = { size: 13, bold: true, name: 'Angsana New' };
    namePle.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePle1 = worksheet.getCell('J71');
    namePle1.value = `${customer_sell}`;
    namePle1.font = { size: 14, bold: true, name: 'Angsana New' };
    namePle1.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('H72:I72');
    const namePleDate = worksheet.getCell('H72');
    namePleDate.value = 'ลงวันที่ :';
    namePleDate.font = { size: 13, bold: true, name: 'Angsana New' };
    namePleDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePleDate1 = worksheet.getCell('J72');
    namePleDate1.value = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    namePleDate1.font = { size: 14, bold: true, name: 'Angsana New' };
    namePleDate1.alignment = { vertical: 'bottom', horizontal: 'center' };

    const nameComDate = worksheet.getCell('C72');
    nameComDate.value = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    nameComDate.font = { size: 14, bold: true, name: 'Angsana New' };
    nameComDate.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('C71:F71');
    worksheet.mergeCells('C72:F72');
    worksheet.mergeCells('J71:L71');
    worksheet.mergeCells('J72:L72');

    for (let col = 1; col <= 13; col++) {

      const cell = worksheet.getCell(8, col);
      const cell_bottom = worksheet.getCell(12, 12);
      const cell_bottom8 = worksheet.getCell(25, 8);
      const cell_bottom9 = worksheet.getCell(25, 9);
      const cell_bottom10 = worksheet.getCell(25, 10);

      cell.border = {
        top: { style: 'medium' }
      };
      cell_bottom.border = {
        bottom: { style: 'thin' }
      };
      cell_bottom8.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom9.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom10.border = {
        bottom: { style: 'medium' }
      };
    }

    customer_name.border = {
      top: { style: 'medium' },
      left: { style: 'medium' }
    };
    customer_nameValue.border = {
      top: { style: 'medium' },
    };

    company_name.border = {
      left: { style: 'medium' }
    };

    addressName.border = {
      left: { style: 'medium' }
    }

    space.border = {
      left: { style: 'medium' }
    }

    phone.border = {
      left: { style: 'medium' }
    }

    taxNumber.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    taxNumberValue.border = {
      top: { style: 'medium' },
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    taxId.border = {
      left: { style: 'medium' },
      bottom: { style: 'medium' }
    };
    taxIdValue.border = {
      bottom: { style: 'medium' }
    };

    date.border = {
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    dateValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    expDate.border = {
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    expDateValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    condition.border = {
      left: { style: 'medium' },
      bottom: { style: 'medium' }
    };
    conditionValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'medium' }
    };

    for (let col = 1; col <= 13; col++) {

      const cell = worksheet.getCell(27, col);
      const cell_left = worksheet.getCell(27, 1);
      const cell_left1 = worksheet.getCell(27, 2);
      const cell_left2 = worksheet.getCell(27, 7);
      const cell_left3 = worksheet.getCell(27, 8);
      const cell_left4 = worksheet.getCell(27, 9);
      const cell_left5 = worksheet.getCell(27, 10);
      const cell_left6 = worksheet.getCell(27, 11);
      const cell_left7 = worksheet.getCell(27, 12);
      const cell_left8 = worksheet.getCell(27, 13);

      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left.border = {
        right: { style: 'thin' },
        left: { style: 'medium' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left1.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left2.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left3.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left4.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left5.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left6.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left7.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left8.border = {
        right: { style: 'medium' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
    }

    for (let row = 28; row <= 64; row++) {
      const cell = worksheet.getCell(`A${row}`);
      cell.border = {
        left: { style: 'medium' }
      };
    }

    for (let row = 28; row <= 47; row++) {

      const cell = worksheet.getCell(`B${row}`);
      const cell_b = worksheet.getCell(`B${row}`);
      const cell_h = worksheet.getCell(`H${row}`);
      const cell_j = worksheet.getCell(`J${row}`);
      const cell_k = worksheet.getCell(`K${row}`);
      const cell_l = worksheet.getCell(`L${row}`);
      const cell_m = worksheet.getCell(`M${row}`);

      cell.border = {
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell_b.border = {
        left: { style: 'thin' }
      };
      cell_h.border = {
        left: { style: 'thin' }
      };
      cell_j.border = {
        left: { style: 'thin' }
      };
      cell_k.border = {
        left: { style: 'thin' }
      };
      cell_l.border = {

        right: { style: 'thin' }
      };
      cell_m.border = {
        left: { style: 'thin' }
      };
    }

    for (let row = 28; row <= 64; row++) {
      const cell_a = worksheet.getCell(`A${row}`);
      const cell_m = worksheet.getCell(`M${row}`);
      const cell_l = worksheet.getCell(`L${row}`);
      const cell_k = worksheet.getCell(`K${row}`);
      const cell_j = worksheet.getCell(`J${row}`);
      cell_a.border = {
        left: { style: 'medium' }
      };
      cell_m.border = {
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
      cell_l.border = {
        left: { style: 'thin' }
      };
      cell_k.border = {
        left: { style: 'thin' }
      };
      cell_j.border = {
        left: { style: 'thin' }
      };
    }

    for (let col = 1; col <= 13; col++) {
      const cell = worksheet.getCell(69, col);
      const cell_right = worksheet.getCell(69, 13);
      const cell_left = worksheet.getCell(69, 1);
      const cell_h = worksheet.getCell(69, 8);
      const cell_i = worksheet.getCell(69, 9);
      const cell_k = worksheet.getCell(69, 11);

      const cell_guarantee = worksheet.getCell(67, 11);
      const cell_guarantee2 = worksheet.getCell(67, 12);
      const cell_guaranteeValue = worksheet.getCell(67, 13);

      const vat = worksheet.getCell(66, 11);
      const vat2 = worksheet.getCell(66, 12);
      const vatValue = worksheet.getCell(66, 13);

      const totalDiscount = worksheet.getCell(65, 11);
      const totalDiscount2 = worksheet.getCell(65, 12);
      const totalDiscountValue = worksheet.getCell(65, 13);

      const discount = worksheet.getCell(64, 11);
      const discount2 = worksheet.getCell(64, 12);
      const discountValue = worksheet.getCell(64, 13);

      const movePrice = worksheet.getCell(63, 11);
      const movePrice2 = worksheet.getCell(63, 12);
      const movePriceValue = worksheet.getCell(63, 13);

      const shippingCost = worksheet.getCell(62, 11);
      const shippingCost2 = worksheet.getCell(62, 12);
      const shippingCostValue = worksheet.getCell(62, 13);

      const totalPriceOut = worksheet.getCell(61, 11);
      const totalPriceOut2 = worksheet.getCell(61, 12);
      const totalPriceOutValue = worksheet.getCell(61, 13);

      const note = worksheet.getCell(65, col);
      const note1 = worksheet.getCell(65, 1);
      const note2 = worksheet.getCell(66, 1);
      const note3 = worksheet.getCell(67, 1);

      const spaceLast = worksheet.getCell(70, col);
      const spaceLast1 = worksheet.getCell(70, 1);
      const spaceLast2 = worksheet.getCell(70, 13);

      const spaceName = worksheet.getCell(73, col);
      const spaceName1 = worksheet.getCell(73, 1);
      const spaceName11 = worksheet.getCell(73, 7);
      const spaceName2 = worksheet.getCell(73, 13);
      const spaceName3 = worksheet.getCell(72, 1);
      const spaceName4 = worksheet.getCell(72, 13);
      const spaceName5 = worksheet.getCell(71, 1);
      const spaceName6 = worksheet.getCell(71, 13);

      spaceName.border = {
        bottom: { style: 'medium' }
      };
      spaceName11.border = {
        right: { style: 'thin' },
        bottom: { style: 'medium' }
      };
      spaceName1.border = {
        left: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceName2.border = {
        right: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceName3.border = {
        left: { style: 'medium' }
      };
      spaceName4.border = {
        right: { style: 'medium' }
      };
      spaceName5.border = {
        left: { style: 'medium' }
      };
      spaceName6.border = {
        right: { style: 'medium' }
      };

      spaceLast.border = {
        bottom: { style: 'medium' }
      };
      spaceLast1.border = {
        left: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceLast2.border = {
        right: { style: 'medium' },
        bottom: { style: 'medium' }
      };

      note.border = {
        top: { style: 'thin' }
      };
      note1.border = {
        left: { style: 'medium' },
        top: { style: 'thin' }
      };
      note2.border = {
        left: { style: 'medium' }
      };
      note3.border = {
        left: { style: 'medium' }
      };
      cell.border = {
        bottom: { style: 'medium' }
      };
      cell_right.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
      cell_left.border = {
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
      cell_h.border = {
        bottom: { style: 'medium' }
      };
      cell_i.border = {
        bottom: { style: 'medium' }
      };
      cell_k.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' }
      };

      cell_guarantee.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      cell_guarantee2.border = {
        top: { style: 'thin' }
      };
      cell_guaranteeValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      vat.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      vat2.border = {
        top: { style: 'thin' }
      };
      vatValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      totalDiscount.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      totalDiscount2.border = {
        top: { style: 'thin' }
      };
      totalDiscountValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      discount.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      discount2.border = {
        top: { style: 'thin' }
      };
      discountValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      movePrice.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      movePrice2.border = {
        top: { style: 'thin' }
      };
      movePriceValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      shippingCost.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      shippingCost2.border = {
        top: { style: 'thin' }
      };
      shippingCostValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      totalPriceOut.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      totalPriceOut2.border = {
        top: { style: 'thin' }
      };
      totalPriceOutValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
    }

    for (let col = 1; col < 11; col++) {
      const cell = worksheet.getCell(68, col);
      cell.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
    }

    for (let col = 1; col < 11; col++) {
      const cell = worksheet.getCell(44, col);
      const cell_1 = worksheet.getCell(44, 1);
      const cell_8 = worksheet.getCell(44, 8);
      const cell_9 = worksheet.getCell(44, 10);

      const cell_48 = worksheet.getCell(48, 2);
      const cell_49 = worksheet.getCell(49, 2);
      const cell_50 = worksheet.getCell(50, 2);

      const cell_54 = worksheet.getCell(54, 2);
      const cell_55 = worksheet.getCell(55, 2);
      const cell_56 = worksheet.getCell(56, 2);
      const cell_57 = worksheet.getCell(57, 2);
      const cell_58 = worksheet.getCell(58, 2);
      const cell_59 = worksheet.getCell(59, 2);
      const cell_60 = worksheet.getCell(60, 2);
      const cell_61 = worksheet.getCell(61, 2);
      const cell_62 = worksheet.getCell(62, 2);
      const cell_63 = worksheet.getCell(63, 2);
      const cell_64 = worksheet.getCell(64, 2);


      cell_1.border = {

        right: { style: 'thin' },
        left: { style: 'medium' }
      };
      cell_8.border = {

        left: { style: 'thin' }
      };
      cell_9.border = {
        left: { style: 'thin' },

      };

      cell_48.border = {
        left: { style: 'thin' }
      };
      cell_49.border = {
        left: { style: 'thin' }
      };
      cell_50.border = {
        left: { style: 'thin' }
      };

      cell_54.border = {
        top: { style: 'thin' },
        left: { style: 'medium' }
      };
      cell_55.border = {
        left: { style: 'medium' }
      };
      cell_56.border = {
        left: { style: 'medium' }
      };
      cell_57.border = {
        left: { style: 'medium' }
      };
      cell_58.border = {
        left: { style: 'medium' }
      };
      cell_59.border = {
        left: { style: 'medium' }
      };
      cell_60.border = {
        left: { style: 'medium' }
      };
      cell_61.border = {
        left: { style: 'medium' }
      };
      cell_62.border = {
        left: { style: 'medium' }
      };
      cell_63.border = {
        left: { style: 'medium' }
      };
      cell_64.border = {
        left: { style: 'medium' }
      };
    }

    for (let col = 10; col < 13; col++) {
      const cell = worksheet.getCell(71, col);
      const cell_72 = worksheet.getCell(72, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_72.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let col = 3; col < 7; col++) {
      const cell = worksheet.getCell(71, col);
      const cell_72 = worksheet.getCell(72, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_72.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let row = 71; row < 73; row++) {
      const cell = worksheet.getCell(`G${row}`);
      cell.border = {
        right: { style: 'thin' }
      };
    }

    const imagePath = "img/logo1.jpg";
    fetch(imagePath)
      .then((response) => response.blob())
      .then((imageBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const buffer = reader.result;
          const imageId = workbook.addImage({
            buffer: buffer,
            extension: 'jpeg',
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: 1 },
            ext: { width: productNameLength > 10 ? 175 : 165, height: 156 } //185,156
          });

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ใบเสนอราคา-เลขที่-${receiptNumber}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
          }).catch((error) => {
            console.error("Error while generating Excel file:", error);
          });
        };
        reader.readAsArrayBuffer(imageBlob);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

  };

  const exportToExcelNoneVat = () => {

    const retrievedData = localStorage.getItem("outboundData");
    const outboundData = JSON.parse(retrievedData);
    const productNameLength = outboundData.reserve[0].product_name.length;

    combinedItems.map((item, index) => (
      item.index = index + 1,
      item.price = item.price_damage
    ));

    const token = localStorage.getItem("token");
    axios
      .get("http://192.168.195.75:5000/v1/product/outbound/last-status", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "p@tt@r@ch@i2k24",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const lastReceiptNumber = res.data.data.receip_number;
          setData(lastReceiptNumber);
          const [prefix, number] = lastReceiptNumber.split('-');
          const incrementedNumber = (parseInt(number, 10) + 1).toString().padStart(3, '0');
          const newReceiptNumber = `${prefix}-${incrementedNumber}`;
          setReceiptNumber(newReceiptNumber);
          setData(res.data.data.receip_number);
        }
      });

    const formatThaiBahtText = (value) => {
      if (isNaN(Number(value)) || value === null || value === undefined) {
        return 'Invalid input';
      }
      return thaiBahtText(Number(value));
    };

    const formatNumber = (value) => {
      if (isNaN(Number(value)) || value === null || value === undefined) {
        return 'Invalid input';
      }
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const headerData = [
      [""],
      ["", "", "", ""],
      ["", "", "", "", "รับผลิต จำหน่ายเเละให้เช่า"],
      ["", "", "", "", "เเบบคาน , เเบบเสา , เเบบหล่องานถนน , ฟุตติ้ง"],
      ["", "", "", "", "นั่งร้าน , ยูเเจ็ค , เเจ็คเบส , ฉาก , ป๊อปค้ำยัน"],
      ["", "", "", "", "เเบบฐานเสาไฟ เเละเเบบพิเศษสั่งทำทุกชนิด"],
      ["", "", "", "", "095-5862149 , 085-3806974"],
      ["", "", "", "", "สาขา: โคกขาม 081-1571097 / นพวงศ์ 081-1571094 / ชลบุรี 083-1653979"]
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Outbound Data');
    const retrievedDataASM = localStorage.getItem("confirmitemASM");
    const outboundDataASM = JSON.parse(retrievedDataASM);

    worksheet.pageSetup = {
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: 9
    };

    worksheet.getColumn(1).width = productNameLength > 10 ? 11 : 6;
    worksheet.getColumn(2).width = 4;
    worksheet.getColumn(3).width = productNameLength > 10 ? 10 : 8;
    worksheet.getColumn(4).width = productNameLength > 10 ? 5 : 5;
    worksheet.getColumn(5).width = productNameLength > 10 ? 12 : 7;
    worksheet.getColumn(6).width = productNameLength > 10 ? 10 : 8;
    worksheet.getColumn(7).width = productNameLength > 10 ? 15 : 10;
    worksheet.getColumn(8).width = productNameLength > 10 ? 9 : 7;
    worksheet.getColumn(9).width = 7.5;
    worksheet.getColumn(10).width = productNameLength > 10 ? 11 : 8;
    worksheet.getColumn(11).width = productNameLength > 10 ? 10 : 7;
    worksheet.getColumn(12).width = 14;
    worksheet.getColumn(13).width = productNameLength > 10 ? 14.2 : 11.2;

    worksheet.addRows(headerData);

    worksheet.getRow(1).height = 1.5;
    worksheet.getRow(2).height = 1.5;

    worksheet.getRow(3).height = 29;
    worksheet.getRow(4).height = 18;
    worksheet.getRow(5).height = 18;
    worksheet.getRow(6).height = 18;
    worksheet.getRow(7).height = 18;
    worksheet.getRow(8).height = 18;

    worksheet.getRow(9).height = 10;

    worksheet.getRow(10).height = 6;
    worksheet.getRow(11).height = 6;
    worksheet.getRow(12).height = 6;
    worksheet.getRow(13).height = 6;
    worksheet.getRow(14).height = 6;
    worksheet.getRow(15).height = 6;
    worksheet.getRow(16).height = 6;
    worksheet.getRow(17).height = 6;
    worksheet.getRow(18).height = 6;
    worksheet.getRow(19).height = 7;
    worksheet.getRow(20).height = 7;
    worksheet.getRow(21).height = 7;
    worksheet.getRow(22).height = 5;
    worksheet.getRow(23).height = 7;
    worksheet.getRow(24).height = 6;
    worksheet.getRow(25).height = 6;
    worksheet.getRow(26).height = 7;

    worksheet.getRow(27).height = 5;
    worksheet.getRow(28).height = 5;

    // worksheet.getRow(38).height = 15;
    // worksheet.getRow(39).height = 15;
    // worksheet.getRow(40).height = 15;
    // worksheet.getRow(41).height = 15;
    // worksheet.getRow(42).height = 15;
    // worksheet.getRow(43).height = 15;

    worksheet.getRow(51).height = 18;
    worksheet.getRow(52).height = 18;
    worksheet.getRow(53).height = 18;
    worksheet.getRow(54).height = 18;
    worksheet.getRow(55).height = 18;
    worksheet.getRow(56).height = 18;
    worksheet.getRow(57).height = 18;
    worksheet.getRow(58).height = 18;
    worksheet.getRow(59).height = 18;
    worksheet.getRow(60).height = 18;

    worksheet.getRow(67).height = 11;
    worksheet.getRow(68).height = 11;

    worksheet.getRow(69).height = 10;

    worksheet.getRow(70).height = 25;
    worksheet.getRow(71).height = 25;
    worksheet.getRow(72).height = 12;

    worksheet.getRow(3).font = { size: 13, bold: true, name: 'Angsana New' };
    worksheet.getRow(4).font = { size: 13, bold: true, name: 'Angsana New' };
    worksheet.getRow(5).font = { size: 13, bold: true, name: 'Angsana New' };
    worksheet.getRow(6).font = { size: 13, bold: true, name: 'Angsana New' };
    worksheet.getRow(7).font = { size: 13, bold: true, name: 'Angsana New' };
    worksheet.getRow(8).font = { size: 13, bold: true, name: 'Angsana New' };

    worksheet.mergeCells('K5:M8');
    const cell = worksheet.getCell('K5');
    cell.value = "ใบเสนอราคา-เช่า / ใบเเจ้งหนี้";
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { size: 22, bold: true, name: 'Angsana New' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3fc9f7' }
    };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    };

    worksheet.mergeCells('E3:J3');
    const customer_Pattarachai = worksheet.getCell('E3');
    customer_Pattarachai.value = 'ร้านภัทรชัย เเบบเหล็ก';
    customer_Pattarachai.font = { size: 28, bold: true, name: 'Angsana New' };
    customer_Pattarachai.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A11:B13');
    const customer_name = worksheet.getCell('A11');
    customer_name.value = '   ชื่อผู้ติดต่อ :';
    customer_name.font = { size: 13, bold: true, name: 'Angsana New' };
    customer_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C11:F13');
    const customer_nameValue = worksheet.getCell('C11');
    customer_nameValue.value = selectedCustomer ? selectedCustomer : "-";
    customer_nameValue.font = { size: 13, name: 'Angsana New' };
    customer_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A14:B16');
    const company_name = worksheet.getCell('A14');
    company_name.value = '   ชื่อบริษัท :';
    company_name.font = { size: 13, bold: true, name: 'Angsana New' };
    company_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C14:J16');
    const company_nameValue = worksheet.getCell('C14');
    company_nameValue.value = selectedCompany ? selectedCompany : "-";
    company_nameValue.font = { size: 13, name: 'Angsana New' };
    company_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A17:B19');
    const address = worksheet.getCell('A17');
    address.value = '   ที่อยู่ :';
    address.font = { size: 13, bold: true, name: 'Angsana New' };
    address.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C17:J19');
    const addressValue = worksheet.getCell('C17');
    addressValue.value = outboundData.address ? outboundData.address : "-";
    addressValue.font = { size: 13, name: 'Angsana New' };
    addressValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A20:B22');
    const space = worksheet.getCell('A20');

    worksheet.mergeCells('C20:J22');
    const placeValue = worksheet.getCell('C20');
    placeValue.value = "หน้างาน - " + (workside ? workside : "-");
    placeValue.font = { size: 13, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    placeValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A23:B25');
    const phone = worksheet.getCell('A23');
    phone.value = '   โทร :';
    phone.font = { size: 13, bold: true, name: 'Angsana New' };
    phone.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C23:I25');
    const phoneValue = worksheet.getCell('C23:E25');
    phoneValue.value = `${customer_tel ? customer_tel : "-"}`;
    phoneValue.font = { size: 13, name: 'Angsana New' };
    phoneValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K10:K14');
    const taxNumber = worksheet.getCell('K10');
    taxNumber.value = ' เลขที่ Po :';
    taxNumber.font = { size: 13, bold: true, name: 'Angsana New' };
    taxNumber.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M10:M14');
    const taxNumberValue = worksheet.getCell('M10');
    taxNumberValue.value = `${receiptNumber}`;
    taxNumberValue.font = { size: 13, name: 'Angsana New' };
    taxNumberValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K15:L18');
    const date = worksheet.getCell('K15');
    date.value = ' วันที่เสนอ :';
    date.font = { size: 13, bold: true, name: 'Angsana New' };
    date.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M15:M18');
    const dateValue = worksheet.getCell('M15');
    dateValue.value = sell_date;
    dateValue.font = { size: 13, name: 'Angsana New' };
    dateValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K19:L22');
    const expDate = worksheet.getCell('K19');
    expDate.value = ' วันที่หมดอายุ :';
    expDate.font = { size: 13, bold: true, name: 'Angsana New' };
    expDate.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M19:M22');
    const expDateValue = worksheet.getCell('M19');
    expDateValue.value = '-';
    expDateValue.font = { size: 13, name: 'Angsana New' };
    expDateValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K23:L26');
    const condition = worksheet.getCell('K23');
    condition.value = ' เงื่อนไขการชำระเงิน :';
    condition.font = { size: 13, bold: true, name: 'Angsana New' };
    condition.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M23:M26');
    const conditionValue = worksheet.getCell('M23');
    conditionValue.value = 'เงินสด / โอน';
    conditionValue.font = { size: 13, name: 'Angsana New' };
    conditionValue.alignment = { vertical: 'middle', horizontal: 'left' };

    const ListProductAll = outboundData.reserve[0];
    const ListASMs = ListProductAll.productsASM;
    let totalFinalPrice2 = 0;
    const Indexplus = 30;
    let currentIndex = 1;

    const indexNumber = worksheet.getCell('A29');
    indexNumber.value = 'ลำดับที่';
    indexNumber.font = { size: 14, bold: true, name: 'Angsana New' };
    indexNumber.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.product_name.forEach((product, index) => {
      const rowNumber = Indexplus + index;
      const productCell = worksheet.getCell(`A${rowNumber}`);
      productCell.value = `${currentIndex}`;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

      currentIndex++;
    });

    worksheet.mergeCells('B29:G29');
    const listName = worksheet.getCell('B29');
    listName.value = 'รายการ';
    listName.font = { size: 14, bold: true, name: 'Angsana New' };
    listName.alignment = { vertical: 'middle', horizontal: 'center' };

    let rowNumber = 30
    let orderIndex = 1;

    ListProductAll.product_name.forEach((product, index) => {

      worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
      const productCell = worksheet.getCell(`B${rowNumber}`);

      productCell.value = product;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };

      rowNumber++;
      orderIndex++;

    });

    if (outboundDataASM) {

      outboundDataASM.forEach((asm, asmIndex) => {

        worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
        const asmNameCell = worksheet.getCell(`B${rowNumber}`);
        const productCell = worksheet.getCell(`A${rowNumber}`);

        productCell.value = `${orderIndex + 1 - 1}`;
        productCell.font = { size: 14, name: 'Angsana New' };
        productCell.alignment = { vertical: 'middle', horizontal: 'center' };

        asmNameCell.value = ListProductAll.assemble_name[asmIndex];
        asmNameCell.font = { size: 14, name: 'Angsana New' };
        asmNameCell.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
        const asmCell = worksheet.getCell(`H${rowNumber}`);

        asmCell.value = `${ListProductAll.assemble_quantity[asmIndex]} ${ListProductAll.unit_asm[asmIndex]}`;
        asmCell.font = { size: 14, name: 'Angsana New' };
        asmCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
        const subProductCell = worksheet.getCell(`D${rowNumber}`);

        subProductCell.value = `${ListProductAll.description[asmIndex]}`;
        subProductCell.font = { size: 14, name: 'Angsana New' };
        subProductCell.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells(`K${rowNumber}`);
        const productCellDate = worksheet.getCell(`K${rowNumber}`);

        productCellDate.value = `${outboundData.date}`;
        productCellDate.font = { size: 14, name: 'Angsana New' };
        productCellDate.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(`J${rowNumber}`);
        const productCellPerDay = worksheet.getCell(`J${rowNumber}`);

        productCellPerDay.value = `${formatNumber(ListProductAll.assemble_price[asmIndex]) ? formatNumber(ListProductAll.assemble_price[asmIndex]) : "-"} `;
        productCellPerDay.font = { size: 14, name: 'Angsana New' };
        productCellPerDay.alignment = { vertical: 'middle', horizontal: 'right' };

        worksheet.mergeCells(`L${rowNumber}`);
        const productCellPriceDamage = worksheet.getCell(`L${rowNumber}`);

        productCellPriceDamage.value = `${formatNumber(ListProductAll.assemble_price_damage[asmIndex]) ? formatNumber(ListProductAll.assemble_price_damage[asmIndex]) : "-"} `;
        productCellPriceDamage.font = { size: 14, name: 'Angsana New' };
        productCellPriceDamage.alignment = { vertical: 'middle', horizontal: 'right' };

        worksheet.mergeCells(`M${rowNumber}`);
        const productCellTotalPrice = worksheet.getCell(`M${rowNumber}`);
        productCellTotalPrice.value = `${formatNumber(parseFloat((ListProductAll.assemble_quantity[asmIndex] * ListProductAll.assemble_price[asmIndex]) * outboundData.date))} `;
        productCellTotalPrice.font = { size: 14, name: 'Angsana New' };
        productCellTotalPrice.alignment = { vertical: 'middle', horizontal: 'right' };

        const finalASMs = ListProductAll.assemble_price[asmIndex] * outboundData.date * ListProductAll.assemble_quantity[asmIndex]
        totalFinalPrice2 += finalASMs;

        rowNumber++;
        let subIndex = 1;
        orderIndex++;

        if (ListProductAll.productsASM && ListProductAll.productsASM.length > 0) {
          ListProductAll.productsASM[asmIndex].forEach((itemDetail, index) => {
            worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
            const subAsmCell = worksheet.getCell(`B${rowNumber}`);

            worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
            const subProductCell = worksheet.getCell(`D${rowNumber}`);

            subAsmCell.value = `${orderIndex - 1}.${subIndex} ${itemDetail.name_asm}`;
            subAsmCell.font = { size: 13, name: 'Angsana New' };

            subProductCell.value = itemDetail.size_asm;
            subProductCell.font = { size: 13, name: 'Angsana New' };
            subProductCell.alignment = { vertical: 'middle', horizontal: 'left' };

            rowNumber++;
            subIndex++;
          });
        }

      });

    }

    ListProductAll.size.forEach((product, index) => {
      let rowNumber = 30 + index;
      worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
      const productCell = worksheet.getCell(`D${rowNumber}`);
      productCell.value = product;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };


    });

    worksheet.mergeCells('H29:I29');
    const amout = worksheet.getCell('H29');
    amout.value = 'จำนวน';
    amout.font = { size: 14, bold: true, name: 'Angsana New' };
    amout.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.quantity.forEach((product, index) => {
      let rowNumber = 30 + index;

      const mergeRange = `H${rowNumber}:I${rowNumber}`;
      if (!worksheet.getCell(`H${rowNumber}`).isMerged) {
        worksheet.mergeCells(mergeRange);
      }

      const productCell = worksheet.getCell(`H${rowNumber}`);
      const productCellValue = combinedItems[index].unit || "";

      productCell.value = `${product + " " + productCellValue}`;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

    });

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 30 + index;

      worksheet.mergeCells(`K${rowNumber}`);
      const productCell = worksheet.getCell(`K${rowNumber}`);

      productCell.value = outboundData.date;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };

    });


    const pricePerDay = worksheet.getCell('J29');
    pricePerDay.value = 'ค่าเช่า / วัน';
    pricePerDay.font = { size: 14, bold: true, name: 'Angsana New' };
    pricePerDay.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 30 + index;

      worksheet.mergeCells(`J${rowNumber}`);
      const productCell = worksheet.getCell(`J${rowNumber}`);

      productCell.value = `${formatNumber(product)} `;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' }

    });

    const numberDay = worksheet.getCell('K29');
    numberDay.value = 'จำนวนวัน';
    numberDay.font = { size: 14, bold: true, name: 'Angsana New' };
    numberDay.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 30 + index;

      const productCell = worksheet.getCell(`K${rowNumber}`);
      productCell.value = outboundData.date;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' }

    });

    const priceDamage = worksheet.getCell('L29');
    priceDamage.value = 'ค่าปรับสินค้า / ชิ้น';
    priceDamage.font = { size: 14, bold: true, name: 'Angsana New' };
    priceDamage.alignment = { vertical: 'middle', horizontal: 'center' };

    ListProductAll.price.forEach((product, index) => {
      let rowNumber = 30 + index;

      worksheet.mergeCells(`L${rowNumber}`);
      const productCell = worksheet.getCell(`L${rowNumber}`);
      const productCellValue = combinedItems[index].price_damage;

      productCell.value = `${formatNumber(productCellValue ? productCellValue : "-")} `;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };

    });

    const finalPrice = worksheet.getCell('M29');
    finalPrice.value = 'จำนวนเงินรวม';
    finalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    finalPrice.alignment = { vertical: 'middle', horizontal: 'center' };

    let totalFinalPrice1 = 0;
    // let totalFinalPrice2 = 0;

    ListProductAll.price.forEach((product, index) => {

      const price = parseFloat(product);
      const quantity = parseFloat(ListProductAll.quantity[index]);
      const date = parseFloat(outboundData.date);

      if (!isNaN(price) && !isNaN(quantity) && !isNaN(date)) {
        let rowNumber = 30 + index;

        worksheet.mergeCells(`M${rowNumber}`);
        const productCell = worksheet.getCell(`M${rowNumber}`);
        const finalPrice = price * date * quantity;
        totalFinalPrice1 += finalPrice;

        productCell.value = `${formatNumber(finalPrice)} `;
        productCell.font = { size: 14, name: 'Angsana New' };
        productCell.alignment = { vertical: 'middle', horizontal: 'right' };

      }

    });

    const movePriceTotal = parseFloat(outboundData.move_price) || 0;
    const shippingCostTotal = parseFloat(outboundData.shipping_cost) || 0;
    const discountTotal = parseFloat(outboundData.discount) || 0;
    const guaranteePriceTotal = parseFloat(outboundData.guarantee_price) || 0;

    const total_Price_Discount = (Number(totalFinalPrice1 + totalFinalPrice2)) - discountTotal;
    const finalTotalPrice = total_Price_Discount + movePriceTotal + shippingCostTotal + guaranteePriceTotal;

    products.forEach((product, index) => {
      const rowNumber = 30 + index;
      worksheet.mergeCells(`M${rowNumber}`);
      const productCell = worksheet.getCell(`M${rowNumber}`);
      productCell.value = `${formatNumber(parseFloat((product.quantity * product.price) * data.date))} `;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };
    });

    worksheet.mergeCells('A67:J68');
    const priceThb = worksheet.getCell('A67');
    priceThb.value = formatThaiBahtText(finalTotalPrice);
    priceThb.font = { size: 14, bold: true, name: 'Angsana New' };
    priceThb.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ddddde' }
    };
    priceThb.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K67:L68');
    const totalFinalPrice = worksheet.getCell('K67');
    totalFinalPrice.value = ' ยอดรวมที่ต้องชำระ';
    totalFinalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPrice.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M67:M68');
    const totalFinalPriceValue = worksheet.getCell('M67');
    totalFinalPriceValue.value = `${formatNumber(finalTotalPrice)} `;
    totalFinalPriceValue.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const guaranteePrice = worksheet.getCell('K66');
    guaranteePrice.value = ' ค่าประกันสินค้า';
    guaranteePrice.font = { size: 13, name: 'Angsana New', bold: true };
    guaranteePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const guaranteePriceValue = worksheet.getCell('M66');
    guaranteePriceValue.value = `${(outboundData.guarantee_price ? formatNumber(outboundData.guarantee_price) : "-")} `;
    guaranteePriceValue.font = { size: 13, name: 'Angsana New', bold: true };
    guaranteePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    // const totalDiscount = worksheet.getCell('K58');
    // totalDiscount.value = ' รวมหลังหักส่วนลด';
    // totalDiscount.font = { size: 13, bold: true, name: 'Angsana New' };
    // totalDiscount.alignment = { vertical: 'middle', horizontal: 'left' };

    // const totalDiscountValue = worksheet.getCell('M58');
    // totalDiscountValue.value = `${formatNumber(total_Price_Discount)} `;
    // totalDiscountValue.font = { size: 13, bold: true, name: 'Angsana New' };
    // totalDiscountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    // const discount = worksheet.getCell('K57');
    // discount.value = ' ส่วนลด';
    // discount.font = { size: 13, name: 'Angsana New' };
    // discount.alignment = { vertical: 'middle', horizontal: 'left' };

    // const discountValue = worksheet.getCell('M57');
    // discountValue.value = `${(outboundData.discount ? formatNumber(outboundData.discount) : "-")} `;
    // discountValue.font = { size: 13, name: 'Angsana New' };
    // discountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const movePrice = worksheet.getCell('K65');
    movePrice.value = ' ค่าบริการเคลื่อนย้ายสินค้า';
    movePrice.font = { size: 13, name: 'Angsana New' };
    movePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const movePriceValue = worksheet.getCell('M65');
    movePriceValue.value = `${(outboundData.move_price ? formatNumber(outboundData.move_price) : "-")} `;
    movePriceValue.font = { size: 13, name: 'Angsana New' };
    movePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const shippingCost = worksheet.getCell('K64');
    shippingCost.value = ' ค่าขนส่งสินค้าไป - กลับ';
    shippingCost.font = { size: 13, name: 'Angsana New' };
    shippingCost.alignment = { vertical: 'middle', horizontal: 'left' };

    const shippingCostValue = worksheet.getCell('M64');
    shippingCostValue.value = `${(outboundData.shipping_cost ? formatNumber(outboundData.shipping_cost) : "-")} `;
    shippingCostValue.font = { size: 13, name: 'Angsana New' };
    shippingCostValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalDiscount = worksheet.getCell('K63');
    totalDiscount.value = ' รวมหลังหักส่วนลด';
    totalDiscount.font = { size: 13, name: 'Angsana New' };
    totalDiscount.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalDiscountValue = worksheet.getCell('M63');
    totalDiscountValue.value = `${formatNumber(total_Price_Discount)} `;
    totalDiscountValue.font = { size: 13, name: 'Angsana New' };
    totalDiscountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const discount = worksheet.getCell('K62');
    discount.value = ' ส่วนลด';
    discount.font = { size: 13, name: 'Angsana New' };
    discount.alignment = { vertical: 'middle', horizontal: 'left' };

    const discountValue = worksheet.getCell('M62');
    discountValue.value = `${(outboundData.discount ? formatNumber(outboundData.discount) : "-")} `;
    discountValue.font = { size: 13, name: 'Angsana New' };
    discountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalPriceOut = worksheet.getCell('K61');
    totalPriceOut.value = ' รวมเงิน';
    totalPriceOut.font = { size: 13, name: 'Angsana New' };
    totalPriceOut.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalPriceOutValue = worksheet.getCell('M61');
    totalPriceOutValue.value = `${formatNumber(totalFinalPrice1 + totalFinalPrice2)} `;
    totalPriceOutValue.font = { size: 13, name: 'Angsana New' };
    totalPriceOutValue.alignment = { vertical: 'middle', horizontal: 'right' };

    worksheet.mergeCells('A64:B64');
    const note = worksheet.getCell('A64');
    note.value = ' หมายเหตุ :';
    note.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    note.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C64:J64');
    const remark1 = worksheet.getCell('C64');
    remark1.value = `${outboundData.remark1 ? outboundData.remark1 : ""}`;
    remark1.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C65:J65');
    const remark2 = worksheet.getCell('C65');
    remark2.value = `${outboundData.remark2 ? outboundData.remark2 : ""}`;
    remark2.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C66:J66');
    const remark3 = worksheet.getCell('C66');
    remark3.value = `${outboundData.remark3 ? outboundData.remark3 : ""}`;
    remark3.font = { size: 13, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    remark3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A53:J53');
    const noteif = worksheet.getCell('A53');
    noteif.value = ' เงื่อนไขการเช่าสินค้า/โปรดอ่านเงื่อนไขก่อนทำการเช่า';
    noteif.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    noteif.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A54:J54');
    const note1 = worksheet.getCell('A54');
    note1.value = ' 1. ผู้เช่าต้องชำระค่าเช่า เงินประกัน และค่าใช้จ่ายอื่น ๆ ตามที่ตกลงในใบเสนอราคา ก่อนวันรับสินค้า';
    note1.font = { size: 10, bold: true, name: 'Angsana New' };
    note1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A55:J55');
    const note2 = worksheet.getCell('A55');
    note2.value = ' 2. ทางร้านจะทำการจัดส่งสินค้าให้หลังจากมีการชำระเงินครบตามจำนวนที่ตกลงกันไว้';
    note2.font = { size: 10, bold: true, name: 'Angsana New' };
    note2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A56:J56');
    const note3 = worksheet.getCell('A56');
    note3.value = ' 3. การรับสินค้าผู้เช่าจะต้องเป็นผู้รับภาระในค่าขนส่ง โดยคิดจากระยะทางส่งตามจริงและไม่สามารถเรียกเก็บค่าใช้จ่ายใดๆจากผู้ให้เช่าทั้งสิ้น';
    note3.font = { size: 10, bold: true, name: 'Angsana New' };
    note3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A57:J57');
    const note4 = worksheet.getCell('A57');
    note4.value = ' 4. หากสินค้าเช่าเกิดความเสียหายหรือสูญหายผู้ให้เช่าจะทำการปรับเงินตามราคาสินค้าที่แจ้งไว้จากู้เช่า';
    note4.font = { size: 10, bold: true, name: 'Angsana New' };
    note4.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A58:J58');
    const note5 = worksheet.getCell('A58');
    note5.value = ' 5. ผู้เช่าสามารถเช่าขั้นต่ำ 3 วันเท่านั้น - วันส่งสินค้าทางร้านจะไม่คิดค่าเช่า และจะเริ่มคิดวันถัดไป วันรับคืนสินค้าคิดค่าเช่าตามปกติ';
    note5.font = { size: 10, bold: true, name: 'Angsana New' };
    note5.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A59:J59');
    const note6 = worksheet.getCell('A59');
    note6.value = ' 6. หากผู้เช่าต้องการต่อสัญญา ผู้เช่าต้องแจ้งผู้ให้ทราบล่วงหน้าอย่างน้อย 1-2 วัน ก่อนหมดสัญญาเช่า หากไม่แจ้งล่วงหน้า';
    note6.font = { size: 10, bold: true, name: 'Angsana New' };
    note6.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A60:J60');
    const note8 = worksheet.getCell('A60');
    note8.value = '      ผู้ให้เช่าจะทำการเก็บสินค้ากลับในวันที่ครบกำหนดทันที หากผู้เช่ายังไม่รื้อของเช่า ผู้ให้เช่าจะทำการรื้อถอนด้วยตนเอง';
    note8.font = { size: 10, bold: true, name: 'Angsana New' };
    note8.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A61:J61');
    const note9 = worksheet.getCell('A61');
    note9.value = '      และจะไม่รับผิดชอบต่อความเสียหายใดๆ เพราะถือว่าผู้เช่าผิดสัญญาเช่าต่อผู้ให้เช่า และทำการยึดมัดจำทั้งหมด';
    note9.font = { size: 10, bold: true, name: 'Angsana New' };
    note9.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A62:J62');
    const note10 = worksheet.getCell('A62');
    note10.value = ' 7. กรณีต่อสัญญาเช่าสินค้า ผู้เช่าต้องชำระค่าต่อสัญญาเช่าภายใน 1-2 วันหลังต่อสัญญาเช่า และไม่สามารถนำมาหักเงินประกัน';
    note10.font = { size: 10, bold: true, name: 'Angsana New' };
    note10.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A63:J63');
    const note11 = worksheet.getCell('A63');
    note11.value = ' 8. ผู้เช่าต้องเป็นผู้ดำเนินการเคลื่อนย้ายสินค้าเองทุกครั้ง หากไม่เคลื่อนย้ายสินค้าเอง ผู้เช่าจะต้องจ่ายค่าบริการเคลื่อนย้ายสินค้าให้แก่ผู้ให้เช่า';
    note11.font = { size: 10, bold: true, name: 'Angsana New', underline: true };
    note11.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C50:F50');
    const payment1 = worksheet.getCell('C50');
    payment1.value = '  ช่องทางชำระเงิน: ธ.ทหารไทยธนชาต (ttb)';
    payment1.font = { size: 12, bold: true, name: 'Angsana New', color: { argb: 'F0070C0' }, underline: true };
    payment1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C51:G51');
    const payment2 = worksheet.getCell('C51');
    payment2.value = '  เลขที่บัญชี: 192-2-594344 / นางสาวกรวรรณ กองจันทึก';
    payment2.font = { size: 12, bold: true, name: 'Angsana New', color: { argb: 'F0070C0' }, underline: true };
    payment2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C52:D52');
    const payment3 = worksheet.getCell('C52');
    payment3.value = '  ยอดค่าเช่าเฉลี่ย / วัน :';
    payment3.font = { size: 12, bold: true, name: 'Angsana New' };
    payment3.alignment = { vertical: 'middle', horizontal: 'left' };
    payment3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCC00' } };

    const average = ((totalFinalPrice1 + totalFinalPrice2) - (outboundData.discount ? outboundData.discount : 0)) / outboundData.date;

    const payment3Value = worksheet.getCell('E52');
    payment3Value.value = formatNumber(average);
    payment3Value.font = { size: 12, bold: true, name: 'Angsana New', underline: true };
    payment3Value.alignment = { vertical: 'middle', horizontal: 'left' };
    payment3Value.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCC00' } };

    const payment3ValueThb = worksheet.getCell('F52');
    payment3ValueThb.value = '  บาท';
    payment3ValueThb.font = { size: 12, bold: true, name: 'Angsana New' };
    payment3ValueThb.alignment = { vertical: 'middle', horizontal: 'left' };
    payment3ValueThb.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCC00' } };

    worksheet.mergeCells('A70:B70');
    const nameCustomer = worksheet.getCell('A70');
    nameCustomer.value = 'ผู้อนุมัติ :';
    nameCustomer.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomer.alignment = { vertical: 'bottom', horizontal: 'right' };

    const nameCustomer1 = worksheet.getCell('C70');
    nameCustomer1.value = `${outboundData.customer_name}`;
    nameCustomer1.font = { size: 14, bold: true, name: 'Angsana New' };
    nameCustomer1.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('A71:B71');
    const nameCustomerDate = worksheet.getCell('A71');
    nameCustomerDate.value = 'ลงวันที่ :';
    nameCustomerDate.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomerDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    worksheet.mergeCells('H70:I70');
    const namePle = worksheet.getCell('H70');
    namePle.value = 'ผู้เสนอ :';
    namePle.font = { size: 13, bold: true, name: 'Angsana New' };
    namePle.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePle1 = worksheet.getCell('J70');
    namePle1.value = `${customer_sell}`;
    namePle1.font = { size: 14, bold: true, name: 'Angsana New' };
    namePle1.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('H71:I71');
    const namePleDate = worksheet.getCell('H71');
    namePleDate.value = 'ลงวันที่ :';
    namePleDate.font = { size: 13, bold: true, name: 'Angsana New' };
    namePleDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePleDate1 = worksheet.getCell('J71');
    namePleDate1.value = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    namePleDate1.font = { size: 14, bold: true, name: 'Angsana New' };
    namePleDate1.alignment = { vertical: 'bottom', horizontal: 'center' };

    const nameComDate = worksheet.getCell('C71');
    nameComDate.value = new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    nameComDate.font = { size: 14, bold: true, name: 'Angsana New' };
    nameComDate.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('C70:F70');
    worksheet.mergeCells('C71:F71');
    worksheet.mergeCells('J70:L70');
    worksheet.mergeCells('J71:L71');

    for (let col = 1; col <= 13; col++) {

      const cell = worksheet.getCell(10, col);
      const cell_bottom = worksheet.getCell(14, 12);
      const cell_bottom11 = worksheet.getCell(25, 1);
      const cell_bottom1 = worksheet.getCell(26, 1);
      const cell_bottom2 = worksheet.getCell(26, 2);
      const cell_bottom3 = worksheet.getCell(26, 3);
      const cell_bottom4 = worksheet.getCell(26, 4);
      const cell_bottom5 = worksheet.getCell(26, 5);
      const cell_bottom6 = worksheet.getCell(26, 6);
      const cell_bottom7 = worksheet.getCell(26, 7);
      const cell_bottom8 = worksheet.getCell(26, 8);
      const cell_bottom9 = worksheet.getCell(26, 9);
      const cell_bottom10 = worksheet.getCell(26, 10);

      cell.border = {
        top: { style: 'medium' }
      };
      cell_bottom.border = {
        bottom: { style: 'thin' }
      };
      cell_bottom11.border = {
        left: { style: 'medium' }
      };
      cell_bottom1.border = {
        left: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_bottom2.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom3.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom4.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom5.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom6.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom7.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom8.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom9.border = {
        bottom: { style: 'medium' }
      };
      cell_bottom10.border = {
        bottom: { style: 'medium' }
      };
    }

    customer_name.border = {
      left: { style: 'medium' }
    };

    company_name.border = {
      left: { style: 'medium' }
    };

    address.border = {
      left: { style: 'medium' }
    }

    space.border = {
      left: { style: 'medium' }
    }

    phone.border = {
      left: { style: 'medium' }
    }

    date.border = {
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    dateValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    expDate.border = {
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    expDateValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    condition.border = {
      left: { style: 'medium' },
      bottom: { style: 'medium' }
    };
    conditionValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'medium' }
    };

    taxNumber.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'thin' }
    };
    taxNumberValue.border = {
      top: { style: 'medium' },
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    totalPriceOut.border = {
      top: { style: 'thin' }
    };

    for (let col = 1; col <= 13; col++) {

      const cell = worksheet.getCell(29, col);
      const cell_left = worksheet.getCell(29, 1);
      const cell_left1 = worksheet.getCell(29, 2);
      const cell_left2 = worksheet.getCell(29, 7);
      const cell_left3 = worksheet.getCell(29, 8);
      const cell_left4 = worksheet.getCell(29, 9);
      const cell_left5 = worksheet.getCell(29, 10);
      const cell_left6 = worksheet.getCell(29, 11);
      const cell_left7 = worksheet.getCell(29, 12);
      const cell_left8 = worksheet.getCell(29, 13);

      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left.border = {
        right: { style: 'thin' },
        left: { style: 'medium' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left1.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left2.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left3.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left4.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left5.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left6.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left7.border = {
        right: { style: 'thin' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      cell_left8.border = {
        right: { style: 'medium' },
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      };
    }

    for (let row = 29; row <= 52; row++) {

      const cell = worksheet.getCell(`B${row}`);
      const cell_b = worksheet.getCell(`B${row}`);
      const cell_h = worksheet.getCell(`H${row}`);
      const cell_j = worksheet.getCell(`J${row}`);
      const cell_k = worksheet.getCell(`K${row}`);
      const cell_l = worksheet.getCell(`L${row}`);
      const cell_m = worksheet.getCell(`M${row}`);

      cell.border = {
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell_b.border = {
        left: { style: 'thin' }
      };
      cell_h.border = {
        left: { style: 'thin' }
      };
      cell_j.border = {
        left: { style: 'thin' }
      };
      cell_k.border = {
        left: { style: 'thin' }
      };
      cell_l.border = {

        right: { style: 'thin' }
      };
      cell_m.border = {
        left: { style: 'thin' }
      };
    }

    for (let row = 29; row <= 62; row++) {
      const cell_a = worksheet.getCell(`A${row}`);
      const cell_m = worksheet.getCell(`M${row}`);
      const cell_l = worksheet.getCell(`L${row}`);
      const cell_k = worksheet.getCell(`K${row}`);
      const cell_j = worksheet.getCell(`J${row}`);
      cell_a.border = {
        left: { style: 'medium' }
      };
      cell_m.border = {
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
      cell_l.border = {
        left: { style: 'thin' }
      };
      cell_k.border = {
        left: { style: 'thin' }
      };
      cell_j.border = {
        left: { style: 'thin' }
      };
    }

    for (let col = 1; col <= 13; col++) {
      const cell = worksheet.getCell(68, col);
      const cell_right = worksheet.getCell(68, 13);
      const cell_left = worksheet.getCell(68, 1);
      const cell_h = worksheet.getCell(68, 8);
      const cell_i = worksheet.getCell(68, 9);
      const cell_k = worksheet.getCell(68, 11);

      const cell_guarantee = worksheet.getCell(66, 11);
      const cell_guarantee2 = worksheet.getCell(66, 12);
      const cell_guaranteeValue = worksheet.getCell(66, 13);

      // const vat = worksheet.getCell(56, 11);
      // const vat2 = worksheet.getCell(56, 12);
      // const vatValue = worksheet.getCell(56, 13);

      const totalDiscount = worksheet.getCell(65, 11);
      const totalDiscount2 = worksheet.getCell(65, 12);
      const totalDiscountValue = worksheet.getCell(65, 13);

      const discount = worksheet.getCell(64, 11);
      const discount2 = worksheet.getCell(64, 12);
      const discountValue = worksheet.getCell(64, 13);

      const movePrice = worksheet.getCell(63, 11);
      const movePrice2 = worksheet.getCell(63, 12);
      const movePriceValue = worksheet.getCell(63, 13);

      const shippingCost = worksheet.getCell(62, 11);
      const shippingCost2 = worksheet.getCell(62, 12);
      const shippingCostValue = worksheet.getCell(62, 13);

      const totalPriceOut = worksheet.getCell(61, 11);
      const totalPriceOut2 = worksheet.getCell(61, 12);
      const totalPriceOutValue = worksheet.getCell(61, 13);

      const note = worksheet.getCell(64, col);
      const note1 = worksheet.getCell(64, 1);
      const note2 = worksheet.getCell(65, 1);
      const note3 = worksheet.getCell(66, 1);

      const spaceLast = worksheet.getCell(69, col);
      const spaceLast1 = worksheet.getCell(69, 1);
      const spaceLast2 = worksheet.getCell(69, 13);

      const spaceName = worksheet.getCell(72, col);
      const spaceName1 = worksheet.getCell(72, 1);
      const spaceName2 = worksheet.getCell(72, 13);
      const spaceName3 = worksheet.getCell(71, 1);
      const spaceName4 = worksheet.getCell(71, 13);
      const spaceName5 = worksheet.getCell(70, 1);
      const spaceName6 = worksheet.getCell(70, 13);

      spaceName.border = {
        bottom: { style: 'medium' }
      };
      spaceName1.border = {
        left: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceName2.border = {
        right: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceName3.border = {
        left: { style: 'medium' }
      };
      spaceName4.border = {
        right: { style: 'medium' }
      };
      spaceName5.border = {
        left: { style: 'medium' }
      };
      spaceName6.border = {
        right: { style: 'medium' }
      };

      spaceLast.border = {
        bottom: { style: 'medium' }
      };
      spaceLast1.border = {
        left: { style: 'medium' },
        bottom: { style: 'medium' }
      };
      spaceLast2.border = {
        right: { style: 'medium' },
        bottom: { style: 'medium' }
      };

      note.border = {
        top: { style: 'thin' }
      };
      note1.border = {
        left: { style: 'medium' },
        top: { style: 'thin' }
      };
      note2.border = {
        left: { style: 'medium' }
      };
      note3.border = {
        left: { style: 'medium' }
      };
      cell.border = {
        bottom: { style: 'medium' }
      };
      cell_right.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
      cell_left.border = {
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
      cell_h.border = {
        bottom: { style: 'medium' }
      };
      cell_i.border = {
        bottom: { style: 'medium' }
      };
      cell_k.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' }
      };

      cell_guarantee.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      cell_guarantee2.border = {
        top: { style: 'thin' }
      };
      cell_guaranteeValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      totalDiscount.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      totalDiscount2.border = {
        top: { style: 'thin' }
      };
      totalDiscountValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      discount.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      discount2.border = {
        top: { style: 'thin' }
      };
      discountValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      movePrice.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      movePrice2.border = {
        top: { style: 'thin' }
      };
      movePriceValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      shippingCost.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      shippingCost2.border = {
        top: { style: 'thin' }
      };
      shippingCostValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };

      totalPriceOut.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' }
      };
      totalPriceOut2.border = {
        top: { style: 'thin' }
      };
      totalPriceOutValue.border = {
        top: { style: 'thin' },
        right: { style: 'medium' },
        left: { style: 'thin' }
      };
    }

    for (let col = 1; col < 11; col++) {
      const cell = worksheet.getCell(67, col);
      cell.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
    }

    for (let col = 1; col < 11; col++) {
      const cell = worksheet.getCell(53, col);
      const cell_1 = worksheet.getCell(53, 1);
      const cell_8 = worksheet.getCell(53, 8);
      const cell_9 = worksheet.getCell(53, 10);

      const cell_44 = worksheet.getCell(53, 2);
      const cell_45 = worksheet.getCell(54, 2);
      const cell_46 = worksheet.getCell(55, 2);
      const cell_47 = worksheet.getCell(56, 2);
      const cell_48 = worksheet.getCell(57, 2);
      const cell_49 = worksheet.getCell(58, 2);
      const cell_50 = worksheet.getCell(59, 2);
      const cell_51 = worksheet.getCell(60, 2);
      const cell_52 = worksheet.getCell(61, 2);
      const cell_53 = worksheet.getCell(62, 2);
      const cell_54 = worksheet.getCell(63, 2);

      cell.border = {
        top: { style: 'thin' }
      };
      cell_1.border = {
        top: { style: 'thin' },
        right: { style: 'thin' },
        left: { style: 'medium' }
      };
      cell_8.border = {
        top: { style: 'thin' },
        left: { style: 'thin' }
      };
      cell_9.border = {
        left: { style: 'thin' },
        top: { style: 'thin' },
      };

      cell_44.border = {
        top: { style: 'thin' },
        left: { style: 'medium' }
      };
      cell_45.border = {
        left: { style: 'medium' }
      };
      cell_46.border = {
        left: { style: 'medium' }
      };
      cell_47.border = {
        left: { style: 'medium' }
      };
      cell_48.border = {
        left: { style: 'medium' }
      };
      cell_49.border = {
        left: { style: 'medium' }
      };
      cell_50.border = {
        left: { style: 'medium' }
      };
      cell_51.border = {
        left: { style: 'medium' }
      };
      cell_52.border = {
        left: { style: 'medium' }
      };
      cell_53.border = {
        left: { style: 'medium' }
      };
      cell_54.border = {
        left: { style: 'medium' }
      };
    }

    for (let col = 10; col < 13; col++) {
      const cell = worksheet.getCell(70, col);
      const cell_62 = worksheet.getCell(71, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_62.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let col = 3; col < 7; col++) {
      const cell = worksheet.getCell(70, col);
      const cell_62 = worksheet.getCell(71, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_62.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let row = 70; row < 73; row++) {
      const cell = worksheet.getCell(`G${row}`);
      cell.border = {
        right: { style: 'thin' }
      };
    }

    for (let col = 1; col < 14; col++) {
      const cell = worksheet.getCell(29, col);
      const cell_1 = worksheet.getCell(30, col);

      const cell_bottom20 = worksheet.getCell(30, 1);
      const cell_bottom21 = worksheet.getCell(30, 8);
      const cell_bottom22 = worksheet.getCell(30, 11);

      cell.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' }
      };

      cell_bottom20.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'medium' }
      };
      cell_bottom21.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' }
      };
      cell_bottom22.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' }
      };

      cell_1.border = {
        top: { style: 'medium' }
      };
    }

    for (let col = 1; col < 8; col++) {

      const cell = worksheet.getCell(72, col);
      const cell_1 = worksheet.getCell(72, 1);
      const cell_7 = worksheet.getCell(72, 7);

      cell.border = {
        bottom: { style: 'medium' },
      };
      cell_1.border = {
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
      cell_7.border = {
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      };
    }

    for (let col = 1; col < 13; col++) {

      const cell = worksheet.getCell(30, 13);
      const cell_0 = worksheet.getCell(29, 1);
      const cell_1 = worksheet.getCell(29, 13);
      const cell_2 = worksheet.getCell(10, 1);

      cell.border = {
        left: { style: 'thin' },
        right: { style: 'medium' }
      }
      cell_0.border = {
        top: { style: 'medium' },
        left: { style: 'medium' }
      }
      cell_1.border = {
        top: { style: 'medium' },
        right: { style: 'medium' },
        bottom: { style: 'medium' }
      }
      cell_2.border = {
        top: { style: 'medium' },
        left: { style: 'medium' }
      }
    }

    const imagePath = "img/logoNew.png";
    fetch(imagePath)
      .then((response) => response.blob())
      .then((imageBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const buffer = reader.result;
          const imageId = workbook.addImage({
            buffer: buffer,
            extension: 'png',
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: 1 },
            ext: { width: productNameLength > 10 ? 195 : 175, height: 162.5 }
          });

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ใบเสนอราคา-เลขที่-${receiptNumber}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
          }).catch((error) => {
            console.error("Error while generating Excel file:", error);
          });
        };
        reader.readAsArrayBuffer(imageBlob);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  return (

    <div className="w-full h-[100%] mt-5 overflow-hidden">
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
              <input
                className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500"
                value={"  " + branch}
                onChange={''}
              />
            </div>

            {/* {menu.map((item, index) => (
              <div
                key={index}
                className="grid justify-end items-center grid-cols-4 pt-10 "
              >
                <span className="col-span-1 grid justify-end  pr-2">
                  {item.title}
                </span>
                <input
                  type={item.type}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={
                    item.title === "ชื่อผู้มาติดต่อ :" ? (e) => setName(e.target.value)
                      : item.title === "ชื่อบริษัท :" ? (e) => setComName(e.target.value)
                        : item.title === "วันที่เสนอ :" ? (e) => handleDateChange(e.target.value)
                          : item.title === "ชื่อไซต์งาน :" ? (e) => setWorkside(e.target.value)
                            : item.title === "ที่อยู่ลูกค้า :" ? (e) => setAddress(e.target.value)
                              : item.title === "เบอร์โทรศัพท์ :" ? (e) => setcustomer_tel(e.target.value)
                                : null
                  }
                  value={
                    item.title === "ชื่อผู้มาติดต่อ :" ? name
                      : item.title === "ชื่อบริษัท :" ? comName
                        : item.title === "ที่อยู่ลูกค้า :" ? address
                          : item.title === "ชื่อไซต์งาน :" ? workside
                            : item.title === "วันที่เสนอ :" ? rawSellDate
                              : item.title === "เบอร์โทรศัพท์ :" ? customer_tel
                                : ""
                  }
                  className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (inputRefs.current[index + 1]) {
                        inputRefs.current[index + 1].focus();
                      }
                    }
                  }}
                />
              </div>
            ))} */}

            {/* <div className="grid justify-end items-center grid-cols-4 pt-10 ">
              <span className="col-span-1 grid justify-end pr-2">
                ชื่อผู้ติดต่อ :
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
              />
            </div>

            <div className="grid justify-end items-center grid-cols-4 pt-10 ">
              <span className="col-span-1 grid justify-end pr-2">
                ชื่อบริษัท :
              </span>
              <input
                type="text"
                value={comName}
                onChange={(e) => setComName(e.target.value)}
                className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
              />
            </div> */}

            <div className="grid justify-end items-center grid-cols-4 pt-10">
              <span className="col-span-1 grid justify-end pr-2">ชื่อผู้ติดต่อ :</span>
              <CreatableSelect
                value={selectedCustomer ? { value: selectedCustomer, label: selectedCustomer } : null}
                onFocus={() => handleFocus("ชื่อผู้มาติดต่อ :")}
                onBlur={() => handleBlur("ชื่อผู้มาติดต่อ :")}
                onChange={(selectedOption) => setSelectedCustomer(selectedOption ? selectedOption.value : "")}
                onCreateOption={(inputValue) => {
                  setNameData((prevData) => ({
                    ...prevData,
                    customer: [...prevData.customer, inputValue]
                  }));
                  setSelectedCustomer(inputValue);
                }}
                options={customerOptions}
                isClearable
                className="col-span-3 w-[80%] h-10 rounded-lg"
              />
            </div>

            <div className="grid justify-end items-center grid-cols-4 pt-10">
              <span className="col-span-1 grid justify-end pr-2">ชื่อบริษัท :</span>
              <CreatableSelect
                value={selectedCompany ? { value: selectedCompany, label: selectedCompany } : null}
                onFocus={() => handleFocus("ชื่อบริษัท :")}
                onBlur={() => handleBlur("ชื่อบริษัท :")}
                onChange={(selectedOption) => setSelectedCompany(selectedOption ? selectedOption.value : "")}
                onCreateOption={(inputValue) => {
                  setNameData((prevData) => ({
                    ...prevData,
                    companyNames: [...prevData.companyNames, inputValue]
                  }));
                  setSelectedCompany(inputValue);
                }}
                options={companyOptions}
                isClearable
                className="col-span-3 w-[80%] h-10 rounded-lg"
              />
            </div>

            {/* แสดงรายการอื่นๆ ของ menu */}
            {menu.filter(item => item.title !== "ชื่อผู้มาติดต่อ :" && item.title !== "ชื่อบริษัท :").map((item, index) => (
              <div key={index} className="grid justify-end items-center grid-cols-4 pt-10 ">
                <span className="col-span-1 grid justify-end pr-2">
                  {item.title}
                </span>
                <input
                  type={item.type}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={
                    item.title === "วันที่เสนอ :" ? (e) => handleDateChange(e.target.value)
                      : item.title === "ชื่อไซต์งาน :" ? (e) => setWorkside(e.target.value)
                        : item.title === "ที่อยู่ลูกค้า :" ? (e) => setAddress(e.target.value)
                          : item.title === "เบอร์โทรศัพท์ :" ? (e) => setcustomer_tel(e.target.value)
                            : null
                  }
                  value={
                    item.title === "วันที่เสนอ :" ? rawSellDate
                      : item.title === "ชื่อไซต์งาน :" ? workside
                        : item.title === "ที่อยู่ลูกค้า :" ? address
                          : item.title === "เบอร์โทรศัพท์ :" ? customer_tel
                            : ""
                  }
                  className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (inputRefs.current[index + 1]) {
                        inputRefs.current[index + 1].focus();
                      }
                    }
                  }}
                />
              </div>
            ))}

            <div className="grid justify-end items-center grid-cols-4 pt-10">
              <span className="col-span-1 grid justify-end pr-2">
                ชื่อผู้เสนอ :
              </span>
              <select
                className="col-span-3 w-[80%] h-10 rounded-lg border border-gray-500 p-2"
                value={customer_sell}
                onChange={(e) => setCustomer_sell(e.target.value)}
              >
                <option value="">เลือกชื่อผู้เสนอ</option>
                <option value="เปิ้ล - 0955862149">เปิ้ล - 0955862149</option>
                <option value="บาว - 0853806974">บาว - 0853806974</option>
                <option value="walkin / โคกขาม">walkin / โคกขาม</option>
                <option value="walkin / นพวงศ์">walkin / นพวงศ์</option>
                <option value="walkin / ชลบุรี<">walkin / ชลบุรี</option>
              </select>
            </div>

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

        <div className="col-span-3 grid grid-rows-10 h-[800px]">
          <div className="row-span-9 grid grid-rows-4 border border-gray-500 rounded-lg">

            <div className="row-span-1 grid grid-cols-3 grid-rows-6 pl-4 pr-4 pt-3">
              <span className="col-span-1 grid justify-start items-center mt-3">
                ห้างหุ้นส่วนจำกัด ภัทรชัย แบบเหล็ก
              </span>
              <span className="col-span-1 row-span-2 grid justify-center items-center text-xl font-bold">
                รายการส่งออกสินค้า
              </span>
              <span className="col-span-1 "></span>
              <span className="col-span-1 grid justify-start items-center mt-3">
                สาขา : {branch}
              </span>
              <span className="col-span-1 grid justify-end items-center">
                {""}
              </span>
              <span className="col-span-1 grid justify-start items-center mt-3">
                เริ่มเช่า : {sell_date ? sell_date : "-"}
              </span>
              <span className="col-span-1 grid justify-center items-center mt-3">
                ระยะเวลาเช่า : {day_length ? day_length : 0} วัน
              </span>
            </div>

            <div className="row-span-3 grid grid-rows-3 max-h-[calc(70vh-270px)] -mt-14">
              <div className="row-span-3 no-scrollbar flex justify-center items-start mr-3 ml-3 ">
                <div className="overflow-y-auto max-h-[calc(70vh-120px)] w-full">
                  <table className="w-full table-auto text-center border-collapse border-t-2 border-white">
                    <thead className="font-bold bg-blue-200 text-sky-800 sticky top-0 border-b-2">
                      <tr>
                        <th className="px-4 py-2 rounded-tl-lg">ลำดับ</th>
                        <th className="px-4 py-2">รายการ</th>
                        <th className="px-4 py-2">ขนาด</th>
                        <th className="px-4 py-2">รูปแบบ</th>
                        <th className="px-4 py-2">จำนวน</th>
                        <th className="px-4 py-2">ราคา</th>
                        {/* <th className="px-4 py-2">รวม</th> */}
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
                                value={item.isAssemble ? item.amountASM || 0 : item.amount || 0}
                                min={0}
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
                              <input
                                type="number"
                                className="px-2 py-2 text-center w-[100px] border border-black rounded-md"
                                value={item.isAssemble === true ? formatNumber(item.assemble_price) : day_length >= 30 ? formatNumber(item.price30D) || formatNumber(item.price) : formatNumber(item.price3D) || formatNumber(item.price)}
                                min={0}
                                onChange={(e) => handlePriceAPI(item.isAssemble ? item.id_asm : item.id, e.target.value, item.isAssemble)}
                              />
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
                <span className="col-span-3 grid justify-end mb-4">
                  รวมรายการสินค้าที่ส่งออกทั้งหมด
                </span>
                <span className="col-span-1 grid justify-center mb-4">{quantitySum}</span>
                <span className="col-span-1 grid justify-start mb-4">รายการ</span>
              </span>
              <span className="col-span-3 row-span-3 grid grid-cols-4">
                <span className="col-span-1"></span>
                {/* <span className="col-span-1 grid justify-end p-1">รวมเงิน</span>
                <span className="col-span-1 grid justify-end p-1">
                  {formatNumber(calculateTotalPrice())}
                </span> */}
                {/* <span className="col-span-1 grid justify-start p-1">บาท</span> */}

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

            <div className="row-span-1 items-center justify-end grid grid-cols-3 text-white mt-2 w-full ml-auto">
              <span className="col-span-1 flex justify-center">

                <button
                  className={`bg-blue-500 w-1/2 p-2 rounded-md hover:bg-blue-700 transition duration-300 flex justify-center items-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={confirm_order}
                  disabled={isLoading}
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
                  onClick={hasVat === true ? exportToExcelVat : exportToExcelNoneVat}
                >
                  <i className="fa-solid fa-file-export mr-2"></i>Preview Excel
                </button>
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
