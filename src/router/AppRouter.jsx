import { Route, Routes } from "react-router-dom";

import { DashboardPage, LoginPage } from "../pages";
import NuevaCompra from "../pages/Requisitor/NuevaCompra";
import Requisitor from "../pages/Requisitor";
import Proveedor from "../pages/Proveedor";
import OrdenCompra from "../pages/Proveedor/OrdenCompra"
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

import { PrivateRoute } from "./PrivateRoute";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="/Administrador"
            element={
              <PrivateRoute
                element={<DashboardPage />}
                allowedProfiles={["admin"]}
              />
            }
          />
          <Route
            path="/Requisitor"
            element={
              <PrivateRoute
                element={<Requisitor />}
                allowedProfiles={["solicitante"]}
              />
            }
          />
          <Route
            path="Requisitor/Requisitor/NuevaCompra"
            element={
              <PrivateRoute
                element={<NuevaCompra />}
                allowedProfiles={["solicitante"]}
              />
            }
          />
          <Route
            path="/Proveedor"
            element={
              <PrivateRoute
                element={<Proveedor />}
                allowedProfiles={["proveedor"]}
              />
            }
          />
           <Route
            path="Proveedor/Proveedor/OrdenCompra"
            element={
              <PrivateRoute
                element={<OrdenCompra />}
                allowedProfiles={["proveedor"]}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};
