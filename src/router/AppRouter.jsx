import { Route, Routes } from "react-router-dom";
import { Navbar } from "../Navbar";
import { DashboardPage, LoginPage } from "../pages";
import Solicitante from "../pages/Solicitante";
import Proveedor from "../pages/Proveedor";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import { PrivateRoute } from "./PrivateRoute";

export const AppRouter = () => {
  return (
    <>
     <Routes>
        <Route path="/" >
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute
              element={<DashboardPage />}
              allowedProfiles={["admin"]}
            />}
          />
          <Route
            path="/solicitante"
            element={<PrivateRoute
              element={<Solicitante />}
              allowedProfiles={["solicitante"]}
            />}	
          />
          <Route
            path="/proveedor"
            element={<PrivateRoute
              element={<Proveedor />}
              allowedProfiles={["proveedor"]}
            />}
          />
        </Route>
      </Routes>
    </>
  );
};
