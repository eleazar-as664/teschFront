import React, { Children } from 'react'
import { Card } from "primereact/card";
import { Navbar } from "./Navbar/Navbar";
import "../Styles/Global.css";
import "./Layout.css";


export const Layout = ({ children }) => {
  return (
    <div class='page-layout c-font-montserrat'>
    <Navbar/>
        <div class='body-layout'>
           <div class="container-base">
             {children}
            </div>
        </div>
     </div>
  )
}
