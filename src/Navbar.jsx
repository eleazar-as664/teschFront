import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { Menubar } from "primereact/menubar";
import "./Components/Layout/Navbar/Navbar.css";

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
      label: "Components",
      icon: "pi pi-bolt",
    },
    {
      label: "Features",
      icon: "pi pi-star",
    },
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
            },
          ],
        },
      ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
    },
  ];

  const items10 = [
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
  ];

  let filteredItems10 = [];
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.Profiles.some(profile => profile.Name === "Solicitante")) {
    const solicitanteItems = items10.filter(
      item => item.id === "1" || item.id === "2"
    );
    filteredItems10 = filteredItems10.concat(solicitanteItems);
  }
  
  if (user.Profiles.some(profile => profile.Name === "Requisitor")) {
    const requisitorItems = items10.filter(
      item => item.id === "1" ||item.id === "5" || item.id === "6" || item.id === "7"  
    );
    filteredItems10 = filteredItems10.concat(requisitorItems);
  }
  
  if (user.Profiles.some(profile => profile.Name === "Administrador")) {
    const adminItems = items10.filter(
      item => item.id === "5" || item.id === "6"
    );
    filteredItems10 = filteredItems10.concat(adminItems);
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
