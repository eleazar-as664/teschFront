import React ,{useState, useEffect} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { Menubar } from "primereact/menubar";
import { Avatar } from 'primereact/avatar';
import { Toast } from "primereact/toast";
import moment from 'moment';

import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    // Obtener la fecha actual usando Moment.js
    const today = moment().format('YYYY-MM-DD');
    setCurrentDate(today);
  }, []);

  
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
  const direcionamientoAutorizaciones = () => {   
    navigate("/Autorizador"); 
  }
  const primeraLetra = user.FirstName.charAt(0);
  const items = [
    {
      label:  currentDate,
      icon: "pi pi-calendar",
    },
    {
      label: "Notificaciones",
      icon: "pi pi-bell",
    },
    {
        template: () => {
          return (
              <li className="w-full p-link flex-row">
                  <Avatar  label={primeraLetra} className="mr-2" shape="circle" />
                  <div className="flex-column user-data">
                      <span className="name-user">{user.FirstName + " " + user.LastName}</span>
                      <span className="text-sm">{user.Profiles[0].Name  }</span>
                     
                  </div>
              </li>
          );
      },
      id: "22",
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
      template: () => {
           return (
               <div class="logo-conteiner">
                <img src={"/hormadi-grupo.jpg"} alt=""  width="110"/>
               </div>
           );
       },
       id: "11"
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
      label: "Autorizaciones",
      icon: "pi pi-cog",
      id: "12",
      command: direcionamientoAutorizaciones,
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



  if (user.Profiles.some(profile => profile.Name === "Requisitor")) {
    const requisitorItems = items10.filter(
      (item) => item.id === "1" ||item.id === "5" || item.id === "6" || item.id === "7" || item.id === "11"  
    );
    filteredItems10 = filteredItems10.concat(requisitorItems);
  }

  if (user.Profiles.some(profile => profile.Name === "Proveedor")) {
      const solicitanteItems = items10.filter(   
      (item) => item.id === "1" || item.id === "2" || item.id === "5" || item.id === "11"  || item.id === "6" || item.id === "22"
    );
    filteredItems10 = filteredItems10.concat(solicitanteItems);
  }

  if (user.Profiles.some(profile => profile.Name === "Autorizador")) {
    const solicitanteItems = items10.filter(   
    (item) => item.id === "12" || item.id === "5" || item.id === "11" || item.id === "22"
  );
  filteredItems10 = filteredItems10.concat(solicitanteItems);
}

  if (user.Profiles.some(profile => profile.Name === "Administrador")) {
    const adminItems = items10.filter(
      (item) => item.id === "8" || item.id === "9" || item.id === "10" || item.id === "11"  || item.id === "6"
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
