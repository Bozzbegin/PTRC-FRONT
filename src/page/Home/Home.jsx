import React from 'react';

export function Home() {
    const items = [
        { link: '/inbound', imageSrc: '/img/In.png', title: 'นำเข้าสินค้า', width:165 , height:116 },
        { link: '/outbound', imageSrc: '/img/out.png', title: 'ส่งออกสินค้า', width: 143, height: 105 },
        { link: '/status', imageSrc: '/img/location.png', title: 'สถานะสินค้า', width: 95, height: 126 },
        { link: '/returnitem', imageSrc: '/img/Return.png', title: 'คืนสินค้า', width:173, height: 129 },
        { link: '/stock', imageSrc: '/img/ItemInStor.png', title: 'สินค้าคงคลัง', width:185, height: 139 },
        { link: '/inventory', imageSrc: '/img/ItemAll.png', title: 'รายการทั้งหมด', width: 144, height: 126 },
    ];

    return (
        <div className='w-full h-[90%]'>
            <div className='flex justify-between flex-wrap gap-4'>
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => window.location.href = item.link}
                        className="w-[200px] h-[227px] flex flex-col justify-between pt-8 items-center rounded-2xl bg-slate-300 shadow-lg hover:shadow-xl hover:bg-slate-400 transition-all cursor-pointer" // เพิ่มเงา, hover และ cursor-pointer
                    >
                        <img 
                            src={item.imageSrc} 
                            alt={item.title} 
                            style={{ width: `${item.width}px`, height: `${item.height}px` }}
                            className="object-contain flex flex-col justify-center items-center" 
                        />
                        <p className="text-xl flex justify-center items-center font-bold text-sky-900 pb-5">
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
