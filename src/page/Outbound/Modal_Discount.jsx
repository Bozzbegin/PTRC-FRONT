import React, { useState, useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";

export function ModalDiscount({ close, confirm }) {

  const initialFormData = JSON.parse(localStorage.getItem("formData")) || {
    shipping_cost: 0,
    move_price: 0,
    discount: 0,
    guarantee_price: 0,
    taxid: "",
    remark1: "",
    remark2: "",
    remark3: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [taxidOptions, setTaxidOptions] = useState([]);
  const [remark1Options, setRemark1Options] = useState([]);
  const [remark2Options, setRemark2Options] = useState([]);
  const [remark3Options, setRemark3Options] = useState([]);
  const [isTaxidFocused, setIsTaxidFocused] = useState(false);
  const [isRemark1Focused, setIsRemark1Focused] = useState(false);
  const [isRemark2Focused, setIsRemark2Focused] = useState(false);
  const [isRemark3Focused, setIsRemark3Focused] = useState(false);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleRemarkFocus = async (remarkType) => {
    try {
      const token = localStorage.getItem('token');
      const url = getRemarkApiUrl(remarkType);
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY
        }
      });

      if (response.data.code === 200) {
        const options = response.data.data.map((item) => ({
          value: item.remark1,
          label: item.remark1
        }));

        const options2 = response.data.data.map((item) => ({
          value: item.remark2,
          label: item.remark2
        }));

        const options3 = response.data.data.map((item) => ({
          value: item.remark3,
          label: item.remark3
        }));

        if (remarkType === 'remark1') setRemark1Options(options);
        else if (remarkType === 'remark2') setRemark2Options(options2);
        else if (remarkType === 'remark3') setRemark3Options(options3);

      } else {
        console.error('Error: Response code not 200');
      }
    } catch (error) {
      console.error(`Error fetching ${remarkType} options:`, error);
    }
  };

  const getRemarkApiUrl = (remarkType) => {
    switch (remarkType) {
      case 'remark1':
        return 'http://192.168.195.75:5000/v1/product/outbound/remark1';
      case 'remark2':
        return 'http://192.168.195.75:5000/v1/product/outbound/remark2';
      case 'remark3':
        return 'http://192.168.195.75:5000/v1/product/outbound/remark3';
      default:
        return '';
    }
  };

  const handleTaxidFocus = async () => {
    setIsTaxidFocused(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.195.75:5000/v1/product/outbound/tax-id', {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY
        }
      });

      if (response.data.code === 200) {
        const options = response.data.data.map((item) => ({
          value: item.taxid,
          label: item.taxid
        }));
        setTaxidOptions(options);
      }

    } catch (error) {
      console.error('Error fetching taxid options:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const confirm_item = () => {
    close(formData);
  };

  if (!confirm) { null; }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50">
      <div className="bg-white w-[700px] h-[750px] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 text-white">
          <h2 className="text-2xl font-bold text-black">กรอกข้อมูลส่วนลดเพิ่มเติม</h2>
          <button
            className="text-lg text-black hover:text-red-300 transition"
            onClick={close}
          >
            X
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-grow ">

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 ">

            {[
              { label: "ค่าขนส่งไป-กลับ", name: "shipping_cost" },
              { label: "ค่าบริการเคลื่อนย้ายสินค้า", name: "move_price" },
              { label: "ส่วนลด", name: "discount" },
              { label: "ค่าประกันสินค้า", name: "guarantee_price" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lg text-black mb-2">
                  {field.label} :
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-10 px-2 border border-black rounded-md text-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            ))}

            <div className="flex flex-col col-span-2">
              <label className="text-lg text-black mb-2">
                เลขประจำตัวผู้เสียภาษีอากร :
              </label>
              <CreatableSelect
                isClearable
                options={taxidOptions}
                onFocus={handleTaxidFocus}
                // onBlur={(e) => handleTaxidBlur(e)}
                onChange={(selectedOption) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    taxid: selectedOption ? selectedOption.label : ""
                  }));
                  setIsTaxidFocused(false);
                }}
                value={formData.taxid ? { value: formData.taxid, label: formData.taxid } : null}
                className="mt-2"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderWidth: "1px",
                    borderRadius: "8px",
                    borderColor: state.isFocused ? "black" : "black",
                    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                    "&:hover": { borderWidth: "1px", borderColor: "black" }
                  })
                }}
              />
            </div>

            {[
              { label: "หมายเหตุ 1", name: "remark1", options: remark1Options },
              // { label: "หมายเหตุ 2", name: "remark2", options: remark2Options },
              // { label: "หมายเหตุ 3", name: "remark3", options: remark3Options },
            ].map((field, index) => (
              <div key={index} className="flex flex-col col-span-2">
                <label className="text-lg text-black mb-2">
                  {field.label} :
                </label>
                <CreatableSelect
                  isClearable
                  options={field.options}
                  onFocus={() => handleRemarkFocus(field.name)}
                  // onBlur={(e) => handleRemark1Blur(e)}
                  onChange={(selectedOption) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      [field.name]: selectedOption ? selectedOption.label : ""
                    }));
                  }}
                  value={formData.remark1 ? { value: formData.remark1, label: formData.remark1 } : null}
                  className="mt-2"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderWidth: "1px",
                      borderRadius: "8px",
                      borderColor: state.isFocused ? "black" : "black",
                      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                      "&:hover": { borderWidth: "1px", borderColor: "black" }
                    })
                  }}
                />
              </div>
            ))}

            {[
              // { label: "หมายเหตุ 1", name: "remark1", options: remark1Options },
              { label: "หมายเหตุ 2", name: "remark2", options: remark2Options },
              // { label: "หมายเหตุ 3", name: "remark3", options: remark3Options },
            ].map((field, index) => (
              <div key={index} className="flex flex-col col-span-2">
                <label className="text-lg text-black mb-2">
                  {field.label} :
                </label>
                <CreatableSelect
                  isClearable
                  options={field.options}
                  onFocus={() => handleRemarkFocus(field.name)}
                  // onBlur={(e) => handleRemark2Blur(e)}
                  onChange={(selectedOption) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      [field.name]: selectedOption ? selectedOption.label : ""
                    }));
                  }}
                  value={formData.remark2 ? { value: formData.remark2, label: formData.remark2 } : null}
                  className="mt-2"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderWidth: "1px",
                      borderRadius: "8px",
                      borderColor: state.isFocused ? "black" : "black",
                      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                      "&:hover": { borderWidth: "1px", borderColor: "black" }
                    })
                  }}
                />
              </div>
            ))}

            {[
              // { label: "หมายเหตุ 1", name: "remark1", options: remark1Options },
              // { label: "หมายเหตุ 2", name: "remark2", options: remark2Options },
              { label: "หมายเหตุ 3", name: "remark3", options: remark3Options },
            ].map((field, index) => (
              <div key={index} className="flex flex-col col-span-2">
                <label className="text-lg text-black mb-2">
                  {field.label} :
                </label>
                <CreatableSelect
                  isClearable
                  options={field.options}
                  onFocus={() => handleRemarkFocus(field.name)}
                  // onBlur={(e) => handleRemark3Blur(e)}
                  onChange={(selectedOption) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      [field.name]: selectedOption ? selectedOption.label : ""
                    }));
                  }}
                  value={formData.remark3 ? { value: formData.remark3, label: formData.remark3 } : null}
                  className="mt-2"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderWidth: "1px",
                      borderRadius: "8px",
                      borderColor: state.isFocused ? "black" : "black",
                      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                      "&:hover": { borderWidth: "1px", borderColor: "black" }
                    })
                  }}
                />
              </div>
            ))}

          </div>

          <div className="p-4 flex justify-center py-8">
            <button
              className="text-white rounded-md text-lg font-medium transition w-1/5 h-10 bg-[#31AB31] hover:bg-green-600 active:bg-green-700"
              onClick={confirm_item}
            >
              ยืนยัน
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
