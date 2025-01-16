import moment from 'moment-timezone';
import 'moment/locale/th';  

export const Get_DateTime = () => {
  moment.locale('th');  // ใช้งานไม่ได้ เลยต้องใช้ Array ข้างล่างแปลงแทน
  const currentDateTime = moment()
    .tz('Asia/Bangkok')  
    .format('DD MMMM YYYY');  


  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];


  let formattedDate = currentDateTime;
  const month = moment().format('MMMM'); 
  const monthIndex = moment().month();  
  formattedDate = formattedDate.replace(month, monthNames[monthIndex]); 


  const yearInBuddhistEra = moment().year() + 543;
  const finalDateTime = formattedDate.replace(moment().format('YYYY'), yearInBuddhistEra)
    + ' ' + moment().format('HH:mm:ss');
  
  return finalDateTime;
};


export const formatDate = () => {
  const now = new Date();

  // ชื่อเดือนภาษาไทย
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = now.getDate(); // วันที่ (1-31)
  const month = thaiMonths[now.getMonth()]; // ชื่อเดือนภาษาไทย
  const year = now.getFullYear() + 543; // ปี พ.ศ.

  return `${day} ${month} ${year}`;
};
