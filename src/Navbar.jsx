import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { Menubar } from "primereact/menubar";
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

  const user = JSON.parse(localStorage.getItem("user"));
  let filteredItems10 = [];

  if (user?.profile === "solicitante") {
    filteredItems10 = items10.filter(
      (item) => item.id === "1" ||item.id === "5" || item.id === "6" 
    );
  } else if (user?.profile === "proveedor") {
    filteredItems10 = items10.filter(
      (item) => item.id === "1" || item.id === "2" || item.id === "5"
    );
  } else if (user?.profile === "administrador") {
    filteredItems10 = items10;
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
