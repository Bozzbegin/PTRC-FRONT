import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import thaiBahtText from 'thai-baht-text';
import ExcelJS from 'exceljs';

export default function Quotation() {
  const location = useLocation();
  const { id } = location.state || {};

  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');
  const [assemble, setAssemble] = useState(false);

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
          // expiryDate.setDate(createDate.getDate() + 2 + data.date);
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
    const productLength = products.length;

    worksheet.pageSetup = {
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: 9
    };

    // worksheet.getColumn(1).width = 6;
    // worksheet.getColumn(2).width = 4;
    // worksheet.getColumn(3).width = 10;
    // worksheet.getColumn(4).width = 3;
    // worksheet.getColumn(5).width = 7;
    // worksheet.getColumn(6).width = 8;
    // worksheet.getColumn(7).width = 10;
    // worksheet.getColumn(8).width = 7;
    // worksheet.getColumn(9).width = 5;
    // worksheet.getColumn(10).width = 8;
    // worksheet.getColumn(11).width = 7;
    // worksheet.getColumn(12).width = 12;
    // worksheet.getColumn(13).width = 10;
    worksheet.getColumn(1).width = productLength > 10 ? 11 : 6;
    worksheet.getColumn(2).width = productLength > 10 ? 6 : 4;
    worksheet.getColumn(3).width = productLength > 10 ? 12.9 : 9.9;
    worksheet.getColumn(4).width = productLength > 10 ? 5 : 3.9;
    worksheet.getColumn(5).width = productLength > 10 ? 10 : 8;
    worksheet.getColumn(6).width = productLength > 10 ? 10 : 8;
    worksheet.getColumn(7).width = productLength > 10 ? 12 : 10;
    worksheet.getColumn(8).width = productLength > 10 ? 10 : 8;
    worksheet.getColumn(9).width = 6;
    worksheet.getColumn(10).width = productLength > 10 ? 12 : 9;
    worksheet.getColumn(11).width = productLength > 10 ? 10 : 8;
    worksheet.getColumn(12).width = productLength > 10 ? 16 : 14;
    worksheet.getColumn(13).width = productLength > 10 ? 13.8 : 11.8;

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
    worksheet.getRow(13).height = 6;
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

    // worksheet.getRow(38).height = 15;
    // worksheet.getRow(39).height = 15;
    // worksheet.getRow(40).height = 15;
    // worksheet.getRow(41).height = 15;
    // worksheet.getRow(42).height = 15;
    // worksheet.getRow(43).height = 15;

    worksheet.getRow(48).height = 18;
    worksheet.getRow(49).height = 18;
    worksheet.getRow(50).height = 18;
    worksheet.getRow(51).height = 18;
    worksheet.getRow(52).height = 18;
    worksheet.getRow(53).height = 18;
    worksheet.getRow(54).height = 18;

    worksheet.getRow(62).height = 11;
    worksheet.getRow(63).height = 11;

    worksheet.getRow(64).height = 10;

    worksheet.getRow(65).height = 25;
    worksheet.getRow(66).height = 25;
    worksheet.getRow(67).height = 12;

    worksheet.getRow(2).font = { size: 24, bold: true, name: 'Angsana New' };
    worksheet.getRow(3).font = { size: 20, bold: true, name: 'Angsana New' };
    worksheet.getRow(4).font = { size: 15, bold: true, name: 'Angsana New' };
    worksheet.getRow(5).font = { size: 14, bold: true, name: 'Angsana New' };
    worksheet.getRow(6).font = { size: 13, bold: true, name: 'Angsana New' };

    worksheet.mergeCells('K4:M5');
    const cell = worksheet.getCell('K4');
    cell.value = "ใบส่งสินค้า";
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { size: 30, bold: true, name: 'Angsana New' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFE0B2' }
    };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    };

    worksheet.mergeCells('K6:M6');
    const branch = worksheet.getCell('K6');
    branch.value = `สาขา : ${data.branch_name === 'สมุทรสาคร ( โคกขาม )' ? 'โคกขาม' : data.branch_name === 'ชลบุรี ( บ้านเก่า )' ? 'ชลบุรี' : data.branch_name === 'ปทุมธานี ( นพวงศ์ )' ? 'เเยกนพวงศ์' : data.branch_name}`;
    branch.font = { size: 18, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    branch.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A8:B10');
    const customer_name = worksheet.getCell('A8');
    customer_name.value = '   ชื่อผู้ติดต่อ :';
    customer_name.font = { size: 14, bold: true, name: 'Angsana New' };
    customer_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C8:F10');
    const customer_nameValue = worksheet.getCell('C8');
    customer_nameValue.value = `${data.customer_name ? data.customer_name : "-"}`;
    customer_nameValue.font = { size: 14, name: 'Angsana New' };
    customer_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A11:B13');
    const company_name = worksheet.getCell('A11');
    company_name.value = '   ชื่อบริษัท :';
    company_name.font = { size: 14, bold: true, name: 'Angsana New' };
    company_name.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C11:J13');
    const company_nameValue = worksheet.getCell('C11');
    company_nameValue.value = `${data.company_name ? data.company_name : "-"}`;
    company_nameValue.font = { size: 14, name: 'Angsana New' };
    company_nameValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A14:B16');
    const address = worksheet.getCell('A14');
    address.value = '   ที่อยู่ :';
    address.font = { size: 14, bold: true, name: 'Angsana New' };
    address.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C14:J16');
    const addressValue = worksheet.getCell('C14');
    addressValue.value = `${data.address ? data.address : "-"}`;
    addressValue.font = { size: 14, name: 'Angsana New' };
    addressValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A17:B19');
    const space = worksheet.getCell('A17');

    worksheet.mergeCells('C17:J19');
    const placeValue = worksheet.getCell('C17');
    placeValue.value = `หน้างาน - ${data.place_name ? data.place_name : ""}`;
    placeValue.font = { size: 14, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    placeValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A20:B22');
    const phone = worksheet.getCell('A20');
    phone.value = '   โทร :';
    phone.font = { size: 14, bold: true, name: 'Angsana New' };
    phone.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C20:I22');
    const phoneValue = worksheet.getCell('C20:E22');
    phoneValue.value = `${data.customer_tel ? data.customer_tel : "-"}`;
    phoneValue.font = { size: 14, name: 'Angsana New' };
    phoneValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A23:C25');
    const taxId = worksheet.getCell('A23');
    taxId.value = '   เลขประจำตัวผู้เสียภาษีอากร:';
    taxId.font = { size: 14, bold: true, name: 'Angsana New' };
    taxId.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('D23:G25');
    const taxIdValue = worksheet.getCell('D23:G25');
    taxIdValue.value = ` ${data.tax_id ? data.tax_id : "-"}`;
    taxIdValue.font = { size: 14, name: 'Angsana New' };
    taxIdValue.alignment = { vertical: 'middle', horizontal: 'left' };


    worksheet.mergeCells('K8:L10');
    const taxNumber = worksheet.getCell('K8');
    taxNumber.value = '  เลขที่ใบส่งสินค้า :';
    taxNumber.font = { size: 14, bold: true, name: 'Angsana New' };
    taxNumber.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M8:M10');
    const taxNumberValue = worksheet.getCell('M8');
    taxNumberValue.value = `${'P' + data.export_number}`;
    taxNumberValue.font = { size: 14, name: 'Angsana New' };
    taxNumberValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K11:L13');
    const dateShipping = worksheet.getCell('K11');
    dateShipping.value = '  วันที่ส่งสินค้า :';
    dateShipping.font = { size: 14, bold: true, name: 'Angsana New' };
    dateShipping.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M11:M13');
    const dateShippingValue = worksheet.getCell('M11');
    dateShippingValue.value = `${data.actual_out
      ? new Date(data.actual_out).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      : ''}`;
    dateShippingValue.font = { size: 14, name: 'Angsana New' };
    dateShippingValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K14:L16');
    const date = worksheet.getCell('K14');
    date.value = '  วันที่เริ่มเช่าสินค้า :';
    date.font = { size: 14, bold: true, name: 'Angsana New' };
    date.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M14:M16');
    const dateValue = worksheet.getCell('M14');
    let actualOutDate = data.actual_out ? new Date(data.actual_out) : null;
    if (actualOutDate) {
      actualOutDate.setDate(actualOutDate.getDate() + 1);
      dateValue.value = actualOutDate.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      });
    } else {
      dateValue.value = '';
    }
    dateValue.font = { size: 14, name: 'Angsana New' };
    dateValue.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('K17:L19');
    const expDate = worksheet.getCell('K17');
    expDate.value = '  วันที่ครบกำหนดเช่าสินค้า :';
    expDate.font = { size: 14, bold: true, name: 'Angsana New' };
    expDate.alignment = { vertical: 'middle', horizontal: 'left' };
    expDate.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF59D' } };
    worksheet.mergeCells('M17:M19');

    const expDateValue = worksheet.getCell('M17');
    let expiryDateValue = data.actual_out ? new Date(data.actual_out) : null;

    expiryDateValue.setDate(expiryDateValue.getDate() + data.date);
    expDateValue.value = expiryDateValue.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });

    expDateValue.font = { size: 14, name: 'Angsana New', bold: true };
    expDateValue.alignment = { vertical: 'middle', horizontal: 'left' };
    expDateValue.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF59D' } };

    worksheet.mergeCells('K20:L22');
    const condition = worksheet.getCell('K20');
    condition.value = '  ต่อสัญญาเช่าครั้งที่ :';
    condition.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    condition.alignment = { vertical: 'middle', horizontal: 'left' };
    condition.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };

    worksheet.mergeCells('M20:M22');
    const conditionValue = worksheet.getCell('M20');
    conditionValue.value = '-';
    conditionValue.font = { size: 14, name: 'Angsana New', bold: true, color: { argb: 'FFFF0000' } };
    conditionValue.alignment = { vertical: 'middle', horizontal: 'left' };
    conditionValue.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };

    worksheet.mergeCells('K23:L25');
    const exportPast = worksheet.getCell('K23');
    exportPast.value = '  อ้างอิงเลขที่ Po :';
    exportPast.font = { size: 14, bold: true, name: 'Angsana New' };
    exportPast.alignment = { vertical: 'middle', horizontal: 'left' };
    exportPast.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };

    worksheet.mergeCells('M23:M25');
    const exportPastValue = worksheet.getCell('M23');
    exportPastValue.value = data.reserve_number;
    exportPastValue.font = { size: 14, name: 'Angsana New', bold: true };
    exportPastValue.alignment = { vertical: 'middle', horizontal: 'left' };
    exportPastValue.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };

    const indexNumber = worksheet.getCell('A27');
    indexNumber.value = ' ลำดับที่';
    indexNumber.font = { size: 14, bold: true, name: 'Angsana New' };
    indexNumber.alignment = { vertical: 'middle', horizontal: 'left' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      const productCell = worksheet.getCell(`A${rowNumber}`);
      productCell.value = `${index + 1}`;
      productCell.font = { size: 14, name: 'Angsana New' };
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
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
      const productCell = worksheet.getCell(`D${rowNumber}`);
      if (assemble === 'with_assembled' && product.name && product.assemble_name) {
        productCell.value = `${product.size} (${product.description})`;
      } else if (product.name) {
        productCell.value = `${product.size ? product.size : "-"}`;
      } else if (product.assemble_name) {
        productCell.value = `${product.description ? product.description : "-"}`;
      }
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    // products.forEach((product, index) => {
    //   const rowNumber = 28 + index;
    //   worksheet.mergeCells(`F${rowNumber}`);
    //   const productCell = worksheet.getCell(`F${rowNumber}`);
    //   productCell.value = `${product.unit ? product.unit : "-"}`;
    //   productCell.font = { size: 13, name: 'Angsana New' };
    //   productCell.alignment = { vertical: 'middle', horizontal: 'left' };
    // });

    worksheet.mergeCells('H27:I27');
    const amout = worksheet.getCell('H27');
    amout.value = 'จำนวน';
    amout.font = { size: 14, bold: true, name: 'Angsana New' };
    amout.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((product, index) => {
      const rowNumber = 28 + index;
      worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
      const productCell = worksheet.getCell(`H${rowNumber}`);
      if (assemble === 'with_assembled' && product.name && product.assemble_name) {
        productCell.value = `${product.quantity} ${product.unit}`;
      } else if (product.name) {
        productCell.value = `${product.quantity}  ${product.unit ? product.unit : ""}`;
      } else if (product.assemble_name) {
        productCell.value = `${product.quantity} ${product.unit_asm}`;
      }
      productCell.font = { size: 14, name: 'Angsana New' };
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
      productCell.value = "-";
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
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
      productCell.value = "-";
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
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
      productCell.value = "-";
      productCell.font = { size: 14, name: 'Angsana New' };
      productCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('A62:J63');
    const priceThb = worksheet.getCell('A62');
    priceThb.value = "-";
    priceThb.font = { size: 14, bold: true, name: 'Angsana New' };
    priceThb.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ddddde' }
    };
    priceThb.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K62:L63');
    const totalFinalPrice = worksheet.getCell('K62');
    totalFinalPrice.value = ' ยอดรวมที่ต้องชำระ';
    totalFinalPrice.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPrice.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('M62:M63');
    const totalFinalPriceValue = worksheet.getCell('M62');
    totalFinalPriceValue.value = "-";
    totalFinalPriceValue.font = { size: 14, bold: true, name: 'Angsana New' };
    totalFinalPriceValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const guaranteePrice = worksheet.getCell('K61');
    guaranteePrice.value = ' ค่าประกันสินค้า';
    guaranteePrice.font = { size: 14, name: 'Angsana New', bold: true };
    guaranteePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const guaranteePriceValue = worksheet.getCell('M61');
    guaranteePriceValue.value = "-";
    guaranteePriceValue.font = { size: 14, name: 'Angsana New', bold: true };
    guaranteePriceValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const vat = worksheet.getCell('K60');
    vat.value = ' ภาษีมูลค่าเพิ่ม / Vat 7%';
    vat.font = { size: 14, name: 'Angsana New' };
    vat.alignment = { vertical: 'middle', horizontal: 'left' };

    const vatValue = worksheet.getCell('M60');
    vatValue.value = "-";
    vatValue.font = { size: 14, name: 'Angsana New' };
    vatValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const totalDiscount = worksheet.getCell('K59');
    totalDiscount.value = ' รวมหลังหักส่วนลด';
    totalDiscount.font = { size: 14, name: 'Angsana New' };
    totalDiscount.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalDiscountValue = worksheet.getCell('M59');
    totalDiscountValue.value = "-";
    totalDiscountValue.font = { size: 14, name: 'Angsana New' };
    totalDiscountValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const discount = worksheet.getCell('K58');
    discount.value = ' ส่วนลด';
    discount.font = { size: 14, name: 'Angsana New' };
    discount.alignment = { vertical: 'middle', horizontal: 'left' };

    const discountValue = worksheet.getCell('M58');
    discountValue.value = "-";
    discountValue.font = { size: 14, name: 'Angsana New' };
    discountValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const movePrice = worksheet.getCell('K57');
    movePrice.value = ' ค่าบริการเคลื่อนย้ายสินค้า';
    movePrice.font = { size: 14, name: 'Angsana New' };
    movePrice.alignment = { vertical: 'middle', horizontal: 'left' };

    const movePriceValue = worksheet.getCell('M57');
    movePriceValue.value = "-";
    movePriceValue.font = { size: 14, name: 'Angsana New' };
    movePriceValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const shippingCost = worksheet.getCell('K56');
    shippingCost.value = ' ค่าขนส่งสินค้าไป - กลับ';
    shippingCost.font = { size: 14, name: 'Angsana New' };
    shippingCost.alignment = { vertical: 'middle', horizontal: 'left' };

    const shippingCostValue = worksheet.getCell('M56');
    shippingCostValue.value = "-";
    shippingCostValue.font = { size: 14, name: 'Angsana New' };
    shippingCostValue.alignment = { vertical: 'middle', horizontal: 'center' };

    const totalPrice = products.reduce((sum, product) => {
      return sum + (product.quantity * product.price * data.date);
    }, 0);
    const totalPriceOut = worksheet.getCell('K55');
    totalPriceOut.value = ' รวมเงิน';
    totalPriceOut.font = { size: 14, name: 'Angsana New' };
    totalPriceOut.alignment = { vertical: 'middle', horizontal: 'left' };

    const totalPriceOutValue = worksheet.getCell('M55');
    totalPriceOutValue.value = "-";
    totalPriceOutValue.font = { size: 14, name: 'Angsana New' };
    totalPriceOutValue.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A59:B59');
    const note = worksheet.getCell('A59');
    note.value = ' หมายเหตุ :';
    note.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    note.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('C59:J59');
    worksheet.mergeCells('C60:J60');
    worksheet.mergeCells('C61:J61');

    worksheet.mergeCells('A48:J48');
    const noteif = worksheet.getCell('A48');
    noteif.value = ' เงื่อนไขการเช่าสินค้า/โปรดอ่านเงื่อนไขก่อนทำการเช่า';
    noteif.font = { size: 11, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' }, underline: true };
    noteif.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A49:J49');
    const note1 = worksheet.getCell('A49');
    note1.value = ' 1. ผู้เช่าต้องชำระค่าเช่า เงินประกัน และค่าใช้จ่ายอื่น ๆ ตามที่ตกลงในใบเสนอราคา ก่อนวันรับสินค้า';
    note1.font = { size: 10, bold: true, name: 'Angsana New' };
    note1.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A50:J50');
    const note2 = worksheet.getCell('A50');
    note2.value = ' 2. ทางร้านจะทำการจัดส่งสินค้าให้หลังจากมีการชำระเงินครบตามจำนวนที่ตกลงกันไว้';
    note2.font = { size: 10, bold: true, name: 'Angsana New' };
    note2.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A51:J51');
    const note3 = worksheet.getCell('A51');
    note3.value = ' 3. การรับสินค้าผู้เช่าจะต้องเป็นผู้รับภาระในค่าขนส่ง โดยคิดจากระยะทางส่งตามจริงและไม่สามารถเรียกเก็บค่าใช้จ่ายใดๆจากผู้ให้เช่าทั้งสิ้น';
    note3.font = { size: 10, bold: true, name: 'Angsana New' };
    note3.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A52:J52');
    const note4 = worksheet.getCell('A52');
    note4.value = ' 4. หากสินค้าเช่าเกิดความเสียหายหรือสูญหายผู้ให้เช่าจะทำการปรับเงินตามราคาสินค้าที่แจ้งไว้จากู้เช่า';
    note4.font = { size: 10, bold: true, name: 'Angsana New' };
    note4.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A53:J53');
    const note5 = worksheet.getCell('A53');
    note5.value = ' 5. ผู้เช่าสามารถเช่าขั้นต่ำ 3 วันเท่านั้น - วันส่งสินค้าทางร้านจะไม่คิดค่าเช่า และจะเริ่มคิดวันถัดไป วันรับคืนสินค้าคิดค่าเช่าตามปกติ';
    note5.font = { size: 10, bold: true, name: 'Angsana New' };
    note5.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A54:J54');
    const note6 = worksheet.getCell('A54');
    note6.value = ' 6. หากผู้เช่าต้องการต่อสัญญา ผู้เช่าต้องแจ้งผู้ให้ทราบล่วงหน้าอย่างน้อย 1-2 วัน ก่อนหมดสัญญาเช่า หากไม่แจ้งล่วงหน้า';
    note6.font = { size: 10, bold: true, name: 'Angsana New' };
    note6.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A55:J55');
    const note8 = worksheet.getCell('A55');
    note8.value = '      ผู้ให้เช่าจะทำการเก็บสินค้ากลับในวันที่ครบกำหนดทันที หากผู้เช่ายังไม่รื้อของเช่า ผู้ให้เช่าจะทำการรื้อถอนด้วยตนเอง';
    note8.font = { size: 10, bold: true, name: 'Angsana New' };
    note8.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A56:J56');
    const note9 = worksheet.getCell('A56');
    note9.value = '      และจะไม่รับผิดชอบต่อความเสียหายใดๆ เพราะถือว่าผู้เช่าผิดสัญญาเช่าต่อผู้ให้เช่า และทำการยึดมัดจำทั้งหมด';
    note9.font = { size: 10, bold: true, name: 'Angsana New' };
    note9.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A57:J57');
    const note10 = worksheet.getCell('A57');
    note10.value = ' 7. กรณีต่อสัญญาเช่าสินค้า ผู้เช่าต้องชำระค่าต่อสัญญาเช่าภายใน 1-2 วันหลังต่อสัญญาเช่า และไม่สามารถนำมาหักเงินประกัน';
    note10.font = { size: 10, bold: true, name: 'Angsana New' };
    note10.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A58:J58');
    const note11 = worksheet.getCell('A58');
    note11.value = ' 8. ผู้เช่าต้องเป็นผู้ดำเนินการเคลื่อนย้ายสินค้าเองทุกครั้ง หากไม่เคลื่อนย้ายสินค้าเอง ผู้เช่าจะต้องจ่ายค่าบริการเคลื่อนย้ายสินค้าให้แก่ผู้ให้เช่า';
    note11.font = { size: 10, bold: true, name: 'Angsana New', underline: true };
    note11.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A65:B65');
    const nameCustomer = worksheet.getCell('A65');
    nameCustomer.value = 'ลงชื่อ :';
    nameCustomer.font = { size: 14, bold: true, name: 'Angsana New' };
    nameCustomer.alignment = { vertical: 'bottom', horizontal: 'right' };

    worksheet.mergeCells('A66:B66');
    const dateShipping1 = worksheet.getCell('A66');
    dateShipping1.value = 'ลงวันที่ :';
    dateShipping1.font = { size: 14, bold: true, name: 'Angsana New' };
    dateShipping1.alignment = { vertical: 'bottom', horizontal: 'right' };

    const nameCustomer1 = worksheet.getCell('G65');
    nameCustomer1.value = 'ผู้ส่งของ';
    nameCustomer1.font = { size: 14, bold: true, name: 'Angsana New' };
    nameCustomer1.alignment = { vertical: 'bottom', horizontal: 'left' };

    worksheet.mergeCells('H65:I65');
    const namePle = worksheet.getCell('H65');
    namePle.value = 'ลงชื่อ :';
    namePle.font = { size: 14, bold: true, name: 'Angsana New' };
    namePle.alignment = { vertical: 'bottom', horizontal: 'right' };

    const namePle2 = worksheet.getCell('M65');
    namePle2.value = 'ผู้รับของ';
    namePle2.font = { size: 14, bold: true, name: 'Angsana New' };
    namePle2.alignment = { vertical: 'bottom', horizontal: 'left' };

    const namePle1 = worksheet.getCell('J65');
    namePle1.value = '';
    namePle1.font = { size: 14, bold: true, name: 'Angsana New' };
    namePle1.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('H66:M66');
    const namePleDate = worksheet.getCell('H66');
    namePleDate.value = '**ได้รับสินค้าตามรายการข้างต้นไว้ถูกต้องเเล้ว**';
    namePleDate.font = { size: 14, bold: true, name: 'Angsana New', color: { argb: 'FFFF0000' } };
    namePleDate.alignment = { vertical: 'bottom', horizontal: 'center' };

    worksheet.mergeCells('C65:F65');
    worksheet.mergeCells('J65:L65');
    worksheet.mergeCells('C66:F66');

    const nameCustomerDate1 = worksheet.getCell('C66');
    nameCustomerDate1.value = `${data.actual_out
      ? new Date(data.actual_out).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
      : ''}`;
    nameCustomerDate1.font = { size: 14, bold: true, name: 'Angsana New' };
    nameCustomerDate1.alignment = { vertical: 'bottom', horizontal: 'center' };

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
      bottom: { style: 'thin' }
    };
    conditionValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    dateShipping.border = {
      left: { style: 'medium' },
      top: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    dateShippingValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'thin' }
    };

    exportPast.border = {
      left: { style: 'medium' },
      top: { style: 'thin' },
      bottom: { style: 'medium' }
    };
    exportPastValue.border = {
      right: { style: 'medium' },
      bottom: { style: 'medium' }
    };
    branch.border = {
      left: { style: 'medium' },
      top: { style: 'medium' },
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

    for (let row = 28; row <= 58; row++) {
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

    for (let row = 28; row <= 58; row++) {
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
      const cell = worksheet.getCell(63, col);
      const cell_right = worksheet.getCell(63, 13);
      const cell_left = worksheet.getCell(63, 1);
      const cell_h = worksheet.getCell(63, 8);
      const cell_i = worksheet.getCell(63, 9);
      const cell_k = worksheet.getCell(63, 11);

      const cell_guarantee = worksheet.getCell(61, 11);
      const cell_guarantee2 = worksheet.getCell(61, 12);
      const cell_guaranteeValue = worksheet.getCell(61, 13);

      const vat = worksheet.getCell(60, 11);
      const vat2 = worksheet.getCell(60, 12);
      const vatValue = worksheet.getCell(60, 13);

      const totalDiscount = worksheet.getCell(59, 11);
      const totalDiscount2 = worksheet.getCell(59, 12);
      const totalDiscountValue = worksheet.getCell(59, 13);

      const discount = worksheet.getCell(58, 11);
      const discount2 = worksheet.getCell(58, 12);
      const discountValue = worksheet.getCell(58, 13);

      const movePrice = worksheet.getCell(57, 11);
      const movePrice2 = worksheet.getCell(57, 12);
      const movePriceValue = worksheet.getCell(57, 13);

      const shippingCost = worksheet.getCell(56, 11);
      const shippingCost2 = worksheet.getCell(56, 12);
      const shippingCostValue = worksheet.getCell(56, 13);

      const totalPriceOut = worksheet.getCell(55, 11);
      const totalPriceOut2 = worksheet.getCell(55, 12);
      const totalPriceOutValue = worksheet.getCell(55, 13);

      const note = worksheet.getCell(59, col);
      const note1 = worksheet.getCell(59, 1);
      const note2 = worksheet.getCell(60, 1);
      const note3 = worksheet.getCell(61, 1);

      const spaceLast = worksheet.getCell(64, col);
      const spaceLast1 = worksheet.getCell(64, 1);
      const spaceLast2 = worksheet.getCell(64, 13);

      const spaceName = worksheet.getCell(67, col);
      const spaceName1 = worksheet.getCell(67, 1);
      const spaceName11 = worksheet.getCell(67, 7);
      const spaceName2 = worksheet.getCell(67, 13);
      const spaceName3 = worksheet.getCell(66, 1);
      const spaceName4 = worksheet.getCell(66, 13);
      const spaceName5 = worksheet.getCell(65, 1);
      const spaceName6 = worksheet.getCell(65, 13);

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
      const cell = worksheet.getCell(62, col);
      cell.border = {
        top: { style: 'medium' },
        right: { style: 'thin' },
        bottom: { style: 'medium' },
        left: { style: 'medium' }
      };
    }

    for (let col = 1; col < 11; col++) {
      const cell = worksheet.getCell(48, col);
      const cell_1 = worksheet.getCell(48, 1);
      const cell_8 = worksheet.getCell(48, 8);
      const cell_9 = worksheet.getCell(48, 10);

      const cell_38 = worksheet.getCell(42, 2);
      const cell_39 = worksheet.getCell(43, 2);
      const cell_40 = worksheet.getCell(44, 2);

      const cell_44 = worksheet.getCell(48, 2);
      const cell_45 = worksheet.getCell(49, 2);
      const cell_46 = worksheet.getCell(50, 2);
      const cell_47 = worksheet.getCell(51, 2);
      const cell_48 = worksheet.getCell(52, 2);
      const cell_49 = worksheet.getCell(53, 2);
      const cell_50 = worksheet.getCell(54, 2);
      const cell_51 = worksheet.getCell(55, 2);
      const cell_52 = worksheet.getCell(56, 2);
      const cell_53 = worksheet.getCell(57, 2);
      const cell_54 = worksheet.getCell(58, 2);

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
      const cell = worksheet.getCell(65, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let col = 3; col < 7; col++) {
      const cell = worksheet.getCell(65, col);
      const cell_62 = worksheet.getCell(66, col);
      cell.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
      cell_62.border = {
        bottom: { style: 'dotted', color: { argb: 'FF000000' } }
      };
    }

    for (let row = 65; row < 67; row++) {
      const cell = worksheet.getCell(`G${row}`);
      const cell_62 = worksheet.getCell(`A${66}`);
      cell.border = {
        right: { style: 'thin' }
      };
      cell_62.border = {
        left: { style: 'medium' }
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
            ext: { width: productLength > 10 ? 195 : 175, height: 156 }
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
            a.download = `ใบส่งของ-เลขที่-${data.export_number}.xlsx`;
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
    <div>
      <button
        onClick={() => exportToExcel()}
        className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-700 transition duration-200"
      >
        <span className="fa-solid fa-print"></span>
        <span> พิมพ์ใบส่งของ</span>
      </button>
    </div >
  );
}
