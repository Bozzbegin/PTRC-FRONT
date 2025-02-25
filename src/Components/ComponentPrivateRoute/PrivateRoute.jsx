import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios'

const PrivateRoute = () => {
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://192.168.195.75:5000/v1/product/outbound/product", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "x-api-key": "p@tt@r@ch@i2k24",
        },
      })
      .catch((err) => {
          localStorage.removeItem("token");
          window.location.href = "/login";  
          console.log(err);
          
      });
  }, []);


  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  return <Outlet/>;
};

export default PrivateRoute;
