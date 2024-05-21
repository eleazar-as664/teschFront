import { Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage } from "../pages";
import NuevaCompra from "../pages/Requisitor/NuevaCompra";
import EditarRequisicion from "../pages/Requisitor/EditarRequisicion";
import DetalleCompra from "../pages/Requisitor/DetalleCompra";
import Requisitor from "../pages/Requisitor";
import Proveedor from "../pages/Proveedor";
import OrdenCompra from "../pages/Proveedor/OrdenCompra"
import NotFount from "../Components/NotFount";
import Autorizador from "../pages/Autorizador";
import AutorizadorOrdenCompra from "../pages/Autorizador/AutorizadorOrdenCompra";
import  "../Components/Styles/Global.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { PrivateRoute } from "./PrivateRoute";
import routes from "../utils/routes";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path={routes.URL_ROOT}>
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
                allowedProfiles={["Requisitor"]}
              />
            }
          />
          <Route
            path="Requisitor/Requisitor/NuevaCompra"
            element={
              <PrivateRoute
                element={<NuevaCompra />}
                allowedProfiles={["Requisitor"]}
              />
            }
          />
          <Route
            path="Requisitor/Requisitor/EditarRequisicion"
            element={
              <PrivateRoute
                element={<EditarRequisicion />}
                allowedProfiles={["Requisitor"]}
              />
            }
          />
           <Route
            path="Requisitor/Requisitor/DetalleCompra"
            element={
              <PrivateRoute
                element={<DetalleCompra />}
                allowedProfiles={["Requisitor"]}
              />
            }
          />
          <Route
            path="/Proveedor"
            element={
              <PrivateRoute
                element={<Proveedor />}
                allowedProfiles={["Proveedor"]}
              />
            }
          />
           <Route
            path="Proveedor/Proveedor/OrdenCompra"
            element={
              <PrivateRoute
                element={<OrdenCompra />}
                allowedProfiles={["Proveedor"]}
              />
            }
          />
          <Route
            path="/Autorizador"
            element={
              <PrivateRoute
                element={<Autorizador />}
                allowedProfiles={["Autorizador"]}
              />
            }
          />
           <Route
            path="Autorizador/Autorizador/AutorizadorOrdenCompra"
            element={
              <PrivateRoute
                element={<AutorizadorOrdenCompra />}
                allowedProfiles={["Autorizador"]}
              />
            }
          />
          <Route path="*" element={<NotFount />} />
        </Route>
      </Routes>
    </>
  );
};
