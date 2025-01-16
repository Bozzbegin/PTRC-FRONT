import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import thaiBahtText from 'thai-baht-text';

export default function Quotation() {

  const [data, setData] = useState([])
  const [products, setProducts] = useState([])
  const [note, setNote] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [outboundData, setOutboundData] = useState({}); // New state for outbound data
  const [confirmitem, setConfirmItem] = useState([]); // New state for confirmed items
  const [lesseeName, setLesseeName] = useState('');
  const [lessorName, setLessorName] = useState('');
  const [lesseeNameOne, setLesseeNameOne] = useState('');
  const [lessorNameTwo, setLessorNameTwo] = useState('');

  useEffect(() => {
    const storedOutboundData = JSON.parse(localStorage.getItem("outboundData"));
    console.log(storedOutboundData);
    
    if (storedOutboundData) {
      console.log("SS",storedOutboundData);
      
      setOutboundData(storedOutboundData);
      setData(storedOutboundData);
      setProducts(storedOutboundData.reserve);
      
      setExpiryDate(storedOutboundData.expiryDate);
    
      
      if (storedOutboundData.sell_date) {
        setOutboundData(prevState => ({
          ...prevState,
          sell_date: storedOutboundData.sell_date
        }));
      }
    }
  }, []);

  const num = [1, 2, 3, 4, 5, 6];

  const formatThaiBahtText = (value) => {
    if (isNaN(Number(value)) || value === null || value === undefined) {
      return 'Invalid input';
    }
    return thaiBahtText(Number(value));
  };

  // const calculateTotalPrice = () => {
  //   return products.reduce((total, product) => {
  //     const price = product.price || product.price3D || 0;
  //     return total + (price * (product.amount || 0) * (outboundData.day_length || 1));
  //   }, 0).toFixed(2);
  // };

  // const calculateFinalPrice = () => {
  //   const totalPrice = parseFloat(calculateTotalPrice());
  //   const shippingCost = parseFloat(data.shipping_cost || 0);
  //   const movePrice = parseFloat(data.move_price || 0);
  //   const discount = parseFloat(data.discount || 0);
  //   return (totalPrice + shippingCost + movePrice - discount).toFixed(2);
  // };

  // const calculateVAT = () => {
  //   const finalPrice = parseFloat(calculateFinalPrice());
  //   return ((finalPrice / 100) * 7).toFixed(2);
  // };

  // const calculateFinalPriceWithVat = () => {
  //   const totalPriceDiscount = parseFloat(calculateFinalPrice());
  //   const vat = data.vat === 'vat' ? parseFloat(calculateVAT()) : 0;
  //   const guaranteePrice = parseFloat(data.guarantee_price || 0);
  //   return (totalPriceDiscount + vat + guaranteePrice).toFixed(2);
  // };

  const formatNumber = (value) => {
    if (isNaN(Number(value)) || value === null || value === undefined) {
      return 'Invalid input';
    }
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            <span className="font-bold font-sarabun">ชื่อผู้ติดต่อ :</span><span className="ml-2 font-sarabun">{" " + outboundData.name}</span>
          </p>
          <p>
            <span className="font-bold font-sarabun">ชื่อบริษัท :</span><span className="ml-[17.5px] font-sarabun">{outboundData.comName}</span>
          </p>
          <p>
            <span className="font-bold font-sarabun">ที่อยู่ :</span><span className="ml-10 font-sarabun">{outboundData.address}</span>
          </p>
          <p>
            <span className="font-bold "></span>
            <span className="ml-[69px] text-red-500 underline font-sarabun">{'หน้างาน - '}{outboundData.workside}</span>
          </p>

          <p>
            <span className="font-bold font-sarabun">โทร :</span><span className="ml-11 font-sarabun">{outboundData.phone}</span>
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
            {outboundData.recipeNumber}
          </p>
          <p className="col-span-1 border-b-2 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            วันที่เสนอราคา :
          </p>
          <p className="border-b-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            {outboundData.sell_date}
          </p>
          <p className="col-span-1 border-b-2 border-r-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            วันที่หมดอายุ :
          </p>
          <p className="border-b-2 border-black text-center flex justify-center items-center h-full font-sarabun">
            {expiryDate}
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
          {/* {products.map((product, index) => (
            <span key={index} className="font-sarabun">{index + 1}</span>
          ))} */}
        </div>
        <div className=" h-full w-full col-span-4 row-span-11 border-r-2 border-black flex flex-col ">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">รายการ</span>
          {/* {products.map((product, index) => (
            <span key={index} className="ml-2 font-sarabun">{product.name}  <span className='ml-10 font-sarabun'>{product.size}</span></span>
          ))} */}
        </div>
        <div className=" h-full w-full  row-span-11 border-r-2 border-black flex flex-col text-center">
          <span className="  border-b-2 border-t-2 border-black font-bold font-sarabun">จำนวน</span>
          {/* {products.map((product, index) => (
            <span key={index} className="font-sarabun">{product.amount} {product.unit}</span>
          ))} */}
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col text-center ">
          <span className="  border-b-2 border-t-2 border-black font-bold font-sarabun">ราคาเช่า/วัน</span>
          {/* {products.map((product, index) => (
            <span key={index} className='mr-2 text-end print:text-[10px] font-sarabun'>{(formatNumber(product.price) || formatNumber(product.price3D))}</span>
          ))} */}
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col text-center">
          <span className="  border-b-2 border-t-2 border-black  text-center font-bold font-sarabun">จำนวนวัน</span>
          <span className='print:text-[10px] font-sarabun'>{outboundData.day_length}</span>
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col text-center">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">ค่าปรับสินค้า/ชิ้น</span>
          {/* {products.map((product, index) => (
            <span key={index} className='mr-2 text-end print:text-[10px] font-sarabun'>{"0.00"}</span>
          ))} */}
        </div>
        <div className=" h-full w-full row-span-11 border-r-2 border-black flex flex-col ">
          <span className="  border-b-2 border-t-2 border-black text-center font-bold font-sarabun">จำนวนเงินรวม</span>
          {/* {products.map((product, index) => (
            <span key={index} className='mr-2 text-end print:text-[10px] font-sarabun'>{formatNumber(product.total * outboundData.day_length)}</span>
          ))} */}
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
        {/* <span className="border-t-2 border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{calculateTotalPrice()}</span> */}
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าขนส่งสินค้าไป-กลับ</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.shipping_cost ? data.shipping_cost : 0)}</span>
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าบริการเคลื่อนย้ายสินค้า</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.move_price ? data.move_price : 0)}</span>
        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ส่วนลด</span>
        <span className="border-b-2 border-r-2 border-black flex items-center justify-end print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.discount ? data.discount : 0)}</span>

        <div className="col-span-7 row-span-4 border-r-2 border-l-2 border-b-2 border-black print:text-[10px]">
          <u className="font-sarabun ml-1 text-red-500">หมายเหตุ :</u>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="กรอกหมายเหตุ"
            className="w-2/3 border-none font-sarabun resize-none ml-2 mt-3 text-red-500" // Added ml-2
            rows="3"
          />
        </div>

        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">รวมหลังหักส่วนลด</span>
        {/* <span className="col-span-1 row-span-1 border-b-2 border-r-2 border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{calculateFinalPrice()}</span> */}

        <span className="col-span-2 row-span-1 border-r-2 border-b-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ภาษีมูลค่าเพิ่ม / vat7%</span>
        {/* <span className="col-span-1 row-span-1 border-b-2 border-r-2 border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{calculateVAT()}</span> */}

        <span className="col-span-2 row-span-1 border-b-2 border-r-2 border-black flex items-center pl-1 print:text-[10px] font-sarabun">ค่าประกันสินค้า</span>
        <span className="col-span-1 row-span-1 border-b-2 border-r-2  border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{formatNumber(data.guarantee_price ? data.guarantee_price : 0)}</span>

        <span className="col-span-2 row-span-1 border-b-2 border-r-2 border-black flex items-center p-1 print:text-[10px] font-sarabun">ยอดรวมที่ต้องชำระ</span>
        {/* <span className="col-span-1 row-span-1 border-r-2 border-b-2 border-black flex justify-end items-center print:text-[10px] pr-0.5 font-sarabun">{calculateFinalPriceWithVat()}</span> */}

        <div className="col-span-11 row-span-2 flex justify-center items-center font-bold border-r-2 border-b-2 border-l-2 border-black print:text-[12px] font-sarabun">
          {/* {formatThaiBahtText(calculateFinalPriceWithVat())} */}
        </div>

      </div>

      <div className="grid grid-cols-10 h-[70px] border-b-2 border-r-2 border-l-2 border-black text-[9px] font-sarabun">

        <div className=" col-span-5 border-r-2 border-black flex flex-col p-4 justify-around h-[60px] items-center h-[70px]">
          <div>
            <p className="font-sarabun w-[300px] ml-6">ลงชื่อ  <input type="text" value={lesseeName} onChange={(e) => setLesseeName(e.target.value)} className="w-4/5 bg-blue-300" />  ผู้เช่า</p>
            <p className="font-sarabun ml-12 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
            <p className="font-sarabun w-[300px] ml-12"><input type="text" value={lesseeNameOne} onChange={(e) => setLesseeNameOne(e.target.value)} className="w-4/5 bg-red-300" /></p>
            <p className="font-sarabun ml-12 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          </div>
        </div>

        <div className=" col-span-5 border-black flex flex-col p-4 justify-around items-center h-[70px]">
          <div>
            <p className="font-sarabun w-[300px] ml-3">ลงชื่อ  <input type="text" value={lessorName} onChange={(e) => setLessorName(e.target.value)} className="w-4/5 bg-blue-300" />  ผู้ให้เช่า</p>
            <p className="font-sarabun ml-9 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
            <p className="font-sarabun w-[300px] ml-9"><input type="text" value={lessorNameTwo} onChange={(e) => setLessorNameTwo(e.target.value)} className="w-4/5 bg-red-300" /></p>
            <p className="font-sarabun ml-9 mt-[-12px]">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          </div>
        </div>

      </div>

      <div className="flex justify-center mt-4">
        <button className='bg-blue-500 w-1/4 p-2 print:hidden text-[16px] rounded-md shadow-md hover:bg-blue-600 transition duration-200 text-white' onClick={window.print}>
          print
        </button>
      </div>

    </div>
  );
}
