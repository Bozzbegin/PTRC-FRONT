import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import thaiBahtText from 'thai-baht-text';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

export default function Quotation() {
  const location = useLocation();
  const { id } = location.state || {};

  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [note, setNote] = useState('');
  const [assemble, setAssemble] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [lesseeName, setLesseeName] = useState('');
  const [lessorName, setLessorName] = useState('');
  const [lesseeNameOne, setLesseeNameOne] = useState('');
  const [lessorNameTwo, setLessorNameTwo] = useState('');

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://192.168.195.75:5000/v1/product/status/status-one/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "1234567890abcdef",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          setProducts(res.data.data.products);
          setAssemble(res.data.data.quotation_type);
          const createDate = new Date(res.data.data.reserve_out);
          const expiryDate = new Date(createDate);
          expiryDate.setDate(createDate.getDate() + 7);
          setExpiryDate(expiryDate.toISOString().split("T")[0]);
        }
      });

  }, [id]);

  const num = [1, 2, 3, 4, 5, 6];

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

  const exportToExcel = () => {

    const headerData = [
      [""],
      ["", "", "", "", "ห้างหุ้นส่วนจำกัด ภัทรชัย เเบบเหล็ก (สำนักงานใหญ่)"],
      ["", "", "", "", "PATTARACHAI BABLEK PART.,LTD.(HEAD OFFICE)"],
      ["", "", "", "", "12/8 หมู่ที่ 7 ต.โคกขาม อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000"],
      ["", "", "", "", "โทร : 034-133093     เลขประจำตัวผู้เสียภาษีอากร : 0-1335-62000-93-5"],
      ["", "", "", "", "สาขา: โคกขาม 084-1571097 / นพวงศ์ 084-1571094 / ชลบุรี 083-1653979"]
    ];

    const productData = products.map((product, index) => ([
      index + 1,
      `${product.name} ${product.size}`,
      `${product.quantity} ${product.unit}`,
      product.price,
      data.date,
      product.price_damage ? product.price_damage : 0,
      (product.quantity * product.price) * data.date
    ]));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quotation');

    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 4;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 3;
    worksheet.getColumn(5).width = 7;
    worksheet.getColumn(6).width = 8;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 7;
    worksheet.getColumn(9).width = 5;
    worksheet.getColumn(10).width = 8;
    worksheet.getColumn(11).width = 7;
    worksheet.getColumn(12).width = 12;
    worksheet.getColumn(13).width = 10;

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

    worksheet.getRow(38).height = 15;
    worksheet.getRow(39).height = 15;
    worksheet.getRow(40).height = 15;
    worksheet.getRow(41).height = 15;
    worksheet.getRow(42).height = 15;
    worksheet.getRow(43).height = 15;

    worksheet.getRow(44).height = 18;
    worksheet.getRow(45).height = 18;
    worksheet.getRow(46).height = 18;
    worksheet.getRow(47).height = 18;
    worksheet.getRow(48).height = 18;
    worksheet.getRow(49).height = 18;
    worksheet.getRow(50).height = 18;

    worksheet.getRow(58).height = 11;
    worksheet.getRow(59).height = 11;

    worksheet.getRow(60).height = 10;

    worksheet.getRow(61).height = 25;
    worksheet.getRow(62).height = 25;
    worksheet.getRow(63).height = 12;

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
    customer_nameValue.value = `${data.customer_name ? data.customer_name : "-"}`;
    customer_nameValue.font = { size: 13, name: 'Angsana New' };
    customer_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A11:B13');
    const company_name = worksheet.getCell('A11');
    company_name.value = '   ชื่อบริษัท :';
    company_name.font = { size: 13, bold: true, name: 'Angsana New' };
    company_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C11:J13');
    const company_nameValue = worksheet.getCell('C11');
    company_nameValue.value = `${data.company_name ? data.company_name : "-"}`;
    company_nameValue.font = { size: 13, name: 'Angsana New' };
    company_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A14:B16');
    const address = worksheet.getCell('A14');
    address.value = '   ที่อยู่ :';
    address.font = { size: 13, bold: true, name: 'Angsana New' };
    address.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C14:J16');
    const addressValue = worksheet.getCell('C14');
    addressValue.value = `${data.address ? data.address : "-"}`;
    addressValue.font = { size: 13, name: 'Angsana New' };
    addressValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A17:B19');
    const space = worksheet.getCell('A17');

    worksheet.mergeCells('C17:J19');
    const placeValue = worksheet.getCell('C17');
    placeValue.value = `หน้างาน - ${data.place_name ? data.place_name : "-"}`;
    placeValue.font = { size: 13, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    placeValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A20:B22');
    const phone = worksheet.getCell('A20');
    phone.value = '   โทร :';
    phone.font = { size: 13, bold: true, name: 'Angsana New' };
    phone.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C20:E22');
    const phoneValue = worksheet.getCell('C20:E22');
    phoneValue.value = `${data.customer_tel ? data.customer_tel : "-"}`;
    phoneValue.font = { size: 13, name: 'Angsana New' };
    phoneValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A23:C25');
    const taxId = worksheet.getCell('A23');
    taxId.value = '   เลขประจำตัวผู้เสียภาษีอากร:';
    taxId.font = { size: 13, bold: true, name: 'Angsana New' };
    taxId.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('D23:G25');
    const taxIdValue = worksheet.getCell('D23:G25');
    taxIdValue.font = { size: 13, name: 'Angsana New' };
    taxIdValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K8:K12');
    const taxNumber = worksheet.getCell('K8');
    taxNumber.value = 'เลขที่ Po :';
    taxNumber.font = { size: 13, bold: true, name: 'Angsana New' };
    taxNumber.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M8:M12');
    const taxNumberValue = worksheet.getCell('M8');
    taxNumberValue.value = `${data.export_number}`;
    taxNumberValue.font = { size: 13, name: 'Angsana New' };
    taxNumberValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K13:L16');
    const date = worksheet.getCell('K13');
    date.value = '  วันที่เสนอ :';
    date.font = { size: 13, bold: true, name: 'Angsana New' };
    date.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M13:M16');
    const dateValue = worksheet.getCell('M13');
    dateValue.value = `${data.reserve_out
      ? new Date(data.reserve_out).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      : ''}`;
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

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      const productCell = worksheet.getCell(`A${rowNumber}`);
      productCell.value = `${index + 1}`;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('B27:G27');
    const listName = worksheet.getCell('B27');
    listName.value = 'รายการ';
    listName.font = { size: 14, bold: true, name: 'Angsana New' };
    listName.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
      const productCell = worksheet.getCell(`B${rowNumber}`);
      if (assemble === 'with_assembled' && product.name && product.assemble_name) {
        productCell.value = `${product.name} (${product.assemble_name})`;
      } else if (product.name) {
        productCell.value = product.name;
      } else if (product.assemble_name) {
        productCell.value = product.assemble_name;
      }
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
      const productCell = worksheet.getCell(`D${rowNumber}`);
      productCell.value = `${product.size ? product.size : "-"}`;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`F${rowNumber}`);
      const productCell = worksheet.getCell(`F${rowNumber}`);
      productCell.value = `${product.unit ? product.unit : "-"}`;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    worksheet.mergeCells('H27:I27');
    const amout = worksheet.getCell('H27');
    amout.value = 'จำนวน';
    amout.font = { size: 14, bold: true, name: 'Angsana New' };
    amout.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
      const productCell = worksheet.getCell(`H${rowNumber}`);
      productCell.value = `${product.quantity}   ${product.unit ? product.unit : ""}`;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const pricePerDay = worksheet.getCell('J27');
    pricePerDay.value = 'ค่าเช่า / วัน';
    pricePerDay.font = { size: 14, bold: true, name: 'Angsana New' };
    pricePerDay.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`J${rowNumber}`);
      const productCell = worksheet.getCell(`J${rowNumber}`);
      productCell.value = `${formatNumber(product.price ? product.price : 0)} `;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };
    });

    const numberDay = worksheet.getCell('K27');
    numberDay.value = 'จำนวนวัน';
    numberDay.font = { size: 14, bold: true, name: 'Angsana New' };
    numberDay.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`K${rowNumber}`);
      const productCell = worksheet.getCell(`K${rowNumber}`);
      productCell.value = `${data.date}`;
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const priceDamage = worksheet.getCell('L27');
    priceDamage.value = 'ค่าปรับสินค้า / ชิ้น';
    priceDamage.font = { size: 14, bold: true, name: 'Angsana New' };
    priceDamage.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`L${rowNumber}`);
      const productCell = worksheet.getCell(`L${rowNumber}`);
      productCell.value = `${(product.price_damage ? formatNumber(product.price_damage) : "-")} `;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };
    });

    const finalPrice = worksheet.getCell('M27');
    finalPrice.value = 'จำนวนเงินรวม';
    finalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    finalPrice.alignment = { vertical: 'middle', horizontal: 'center' };

    const total_Price_Out = products.reduce((sum, product) => {
      return sum + (product.quantity * product.price * data.date);
    }, 0);

    const total_Price_Discount = total_Price_Out + (data.move_price ? data.move_price : 0) + (data.shipping_cost ? data.shipping_cost : 0) - (data.discount ? data.discount : 0);
    const finalTotalPrice = (total_Price_Discount * 0.07) + (data.guarantee_price ? data.guarantee_price : 0) + total_Price_Discount;

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`M${rowNumber}`);
      const productCell = worksheet.getCell(`M${rowNumber}`);
      productCell.value = `${formatNumber(parseFloat((product.quantity * product.price) * data.date))} `;
      productCell.font = { size: 13, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'right' };
    });

    worksheet.mergeCells('A58:J59');
    const priceThb = worksheet.getCell('A58');
    priceThb.value = formatThaiBahtText(finalTotalPrice);
    priceThb.font = { size: 14, bold: true, name: 'Angsana New' };
    priceThb.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ddddde' }
    };
    priceThb.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K58:L59');
    const totalFinalPrice = worksheet.getCell('K58');
    totalFinalPrice.value = ' ยอดรวมที่ต้องชำระ';
    totalFinalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPrice.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M58:M59');
    const totalFinalPriceValue = worksheet.getCell('M58');
    totalFinalPriceValue.value = `${formatNumber(finalTotalPrice)} `;
    totalFinalPriceValue.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const guaranteePrice = worksheet.getCell('K57');
    guaranteePrice.value = ' ค่าประกันสินค้า';
    guaranteePrice.font = { size: 13, name: 'Angsana New' };
    guaranteePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const guaranteePriceValue = worksheet.getCell('M57');
    guaranteePriceValue.value = `${(data.guarantee_price ? formatNumber(data.guarantee_price) : "-")} `;
    guaranteePriceValue.font = { size: 13, name: 'Angsana New' };
    guaranteePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const vat = worksheet.getCell('K56');
    vat.value = ' ภาษีมูลค่าเพิ่ม / Vat 7%';
    vat.font = { size: 13, name: 'Angsana New' };
    vat.alignment = { vertical: 'middle', horizontal: 'left' };

    const vatValue = worksheet.getCell('M56');
    vatValue.value = `${formatNumber(total_Price_Discount * 0.07) ? formatNumber(total_Price_Discount * 0.07) : "-"} `;
    vatValue.font = { size: 13, name: 'Angsana New' };
    vatValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalDiscount = worksheet.getCell('K55');
    totalDiscount.value = ' รวมหลังหักส่วนลด';
    totalDiscount.font = { size: 13, bold: true, name: 'Angsana New' };
    totalDiscount.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalDiscountValue = worksheet.getCell('M55');
    totalDiscountValue.value = `${formatNumber(total_Price_Discount)} `;
    totalDiscountValue.font = { size: 13, bold: true, name: 'Angsana New' };
    totalDiscountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const discount = worksheet.getCell('K54');
    discount.value = ' ส่วนลด';
    discount.font = { size: 13, name: 'Angsana New' };
    discount.alignment = { vertical: 'middle', horizontal: 'left' };

    const discountValue = worksheet.getCell('M54');
    discountValue.value = `${(data.discount ? formatNumber(data.discount) : "-")} `;
    discountValue.font = { size: 13, name: 'Angsana New' };
    discountValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const movePrice = worksheet.getCell('K53');
    movePrice.value = ' ค่าบริการเคลื่อนย้ายสินค้า';
    movePrice.font = { size: 13, name: 'Angsana New' };
    movePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const movePriceValue = worksheet.getCell('M53');
    movePriceValue.value = `${(data.move_price ? formatNumber(data.move_price) : "-")} `;
    movePriceValue.font = { size: 13, name: 'Angsana New' };
    movePriceValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const shippingCost = worksheet.getCell('K52');
    shippingCost.value = ' ค่าขนส่งสินค้าไป - กลับ';
    shippingCost.font = { size: 13, bold: true, name: 'Angsana New' };
    shippingCost.alignment = { vertical: 'middle', horizontal: 'left' };

    const shippingCostValue = worksheet.getCell('M52');
    shippingCostValue.value = `${(data.shipping_cost ? formatNumber(data.shipping_cost) : "-")} `;
    shippingCostValue.font = { size: 13, bold: true, name: 'Angsana New' };
    shippingCostValue.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalPrice = products.reduce((sum, product) => {
      return sum + (product.quantity * product.price * data.date);
    }, 0);
    const totalPriceOut = worksheet.getCell('K51');
    totalPriceOut.value = ' รวมเงิน';
    totalPriceOut.font = { size: 13, name: 'Angsana New' };
    totalPriceOut.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalPriceOutValue = worksheet.getCell('M51');
    totalPriceOutValue.value = `${formatNumber(totalPrice)} `;
    totalPriceOutValue.font = { size: 13, bold: true, name: 'Angsana New' };
    totalPriceOutValue.alignment = { vertical: 'middle', horizontal: 'right' };

    worksheet.mergeCells('A55:B55');
    const note = worksheet.getCell('A55');
    note.value = ' หมายเหตุ :';
    note.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    note.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C55:J55');
    worksheet.mergeCells('C56:J56');
    worksheet.mergeCells('C57:J57');

    worksheet.mergeCells('A44:J44');
    const noteif = worksheet.getCell('A44');
    noteif.value = ' เงื่อนไขการเช่าสินค้า/โปรดอ่านเงื่อนไขก่อนทำการเช่า';
    noteif.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    noteif.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A45:J45');
    const note1 = worksheet.getCell('A45');
    note1.value = ' 1. ผู้เช่าต้องชำระค่าเช่า เงินประกัน และค่าใช้จ่ายอื่น ๆ ตามที่ตกลงในใบเสนอราคา ก่อนวันรับสินค้า';
    note1.font = { size: 10, bold: true, name: 'Angsana New' };
    note1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A46:J46');
    const note2 = worksheet.getCell('A46');
    note2.value = ' 2. ทางร้านจะทำการจัดส่งสินค้าให้หลังจากมีการชำระเงินครบตามจำนวนที่ตกลงกันไว้';
    note2.font = { size: 10, bold: true, name: 'Angsana New' };
    note2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A47:J47');
    const note3 = worksheet.getCell('A47');
    note3.value = ' 3. การรับสินค้าผู้เช่าจะต้องเป็นผู้รับภาระในค่าขนส่ง โดยคิดจากระยะทางส่งตามจริงและไม่สามารถเรียกเก็บค่าใช้จ่ายใดๆจากผู้ให้เช่าทั้งสิ้น';
    note3.font = { size: 10, bold: true, name: 'Angsana New' };
    note3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A48:J48');
    const note4 = worksheet.getCell('A48');
    note4.value = ' 4. หากสินค้าเช่าเกิดความเสียหายหรือสูญหายผู้ให้เช่าจะทำการปรับเงินตามราคาสินค้าที่แจ้งไว้จากู้เช่า';
    note4.font = { size: 10, bold: true, name: 'Angsana New' };
    note4.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A49:J49');
    const note5 = worksheet.getCell('A49');
    note5.value = ' 5. ผู้เช่าสามารถเช่าขั้นต่ำ 3 วันเท่านั้น - วันส่งสินค้าทางร้านจะไม่คิดค่าเช่า และจะเริ่มคิดวันถัดไป วันรับคืนสินค้าคิดค่าเช่าตามปกติ';
    note5.font = { size: 10, bold: true, name: 'Angsana New' };
    note5.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A50:J50');
    const note6 = worksheet.getCell('A50');
    note6.value = ' 6. หากผู้เช่าต้องการต่อสัญญา ผู้เช่าต้องแจ้งผู้ให้ทราบล่วงหน้าอย่างน้อย 1-2 วัน ก่อนหมดสัญญาเช่า หากไม่แจ้งล่วงหน้า';
    note6.font = { size: 10, bold: true, name: 'Angsana New' };
    note6.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A51:J51');
    const note8 = worksheet.getCell('A51');
    note8.value = '      ผู้ให้เช่าจะทำการเก็บสินค้ากลับในวันที่ครบกำหนดทันที หากผู้เช่ายังไม่รื้อของเช่า ผู้ให้เช่าจะทำการรื้อถอนด้วยตนเอง';
    note8.font = { size: 10, bold: true, name: 'Angsana New' };
    note8.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A52:J52');
    const note9 = worksheet.getCell('A52');
    note9.value = '      และจะไม่รับผิดชอบต่อความเสียหายใดๆ เพราะถือว่าผู้เช่าผิดสัญญาเช่าต่อผู้ให้เช่า และทำการยึดมัดจำทั้งหมด';
    note9.font = { size: 10, bold: true, name: 'Angsana New' };
    note9.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A53:J53');
    const note10 = worksheet.getCell('A53');
    note10.value = ' 7. กรณีต่อสัญญาเช่าสินค้า ผู้เช่าต้องชำระค่าต่อสัญญาเช่าภายใน 1-2 วันหลังต่อสัญญาเช่า และไม่สามารถนำมาหักเงินประกัน';
    note10.font = { size: 10, bold: true, name: 'Angsana New' };
    note10.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A54:J54');
    const note11 = worksheet.getCell('A54');
    note11.value = ' 8. ผู้เช่าต้องเป็นผู้ดำเนินการเคลื่อนย้ายสินค้าเองทุกครั้ง หากไม่เคลื่อนย้ายสินค้าเอง ผู้เช่าจะต้องจ่ายค่าบริการเคลื่อนย้ายสินค้าให้แก่ผู้ให้เช่า';
    note11.font = { size: 10, bold: true, name: 'Angsana New', underline: true };
    note11.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A41:C41');
    const payment1 = worksheet.getCell('A41');
    payment1.value = '  ช่องทางชำระเงิน:';
    payment1.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment1.alignment = { vertical: 'middle', horizontal: 'left' };
    payment1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('A42:C42');
    const payment2 = worksheet.getCell('A42');
    payment2.value = '  ธ.กสิกรไทย / หจก.ภัทรชัย เเบบเหล็ก';
    payment2.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment2.alignment = { vertical: 'middle', horizontal: 'left' };
    payment2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('A43:C43');
    const payment3 = worksheet.getCell('A43');
    payment3.value = '  เลขที่บัญชี: 125-8-29096-4';
    payment3.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FF0000FF' } };
    payment3.alignment = { vertical: 'middle', horizontal: 'left' };
    payment3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFADD8E6' } };

    worksheet.mergeCells('D38:H38');
    const payment4 = worksheet.getCell('D38');
    payment4.value = 'สรุปยอดสำหรับหัก ณ ที่จ่าย';
    payment4.font = { size: 12, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment4.alignment = { vertical: 'middle', horizontal: 'center' };
    payment4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D39:E39');
    const payment5 = worksheet.getCell('D39');
    payment5.value = ' ค่าเช่า 5%';
    payment5.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment5.alignment = { vertical: 'middle', horizontal: 'left' };
    payment5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const newPrice = (totalPrice - (data.discount ? data.discount : 0)) * 0.05;
    const totalNewPrice = (totalPrice - (data.discount ? data.discount : 0)) - newPrice;

    const payment51 = worksheet.getCell('F39');
    payment51.value = formatNumber(totalPrice - (data.discount ? data.discount : 0));
    payment51.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment51.alignment = { vertical: 'middle', horizontal: 'right' };
    payment51.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment52 = worksheet.getCell('G39');
    payment52.value = formatNumber(newPrice);
    payment52.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment52.alignment = { vertical: 'middle', horizontal: 'right' };
    payment52.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment53 = worksheet.getCell('H39');
    payment53.value = formatNumber(totalNewPrice);
    payment53.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment53.alignment = { vertical: 'middle', horizontal: 'right' };
    payment53.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const newShippingCostPrice = ((data.shipping_cost ? data.shipping_cost : 0) + (data.move_price ? data.move_price : 0)) * 0.03;
    const totalShippingCost = ((data.shipping_cost ? data.shipping_cost : 0) + (data.move_price ? data.move_price : 0)) - newShippingCostPrice;

    worksheet.mergeCells('D40:E40');
    const payment6 = worksheet.getCell('D40');
    payment6.value = ' ค่าขนส่ง 3%';
    payment6.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment6.alignment = { vertical: 'middle', horizontal: 'left' };
    payment6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment61 = worksheet.getCell('F40');
    payment61.value = formatNumber((data.shipping_cost ? data.shipping_cost : 0) + (data.move_price ? data.move_price : 0));
    payment61.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment61.alignment = { vertical: 'middle', horizontal: 'right' };
    payment61.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment62 = worksheet.getCell('G40');
    payment62.value = formatNumber(newShippingCostPrice);
    payment62.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment62.alignment = { vertical: 'middle', horizontal: 'right' };
    payment62.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment63 = worksheet.getCell('H40');
    payment63.value = formatNumber(totalShippingCost);
    payment63.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment63.alignment = { vertical: 'middle', horizontal: 'right' };
    payment63.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };


    worksheet.mergeCells('D41:E41');
    const payment7 = worksheet.getCell('D41');
    payment7.value = '  Vat 7%';
    payment7.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment7.alignment = { vertical: 'middle', horizontal: 'left' };
    payment7.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment71 = worksheet.getCell('F41');
    payment71.value = '';
    payment71.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment71.alignment = { vertical: 'middle', horizontal: 'right' };
    payment71.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment72 = worksheet.getCell('G41');
    payment72.value = '';
    payment72.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment72.alignment = { vertical: 'middle', horizontal: 'right' };
    payment72.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment73 = worksheet.getCell('H41');
    payment73.value = formatNumber(total_Price_Discount * 0.07);
    payment73.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment73.alignment = { vertical: 'middle', horizontal: 'right' };
    payment73.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D42:E42');
    const payment8 = worksheet.getCell('D42');
    payment8.value = ' ประกัน';
    payment8.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment8.alignment = { vertical: 'middle', horizontal: 'left' };
    payment8.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment81 = worksheet.getCell('F42');
    payment81.value = '';
    payment81.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment81.alignment = { vertical: 'middle', horizontal: 'right' };
    payment81.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment82 = worksheet.getCell('G42');
    payment82.value = '';
    payment82.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment82.alignment = { vertical: 'middle', horizontal: 'right' };
    payment82.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment83 = worksheet.getCell('H42');
    payment83.value = formatNumber(data.guarantee_price ? data.guarantee_price : 0);
    payment83.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment83.alignment = { vertical: 'middle', horizontal: 'right' };
    payment83.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    worksheet.mergeCells('D43:E43');
    const payment9 = worksheet.getCell('D43');
    payment9.value = ' รวมจ่าย';
    payment9.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment9.alignment = { vertical: 'middle', horizontal: 'left' };
    payment9.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment91 = worksheet.getCell('F43');
    payment91.value = '';
    payment91.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment91.alignment = { vertical: 'middle', horizontal: 'right' };
    payment91.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const payment92 = worksheet.getCell('G43');
    payment92.value = '';
    payment92.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    payment92.alignment = { vertical: 'middle', horizontal: 'right' };
    payment92.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFDAB9' } };

    const newFinalPrice = totalNewPrice + (total_Price_Discount * 0.07) + totalShippingCost + data.guarantee_price;

    const payment93 = worksheet.getCell('H43');
    payment93.value = formatNumber(newFinalPrice);
    payment93.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    payment93.alignment = { vertical: 'middle', horizontal: 'right' };
    payment93.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };

    worksheet.mergeCells('A61:B61');
    const nameCustomer = worksheet.getCell('A61');
    nameCustomer.value = 'ผู้อนุมัติ :';
    nameCustomer.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomer.alignment = { vertical: 'bottom', horizontal: 'right' };

    const nameCompany = worksheet.getCell('C61');
    nameCompany.value = `${data.company_name}`;
    nameCompany.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCompany.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('A62:B62');
    const nameCustomerDate = worksheet.getCell('A62');
    nameCustomerDate.value = 'ลงวันที่ :';
    nameCustomerDate.font = { size: 13, bold: true, name: 'Angsana New' };
    nameCustomerDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    worksheet.mergeCells('H61:I61');
    const namePle = worksheet.getCell('H61');
    namePle.value = 'ผู้เสนอ :';
    namePle.font = { size: 13, bold: true, name: 'Angsana New' };
    namePle.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePle1 = worksheet.getCell('J61');
    namePle1.value = 'เปิ้ล 095-5862149';
    namePle1.font = { size: 13, bold: true, name: 'Angsana New' };
    namePle1.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('H62:I62');
    const namePleDate = worksheet.getCell('H62');
    namePleDate.value = 'ลงวันที่ :';
    namePleDate.font = { size: 13, bold: true, name: 'Angsana New' };
    namePleDate.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePleDate1 = worksheet.getCell('J62');
    namePleDate1.value = `${data.reserve_out
      ? new Date(data.reserve_out).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      : ''}`;;
    namePleDate1.font = { size: 13, bold: true, name: 'Angsana New' };
    namePleDate1.alignment = { vertical: 'bottom', horizontal: 'center' };

    const nameComDate = worksheet.getCell('C62');
    nameComDate.value = `${data.reserve_out
      ? new Date(data.reserve_out).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      : ''}`;;
    nameComDate.font = { size: 13, bold: true, name: 'Angsana New' };
    nameComDate.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('C61:F61');
    worksheet.mergeCells('C62:F62');
    worksheet.mergeCells('J61:L61');
    worksheet.mergeCells('J62:L62');

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

    address.border = {
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

    for (let row = 28; row <= 54; row++) {
      const cell = worksheet.getCell(`A${row}`);
      cell.border = {
        left: { style: 'medium' }
      };
    }

    for (let row = 28; row <= 37; row++) {

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

    for (let row = 28; row <= 54; row++) {
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
      const cell = worksheet.getCell(59, col);
      const cell_right = worksheet.getCell(59, 13);
      const cell_left = worksheet.getCell(59, 1);
      const cell_h = worksheet.getCell(59, 8);
      const cell_i = worksheet.getCell(59, 9);
      const cell_k = worksheet.getCell(59, 11);

      const cell_guarantee = worksheet.getCell(57, 11);
      const cell_guarantee2 = worksheet.getCell(57, 12);
      const cell_guaranteeValue = worksheet.getCell(57, 13);

      const vat = worksheet.getCell(56, 11);
      const vat2 = worksheet.getCell(56, 12);
      const vatValue = worksheet.getCell(56, 13);

      const totalDiscount = worksheet.getCell(55, 11);
      const totalDiscount2 = worksheet.getCell(55, 12);
      const totalDiscountValue = worksheet.getCell(55, 13);

      const discount = worksheet.getCell(54, 11);
      const discount2 = worksheet.getCell(54, 12);
      const discountValue = worksheet.getCell(54, 13);

      const movePrice = worksheet.getCell(53, 11);
      const movePrice2 = worksheet.getCell(53, 12);
      const movePriceValue = worksheet.getCell(53, 13);

      const shippingCost = worksheet.getCell(52, 11);
      const shippingCost2 = worksheet.getCell(52, 12);
      const shippingCostValue = worksheet.getCell(52, 13);

      const totalPriceOut = worksheet.getCell(51, 11);
      const totalPriceOut2 = worksheet.getCell(51, 12);
      const totalPriceOutValue = worksheet.getCell(51, 13);

      const note = worksheet.getCell(55, col);
      const note1 = worksheet.getCell(55, 1);
      const note2 = worksheet.getCell(56, 1);
      const note3 = worksheet.getCell(57, 1);

      const spaceLast = worksheet.getCell(60, col);
      const spaceLast1 = worksheet.getCell(60, 1);
      const spaceLast2 = worksheet.getCell(60, 13);

      const spaceName = worksheet.getCell(63, col);
      const spaceName1 = worksheet.getCell(63, 1);
      const spaceName11 = worksheet.getCell(63, 7);
      const spaceName2 = worksheet.getCell(63, 13);
      const spaceName3 = worksheet.getCell(62, 1);
      const spaceName4 = worksheet.getCell(62, 13);
      const spaceName5 = worksheet.getCell(61, 1);
      const spaceName6 = worksheet.getCell(61, 13);

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
      const cell = worksheet.getCell(58, col);
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

      const cell_38 = worksheet.getCell(38, 2);
      const cell_39 = worksheet.getCell(39, 2);
      const cell_40 = worksheet.getCell(40, 2);

      const cell_44 = worksheet.getCell(44, 2);
      const cell_45 = worksheet.getCell(45, 2);
      const cell_46 = worksheet.getCell(46, 2);
      const cell_47 = worksheet.getCell(47, 2);
      const cell_48 = worksheet.getCell(48, 2);
      const cell_49 = worksheet.getCell(49, 2);
      const cell_50 = worksheet.getCell(50, 2);
      const cell_51 = worksheet.getCell(51, 2);
      const cell_52 = worksheet.getCell(52, 2);
      const cell_53 = worksheet.getCell(53, 2);
      const cell_54 = worksheet.getCell(54, 2);

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

      cell_38.border = {
        left: { style: 'thin' }
      };
      cell_39.border = {
        left: { style: 'thin' }
      };
      cell_40.border = {
        left: { style: 'thin' }
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
      const cell = worksheet.getCell(61, col);
      const cell_62 = worksheet.getCell(62, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_62.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let col = 3; col < 7; col++) {
      const cell = worksheet.getCell(61, col);
      const cell_62 = worksheet.getCell(62, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_62.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let row = 61; row < 63; row++) {
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
            ext: { width: 185, height: 156 }
          });

          productData.forEach((row, index) => {
            const rowIndex = index + 100;
            worksheet.getRow(rowIndex).font = { size: 10, name: 'Angsana New' };
          });

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ใบเสนอราคา-เลขที่-${data.export_number}.xlsx`;
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
    <div className="w-screen h-auto p-2 mt-10 font-sarabun">
      <div className="grid grid-cols-5 border-b-4 pb-2 print:mb-0 print:p-0">
        <div className="col-span-3 flex">
          <img
            src="img/logo1.jpg"
            alt="logo"
            className="w-40 h-34 object-contain"
          />
          <div className="text-md print:text-[11.5px] w-full">
            <h1 className="text-lg font-bold whitespace-nowrap font-sarabun">ห้างหุ้นส่วนจำกัด ภัทรชัย เเบบเหล็ก (สำนักงานใหญ่)</h1>
            <h1 className="text-sm font-bold whitespace-nowrap font-sarabun">PATTARACHAI BABLEK PART.,LTD.(HEAD OFFICE)</h1>
            <p className="font-sarabun">12/8 หมู่ที่ 7 ต.โคกขาม อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000</p>
            <p className="whitespace-nowrap font-sarabun">โทร : 034-133093</p>
            <p className="whitespace-nowrap font-sarabun">เลขประจำตัวผู้เสียภาษีอากร : 0-1335-62000-93-5</p>
            <p className="font-sarabun">
              สาขา: โคกขาม 084-1571097 / นพวงศ์ 084-1571094 / ชลบุรี 083-1653979
            </p>
          </div>
        </div>

        <div className="col-span-2 flex justify-end items-center mt-6">
          <div className="border-2 border-black text-center p-2 w-[160px] h-20 flex justify-center items-center">
            <p className="text-sm font-bold whitespace-nowrap font-sarabun">ใบเสนอราคา / ใบเเจ้งหนี้</p>
          </div>
        </div>

      </div>

      {/* Customer Info */}
      <div className="mb-2 grid grid-cols-3">
        <div className="col-span-2 border-2 border-black print:col-span-2 print:text-[12px] text-md p-2 print:p-2 flex flex-col justify-around">
          <p>
            <span className="font-bold font-sarabun">ชื่อผู้ติดต่อ :</span><span className="ml-2 font-sarabun">{" " + data.customer_name}</span>
          </p>
          <p>
            <span className="font-bold font-sarabun">ชื่อบริษัท :</span><span className="ml-[17.5px] font-sarabun">{data.place_name}</span>
          </p>
          <p>
            <span className="font-bold font-sarabun">ที่อยู่ :</span><span className="ml-10 font-sarabun">{data.address}</span>
          </p>
          <p>
            <span className="font-bold "></span>
            <span className="ml-[69px] text-red-500 underline font-sarabun">{'หน้างาน - '}{data.place_name}</span>
          </p>

          <p>
            <span className="font-bold font-sarabun">โทร :</span><span className="ml-11 font-sarabun">099-999-9999</span>
          </p>
          <p>
            <span className="font-bold font-sarabun">เลขประจำตัวผู้เสียภาษีอากร :</span>
            <input
              type="text"
              className="ml-2 font-sarabun w-1/2"
              placeholder="กรอกเลขประจำตัวผู้เสียภาษี"
            />
          </p>
        </div>

        <div className="col-span-1 print:col-span-1 border-t-2 border-b-2 border-r-2 border-black grid grid-cols-2 grid-rows-4 text-sm print:text-[12px] items-center">
          <p className="col-span-1 border-b-2 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            เลขที่ :
          </p>
          <p className="border-b-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            {data.export_number}
          </p>
          <p className="col-span-1 border-b-2 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            วันที่เสนอราคา :
          </p>
          <p className="border-b-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            {data.reserve_out
              ? new Date(data.reserve_out).toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              : ''}
          </p>
          <p className="col-span-1 border-b-2 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            วันที่หมดอายุ :
          </p>
          <p className="border-b-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            {expiryDate
              ? new Date(expiryDate).toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              : ''}
          </p>
          <p className="col-span-1 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            เงื่อนไขการชำระเงิน :
          </p>
          <p className="border-black text-center flex justify-center items-center h-full font-sarabun">เงินสด/โอน</p>
        </div>

      </div>

      {/* Table */}
      <div className="h-[240px] text-sm grid grid-cols-10 grid-rows-11 print:text-[9px] ">
        {/* หัวตาราง */}
        <div className=" h-full w-full row-span-11 border-r-2 border-l-2 border-black flex flex-col text-center">
          <span className=" border-b-2 border-t-2 border-black font-bold font-sarabun">ลำดับ</span>
          {products.map((product, index) => (
            <span key={index} className="font-sarabun">{index + 1}</span>
          ))}
        </div>
        <div className=" h-full w-full col-span-4 row-span-11 border-r-2 border-black flex flex-col ">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">รายการ</span>
          {products.map((product, index) => (
            <span key={index} className="ml-2 font-sarabun">{product.name}  <span className='ml-10 font-sarabun'>{product.size}</span></span>
          ))}
        </div>
        <div className=" h-full w-full  row-span-11 border-r-2 border-black flex flex-col text-center ">
          <span className="  border-b-2 border-t-2 border-black font-bold font-sarabun">จำนวน</span>
          {products.map((product, index) => (
            <span key={index} className="font-sarabun">{product.quantity} {product.unit}</span>
          ))}
        </div>
        <div className=" h-full w-full  row-span-11 border-r-2 border-black flex flex-col text-center ">
          <span className="  border-b-2 border-t-2 border-black font-bold font-sarabun">ราคาเช่า/วัน</span>
          {products.map((product, index) => (
            <span key={index} className='mr-2 text-end print:text-[10px] font-sarabun'>{product.price}.00</span>
          ))}
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col text-center">
          <span className="  border-b-2 border-t-2 border-black  text-center font-bold font-sarabun">จำนวนวัน</span>
          <span className='print:text-[10px] font-sarabun'>{data.date}</span>
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col text-center">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">ค่าปรับสินค้า/ชิ้น</span>
          {products.map((product, index) => (
            <span key={index} className='mr-2 text-end print:text-[10px] font-sarabun'>{(product.price_damage ? product.price_damage : 0)}.00</span>
          ))}
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col ">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">จำนวนเงินรวม</span>
          {products.map((product, index) => (
            <span className='mr-2 text-end print:text-[10px] font-sarabun'>{formatNumber((product.quantity * product.price) * data.date)}</span>
          ))}
        </div>
        {/* ข้อมูลในตาราง */}

      </div>

      {/* <div className="col-span-3 row-span-3 border-l-2 border-t-2 border-r-2 border-black w-[150px]">
        <span className="underline font-sarabun block print:text-[9px] ml-2">ช่องทางการชำระเงิน :</span>
        <span className="font-sarabun block print:text-[9px] ml-2">ธ.กสิกรไทย / หจก.ภัทรชัย เเบบเหล็ก</span>
        <span className="font-sarabun block print:text-[9px] ml-2">เลขบัญชี: 125-8-290964</span>
      </div> */}

      {/* ส่วนเงื่อนไข */}
      <div className=" grid grid-cols-10 grid-rows-14 h-[300px] text-[9px]">
        {/* เงื่อนไขซ้ายมือ */}
        <div className="col-span-7 row-span-11 grid grid-rows-11 border-2 border-black text-[9px] print:text-[8px] p-1 ">
          <span className="row-span-1 underline font-sarabun">เงื่อนไขการเช่าสินค้า/โปรดอ่านเงื่อนไขก่อนทำการเช่าสินค้า</span>
          <span className="row-span-1 font-sarabun">1.ผู้เช่าจะต้องชำระค่าเช่า เงินประกัน และค่าใช้จ่ายอื่นๆตามที่ตกลงในใบเสนอราคา ก่อนวันรับสินค้า</span>
          <span className="row-span-1 font-sarabun">2.ทางร้านจะทำการจัดส่งสินค้าให้หลังจากมีการชำระเงินครบตามจำนวนที่ตกลงกันไว้</span>
          <span className="row-span-1 font-sarabun">3.การรับสินค้าผู้เช่าจะต้องเป็นผู้รับภาระในค่าขนส่ง โดยคิดจากระยะทางส่งตามจริงและไม่สามารถเรียกเก็บค่าใช้จ่ายใดๆจากผู้ให้เช่าทั้งสิ้น</span>
          <span className="row-span-1 font-sarabun">4.หากสินค้าเช่าเกิดความเสียหายหรือสูญหายผู้ให้เช่าจะทำการปรับเงินตามราคาสินค้าที่แจ้งไว้จากผู้เช่า</span>
          <span className="row-span-1 font-sarabun">5.ผู้เช่าสามารถเช่าขั้นต่ำได้ 3 วันเท่านั้น-วันส่งสินค้าทางร้านจะไม่คิดค่าเช่า และจะเริ่มคิดวันถัดไป วันรับคืนสินค้าคิดค่าเช่าตามปกติ</span>
          <span className="row-span-1 font-sarabun">6.หากผู้เช่าต้องการต่อสัญญา ผู้เช่าต้องแจ้งผู้ให้เช่าทราบล่วงหน้าอย่างน้อย 1-2วัน ก่อนหมดสัญญาเช่า หากไม่แจ้งล่างหน้า </span>
          <span className="row-span-1 font-sarabun">ผู้ให้เช่าจะทำการเก็บสินค้ากลับในวันที่ครบกำหนดทันที หากผู้เช่ายังไม่รื้้อของเช่า ผู้ให้เช่าจะทำการรื้อถอนด้วยตนเอง</span>
          <span className="row-span-1 font-sarabun">และจะไม่รับผิดชอบต่อความเสียหายใดๆ เพราะถือว่าผู้ให้เช่าผิดสัญญาเช่าต่อผู้ให้เช่า และทำการยึดค่ามัดจำทั้งหมด</span>
          <span className="row-span-1 font-sarabun">7.กรณีต่อสัญญาเช่าสินค้า ผู้เช่าต้องชำระค่าต่อสัญญาเช่าภายใน 1-2วันหลังต่อสัญญาเช่า และไม่สามารถนำมาหักเงินประกันได้</span>
          <span className="row-span-1 font-sarabun">8.ผู้เช่าต้องเป็นผู้กำเนินการเคลื่อนย้ายสินค้าเองทุกครั้ง หากไม่เคลื่อนย้ายสินค้าเอง ผู้เช่าจะต้องจ่ายค่าบริการเคลื่อนย้ายสินค้าให้แก่ผู้ให้เช่า</span>
        </div>
        {/* row7 */}

        <div className="border-r-2 col-span-1 row-span-7 border-black"></div>
        <div className="border-r-2 col-span-1 row-span-7 border-black"></div>
        <div className="border-r-2 col-span-1 row-span-7 border-black"></div>
        <span className="col-span-2 row-span-1 border-t-2 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">รวมเงิน</span>
        <span className="border-t-2 border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.total_price_out)}</span>
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าขนส่งสินค้าไป-กลับ</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.shipping_cost)}</span>
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าบริการเคลื่อนย้ายสินค้า</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.move_price)}</span>
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ส่วนลด</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.discount)}</span>

        <div className="col-span-7 row-span-4 border-r-2 border-l-2 border-b-2 border-black print:text-[10px]">
          <u className="font-sarabun text-red-500">หมายเหตุ :</u>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="กรอกหมายเหตุ"
            className="w-2/3 border-none font-sarabun resize-none ml-2 mt-3 text-red-500"
            rows="3"
          />
        </div>

        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">รวมหลังหักส่วนลด</span>
        <span className="col-span-1 row-span-1 border-b-2 border-r-2 border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.total_discount)}</span>

        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ภาษีมูลค่าเพิ่ม / vat7%</span>
        <span className="col-span-1 row-span-1 border-b-2 border-black border-r-2 flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.total_vat)}</span>

        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าประกันสินค้า</span>
        <span className="col-span-1 row-span-1 border-b-2 border-black border-r-2 flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.guarantee_price)}</span>

        <span className="col-span-2 row-span-1 border-b-2 border-r-2 border-black flex items-center p-1 print:text-[10px] font-sarabun">ยอดรวมที่ต้องชำระ</span>
        <span className="col-span-1 row-span-1 border-r-2 border-b-2 border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.final_price)}</span>

        <div className="col-span-11 row-span-2 flex justify-center items-center font-bold border-r-2 border-b-2 border-l-2 border-black print:text-[12px] font-sarabun">
          {formatThaiBahtText(data.final_price)}
        </div>

      </div>

      <div className="grid grid-cols-10 h-[70px] border-b-2 border-r-2 border-l-2 border-black text-[9px] font-sarabun">

        <div className=" col-span-5 border-r-2 border-black flex flex-col p-4 justify-around h-[60px] items-center h-[70px]">
          <div>
            <p className="font-sarabun w-[300px] ml-6">ลงชื่อ  <input type="text" value={lesseeName} onChange={(e) => setLesseeName(e.target.value)} className="w-4/5 " />  ผู้เช่า</p>
            <p className="font-sarabun ml-12 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
            <p className="font-sarabun w-[300px] ml-12"><input type="text" value={lesseeNameOne} onChange={(e) => setLesseeNameOne(e.target.value)} className="w-4/5 " /></p>
            <p className="font-sarabun ml-12 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          </div>
        </div>

        <div className=" col-span-5 border-black flex flex-col p-4 justify-around items-center h-[70px]">
          <div>
            <p className="font-sarabun w-[300px] ml-3">ลงชื่อ  <input type="text" value={lessorName} onChange={(e) => setLessorName(e.target.value)} className="w-4/5 " />  ผู้ให้เช่า</p>
            <p className="font-sarabun ml-9 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
            <p className="font-sarabun w-[300px] ml-9"><input type="text" value={lessorNameTwo} onChange={(e) => setLessorNameTwo(e.target.value)} className="w-4/5 " /></p>
            <p className="font-sarabun ml-9 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          </div>
        </div>

      </div>

      <div className="flex justify-center mt-4">
        <button className='bg-blue-500 w-1/4 p-2 print:hidden text-[16px] rounded-md shadow-md hover:bg-blue-600 transition duration-200 text-white' onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>
    </div >
  );
}
