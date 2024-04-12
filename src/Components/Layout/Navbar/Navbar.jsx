import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { Menubar } from "primereact/menubar";
import { Avatar } from 'primereact/avatar';
import { Toast } from "primereact/toast";

import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", {
      replace: true,
    });
  };
  const direcionamiento = () => {
    navigate("/Proveedor");
  };

  const direcionarRequicisiones = () =>{
    navigate("/Requisitor")
  }
  const items = [
    {
      label: "Fecha",
      icon: "pi pi-calendar",
    },
    {
      label: "Notificaciones",
      icon: "pi pi-bell",
    },
    {
      label: "Angel Star",
      icon: "pi pi-user",
      items: [
        {
          label: "Contraseña",
          icon: "pi pi-key",
        },
        {
          label: "Cerrar sesión",
          icon: "pi pi-sign-out",
          command: onLogout,
        }
      ]
    },
  ];

  const items10 = [
    {
      menu: true,
      label: "Tesch",
      id: "11",
    },
    {
      separator: true,
      id: "6",
    },
    {
      label: "Inicio",
      icon: "pi pi-home",
      id: "1",
    },
    {
      label: "Orden Compra",
      icon: "pi pi-cart-plus",
      id: "2",
      command: direcionamiento,
    },
    {
      label: "Edit",
      icon: "pi pi-file-edit",
      id: "3",
    },
    {
      label: "Search",
      icon: "pi pi-search",
      id: "4",
    },
    {
      label: "Solicitud De Compra",
      icon: "pi pi-cart-plus",
      id: "7",
      command: direcionarRequicisiones,
    },
    {
      label: "Sincronización",
      icon: "pi pi-sync",
      id: "8",
    },    
    {
      label: "Usuarios",
      icon: "pi pi-users",
      id: "9",
    },  
    {
      label: "Configuración",
      icon: "pi pi-cog",
      id: "10",
    },  
    {
      label: "Cerrar",
      icon: "pi pi-sign-out",
      id: "5",
      command: onLogout,
    },
    {
      separator: true,
      label: "S",
      id: "6",
    },
    ,
        {
            template: (item, options) => {
                return (
                    <button onClick={(e) => options.onClick(e)} className="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" shape="circle" />
                        <div className="flex flex-column align">
                            <span className="font-bold">Amy Elsner</span>
                            <span className="text-sm">Agent</span>
                        </div>
                    </button>
                );
            },
            id: "22",
        }
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  let filteredItems10 = [];

  if (user?.profile === "solicitante") {
    filteredItems10 = items10.filter(
      (item) => item.id === "1" ||item.id === "5" || item.id === "6" || item.id === "7" || item.id === "11"  
    );
  } else if (user?.profile === "proveedor") {
    filteredItems10 = items10.filter(
      (item) => item.id === "1" || item.id === "2" || item.id === "5" || item.id === "11"  || item.id === "6" || item.id === "22"
    );
  } else if (user?.profile === "administrador") {
    filteredItems10 = items10.filter(
      (item) => item.id === "8" || item.id === "9" || item.id === "10" || item.id === "11"  || item.id === "6"
    );
  }

  return (
    <>
      <TieredMenu

        model={filteredItems10}
        breakpoint="1500px"
        className="menubarNavegadorHorizontal"
        
      />

      <Menubar model={items} className="menubarNavegador" />
      
      <header>
        {user?.profile === "solicitante" && <div className="user"></div>}
        {user?.profile === "proveedor" && <div className="user"></div>}
      </header>

      <Outlet />
    </>
  );
};
