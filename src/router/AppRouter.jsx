import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages";
import Administrador from "../pages/Administrador";
import NuevaCompra from "../pages/Requisitor/NuevaCompra";
import EditarRequisicion from "../pages/Requisitor/EditarRequisicion";
import DetalleCompra from "../pages/Requisitor/DetalleCompra";
import NuevoUsuario from "../pages/Administrador/NuevoUsuario";
import DuplicarCompra from "../pages/Requisitor/DuplicarCompra";
import Sincronizar from "../pages/Administrador/Sincronizacion";

import SincronizacionProvedores from "../pages/Administrador/SincronizarProvedores";
import SincronizarEmpleados from "../pages/Administrador/SincronizarEmpleados";
import SincronizarArticulos from "../pages/Administrador/SincronizarArticulos";
import EditarUsuarios from "../pages/Administrador/EditarUsuarios";
import Requisitor from "../pages/Requisitor";
import Proveedor from "../pages/Proveedor";
import OrdenCompra from "../pages/Proveedor/OrdenCompra";
import NotFount from "../Components/NotFount";
import Autorizador from "../pages/Autorizador";
import AutorizadorOrdenCompra from "../pages/Autorizador/AutorizadorOrdenCompra";
import OrdenesNoAprobadas from "../pages/Autorizador/OrdenesNoAprobadas";
import DetalleUsuario from "../pages/Administrador/DetalleUsuario";
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
                element={<Administrador />}
                allowedProfiles={["Admin"]}
              />
            }
          />
          <Route
            path="Administrador/Administrador/NuevoUsuario"
            element={
              <PrivateRoute
                element={<NuevoUsuario />}
                allowedProfiles={["Admin"]}
              />
            }
          />
          <Route
            path="Administrador/Administrador/Sincronizacion"
            element={
              <PrivateRoute
                element={<Sincronizar />}
                allowedProfiles={["Admin"]}
              />
            }
          />
          <Route
            path="Administrador/Administrador/SincronizarProvedores"
            element={
              <PrivateRoute
                element={<SincronizacionProvedores />}
                allowedProfiles={["Admin"]}
              />
            }
          />
          <Route
            path="Administrador/Administrador/SincronizarEmpleados"
            element={
              <PrivateRoute
                element={<SincronizarEmpleados />}
                allowedProfiles={["Admin"]}
              />
            }
          />

          <Route
            path="Administrador/Administrador/SincronizarArticulos"
            element={
              <PrivateRoute
                element={<SincronizarArticulos />}
                allowedProfiles={["Admin"]}
              />
            }
          />

          <Route
            path="Administrador/Administrador/EditarUsuarios"
            element={
              <PrivateRoute
                element={<EditarUsuarios />}
                allowedProfiles={["Admin"]}
              />
            }
          />
          <Route
            path="/Administrador/Administrador/DetalleUsuario"
            element={
              <PrivateRoute
                element={<DetalleUsuario />}
                allowedProfiles={["Admin"]}
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
            path="Requisitor/Requisitor/DuplicarCompra"
            element={
              <PrivateRoute
                element={<DuplicarCompra />}
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
          <Route
            path="Autorizador/Autorizador/OrdenesNoAprobadas"
            element={
              <PrivateRoute
                element={<OrdenesNoAprobadas />}
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
