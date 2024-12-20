import React, { useState, useEffect, useRef } from "react";

import TextInput from "../../Components/Requisitor/TextInput";
import DatesInput from "../../Components/Requisitor/DatesInput";
import TextTareaInput from "../../Components/Requisitor/TextTareaInput";
import DropdownInput from "../../Components/Requisitor/DropdownInput";
import MaterialDialog from "../../Components/Requisitor/Materiales";
import MaterialDialogEditar from "../../Components/Requisitor/MaterialesEditar";
import { Layout } from "../../Components/Layout/Layout";
import routes from "../../utils/routes";

import { Card } from "primereact/card";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./NuevaCompra.css";

function DuplicarCompra() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha: null,
    NumAtCard: "",
    companies: "",
    proveedor: "",
    cantidad: "",
    precio: "",
    Comments: "",
    archivoPDF: null,
  });

  const [formErrors, setFormErrors] = useState({
    fecha: false,
    NumAtCard: false,
    companies: false,
    proveedor: false,
    cantidad: false,
    precio: false,
    Comments: false,
  });
  const datosRequisitor = JSON.parse(localStorage.getItem("datosRequisitor"));
  const [centroCostos, setCentroCostos] = useState([]);
  const [loandingPendiente, setLoandingPendiente] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [materialeslData, setMaterialesData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [contadorId, setContadorId] = useState(1);
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const filterMaterials = (event) => {
    const searchTerm = event.query.toLowerCase();
    const filtered = materialeslData.filter((material) =>
      material.Description.toLowerCase().includes(searchTerm)
    );
    setFilteredMaterials(filtered);
  };
  const handleEdit = (rowData) => {
    setMaterialToEdit(rowData);
    setDialogVisible(true);
  };
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const user = JSON.parse(localStorage.getItem("user"));
  const tokenSap = JSON.parse(localStorage.getItem("user")).TokenSAP;
  const toast = useRef(null);
  const handleMaterialChange = (material) => {
    setMaterialToEdit(null);
    setSelectedMaterial(material);
    setDialogVisible(true); // Mostrar el MaterialDialog al seleccionar un material
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };
  const fetchDataCentroCostos = async (companyDBName) => {
    try {
      const apiUrl = `${routes.BASE_URL_SERVER}/GetCostCentersForEmployees`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const data = {
        SAPToken: tokenSap,
        Dimension: 1,
        DBName:companyDBName,
      };
      
      const response = await axios.post(apiUrl, data, config);
 

      setCentroCostos(response.data.data);


    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };


  const fetchDataCentroCostosDuplicados = async (companyDBName , OcrCode) => {
    try {
      const apiUrl = `${routes.BASE_URL_SERVER}/GetCostCentersForEmployees`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const data = {
        SAPToken: tokenSap,
        Dimension: 1,
        DBName:companyDBName,
      };
      
      const response = await axios.post(apiUrl, data, config);
 

      setCentroCostos(response.data.data);
      const centroCostoss = response.data.data;
      const selectedCostCenter = centroCostoss.find(
        (centro) => centro.CenterCode === OcrCode
      );
      console.log(centroCostoss)
      console.log("Centro de costo seleccionado:", selectedCostCenter.CenterCode);
      if (selectedCostCenter) {
        setFormData((prevState) => ({
          ...prevState,
          CostCenterCode: selectedCostCenter,
        }));
      }
      
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.clear();

        const apiUrl = `${routes.BASE_URL_SERVER}/GetCompaniesForUser/${user.UserId}`;
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        const response = await axios.get(apiUrl, config);
        console.log("COMPANIAS", response.data.data[0]);
        setCompanies(response.data.data);

        // setFormData((prevState) => ({
        //   ...prevState,
        //   companies: response.data.data[0],
        // }));
        const apiUrlGetItemsByCompany = `${routes.BASE_URL_SERVER}/GetItemsByCompany/${response.data.data[0].Id}`;
        console.log('HJAHJKHAIJKSHAJKSHJKASHJKASHJKASHJK')
        console.log(config)
        console.log(apiUrlGetItemsByCompany);
        const resp = await axios.get(apiUrlGetItemsByCompany, config);
        console.log('HOLAAAAAAAA COMPANIAS')
        console.log(resp);
        setMaterialesData(resp.data.data);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };
    getDatosCompra();
    fetchData();
    fetchDataCentroCostos(user.CompanyDBName);
  }, [user.UserId]); // El array vacío indica que este efecto se ejecuta solo una vez, equivalente a componentDidMount

  const handleAlmacenChange = async (e) => {
   console.clear();

    const selectedAlmacen = e.target.value;
    console.log("Seleccionando almacen:", e.target.value);
    // setFormData({ ...formData, almacen: selectedAlmacen });
    setFormData((prevState) => ({
      ...prevState,
      companies: selectedAlmacen,
    }));
    setCentroCostos([]);

    fetchDataCentroCostos(selectedAlmacen.DBName);

    try {
      const apiUrl = `${routes.BASE_URL_SERVER}/GetItemsByCompany/${selectedAlmacen.Id}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      console.log(response.data.data);
      setMaterialesData(response.data.data);
    } catch (error) {
      let {response: {data: {detailMessage, message}}} = error;
      toast.current.show({
        severity: "warn",
        summary: message,
        detail:  detailMessage,
        life: 3000,
      });
      console.error("Error al obtener datos adicionales:", error);
    }
    finally{
     
      setSelectedItems([]);
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();
 
    if (validateForm()) {
      setLoandingPendiente(true);
      try {
    

        const requestData = buildRequestData();
        console.log("RequestDta: ", requestData);
        const response = await sendFormData(requestData, archivosSeleccionados);
        handleSuccessResponse(response);
      } catch (error) {
        handleErrorResponse(error);
      }
      finally{
      setLoandingPendiente(false);
      }
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }
  };

  const buildRequestData = () => {
    const momentDate = moment(formData.fecha);
    const formattedDate = momentDate.format("YYYY-MM-DD");
    console.clear();
    console.log(selectedItems)
  
    const PurchaseOrderRequestDetails = selectedItems.map((obj) => ({
      Description: obj.Description,
      BuyUnitMsr: obj.BuyUnitMsr,
      Quantity: obj.Quantity,
      TaxCodeId: obj.TaxCode,
      ItemId: obj.ItemId,
      PurchaseRequestId: 0,
    }));

    return {
      CreateDate: formattedDate,
      DocDate: formattedDate,
      DocDueDate: formattedDate,
      UserId: user.UserId,
      NumAtCard: formData.NumAtCard,
      Comments: formData.Comments,
      CompanyId: formData.companies.Id,
      CostCenterCode: formData.CostCenterCode ? formData.CostCenterCode.CenterCode : '',
      PurchaseOrderRequestDetails,
    };
  };
  const sendFormData = async (data, pdf) => {
    const formData = new FormData();
   
    formData.append("data", JSON.stringify(data));
    formData.append("FilesToUpload", pdf);

    pdf.forEach((file, index) => {
      formData.append(`FilesToUpload`, file);
    });
    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };
    if (data.PurchaseOrderRequestDetails.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }

    const response = await axios.post(
      `${routes.BASE_URL_SERVER}/CreatePurchaseRequest`,
      formData,
      config
    );
    return response.data;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    setDialogVisibleNuevaCompra(true);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.error("Error al enviar el formulario:", error);
  };
  const validateForm = () => {
    const errors = {};
    let formIsValid = true;
    if (!formData.CostCenterCode) {
      errors.CostCenterCode = "El centro de costo es obligatorio.";
      formIsValid = false;
    }

    if (!formData.fecha) {
      errors.fecha = "La fecha es obligatoria.";
      formIsValid = false;
    }

    if (!formData.companies) {
      errors.companies = "Seleccione una compañía.";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleGuardarMaterial = (materialModificado) => {
    const materialConId = { ...materialModificado, idTeficador: contadorId };
    setContadorId(contadorId + 1);
    setSelectedItems([...selectedItems, materialConId]);
  };

  const handleEditarMaterial = (materialModificado) => {
   

    const index = selectedItems.findIndex(
      (item) => item.idTeficador === materialModificado.idTeficador
    );

    if (index !== -1) {
      // Si se encuentra el material en la lista, actualizarlo
      const updatedItems = [...selectedItems];
      updatedItems[index] = materialModificado;
      setSelectedItems(updatedItems);
    } else {
      console.error("No se encontró el material en la lista seleccionada.");
    }

    console.log("Material modificado:", materialModificado);
  };

  useEffect(() => {}, [selectedItems]);
  const handleDelete = (rowData) => {
    const updatedItems = selectedItems.filter((item) => item !== rowData);
    setSelectedItems(updatedItems);

    console.log("Elemento eliminado:", rowData);
  };

  const handleEnviarNavigate = () => {
   

    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Requisitor"); // Navega a la ruta "/Requisitor"
  };

  const handleFileSelect = (event) => {
    const nuevosArchivosPDF = Array.from(event.files);
    setArchivosSeleccionados([...archivosSeleccionados, ...nuevosArchivosPDF]);
  };
  const eliminarFiles = (rowData) => {
    console.log(rowData);
    const updatedItems = archivosSeleccionados.filter(
      (item) => item !== rowData
    );
    setArchivosSeleccionados(updatedItems);
  };
  const getDatosCompra = async () => {
    try {
      const idSolicitud = datosRequisitor.PurchaseRequestId;

      const apiUrl = `${routes.BASE_URL_SERVER}/GetSinglePurchaseRequest/${idSolicitud}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);

      const detalesRequisicion = response.data.data;

    //   setInfoUsuarioCreadorSolicitud(detalesRequisicion);
    //   setPrimeraLetra(detalesRequisicion.FirstName.charAt(0));

      console.clear();
      console.log("detalesRequisicion:", detalesRequisicion);
      fetchDataCentroCostosDuplicados(detalesRequisicion.DBName,detalesRequisicion.Detail[0].OcrCode );
    const data = {
         BusinessName: detalesRequisicion.BusinessName,
         CompanyCode: detalesRequisicion.CompanyCode,
         DBName: detalesRequisicion.DBName,
         Id: detalesRequisicion.CompanyId,
         Name: detalesRequisicion.BusinessName,
        
            }
        setFormData((prevState) => ({
            ...prevState,
            companies:data,
            NumAtCard:detalesRequisicion.NumAtCard,
            Comments:detalesRequisicion.Comments,
            CostCenterCode: detalesRequisicion.Detail[0] ? detalesRequisicion.Detail[0].OcrCode : ''

        }));

        console.log('centroCostoscentroCostoscentroCostoscentroCostoscentroCostos');
        console.log(detalesRequisicion.Detail[0].OcrCode);
       
       

    const apiUrl1 = `${routes.BASE_URL_SERVER}/GetItemsByCompany/${detalesRequisicion.CompanyId}`;
    const config1 = {
      headers: {
        "x-access-token": token,
      },
    };
    const response1 = await axios.get(apiUrl1, config1);
    console.log('centroCostoscentroCostoscentroCostoscentroCostoscentroCostos');
    console.log(centroCostos);
    setMaterialesData(response1.data.data);
      const newSelectedItems = detalesRequisicion.Detail.map((item, index) => ({
        id: index,
        ItemCode: item.ItemCode,
        Description: item.Description,
        BuyUnitMsr: item.BuyUnitMsr,
        Quantity: item.Quantity,
        IVAName: item.TaxCode,
        ItemId: item.ItemId,
      }));
      const notas = detalesRequisicion.Notes.map((item, index) => ({
        id: index,
        CreateDate: item.CreateDate,
        FirstName: item.FirstName,
        Notes: item.Notes,
        UserName: item.UserName,
        LastName: item.LastName,
      }));

    //   setNotas(notas);

         setSelectedItems(newSelectedItems);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  
  return (
    <Layout>
      <div className="body-ordenCompra">
      <Card className="card-header">
        <div class="row">
          <div className="p-card-title">Duplicar Solicitud</div>
        </div>
      </Card>
      <Card className="cardOrdenCompra">
      <Toast ref={toast} />
        {/* <form onSubmit={handleSubmit}> */}
          <div className="p-field-group">
            <div className="row">
                <DropdownInput
                  id="compañia"
                  label="Compañia:"
                  optionLabel="BusinessName"
                  value={formData.companies}
                  placeholder="Seleccione una compañia"
                  options={Array.isArray(companies) ? companies : []}
                  onChange={handleAlmacenChange}
                  error={formErrors.nombre}
                  disabled={companies.length <= 1}
                />
                <DatesInput
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.value })}
                  error={formErrors.fecha}
                />
                <TextInput
                  id="NumAtCard"
                  label="Referencia:"
                  value={formData.NumAtCard}
                  onChange={(e) =>
                    setFormData({ ...formData, NumAtCard: e.target.value })
                  }
                  error={formErrors.NumAtCard}
                />
            </div>
            <div className="row">
                <DropdownInput
                  id="costos"
                  label="Centro de Costos:"
                  optionLabel="CenterName"
                  value={formData.CostCenterCode}
                  onChange={(e) =>
                    setFormData({ ...formData, CostCenterCode: e.target.value })}
                  placeholder="Seleccione un centro de costos"
                  options={Array.isArray(centroCostos) ? centroCostos : []}
                  error={formErrors.CostCenterCode}
                />
                <TextTareaInput
                  id="comentario"
                  label="Comentarios"
                  value={formData.Comments}
                  onChange={(e) =>
                    setFormData({ ...formData, Comments: e.target.value })
                  }
                  rows={3}
                  cols={10}
                />
            </div>

            <div className="row">
            <div className="p-field" >
                <AutoComplete
                  value={searchValue}
                  suggestions={filteredMaterials}
                  completeMethod={filterMaterials}
                  field="Description"
                  onChange={(e) => setSearchValue(e.value)}
                  onSelect={(e) => {
                    setSelectedMaterial(e.value);
                    setSearchValue("");
                    handleMaterialChange(e.value);
                  }}
                  placeholder="Buscar material..."
                />
              </div>
              <div className="p-field button-conteiner">
                <div className="botonEnviar">
                {loandingPendiente ? (
                  <Button
                    icon="pi pi-spin pi-spinner"
                    className="p-button-secondary"
                  />
                ) : (
                  <Button
                        label="Guardar"
                        onClick={handleSubmit}
                        icon="pi pi-check"
                        className="p-button-primary"
                      />
                )}
                  
                </div>
                <div className="botonCancelar">
                  <Button
                    label="Cancelar"
                    type="button"
                    onClick={handleEnviarNavigate}
                    className="p-button-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        {/* </form> */}
        {selectedMaterial && (
          <MaterialDialog
            visible={dialogVisible}
            material={selectedMaterial}
            onClose={handleDialogClose}
            onSave={handleGuardarMaterial}
          />
        )}
        {materialToEdit && (
          <MaterialDialogEditar
            visible={dialogVisible}
            material={materialToEdit}
            onClose={handleDialogClose}
            onSave={handleEditarMaterial}
          />
        )}
        <Dialog
          visible={dialogVisibleNuevaCompra}
          onHide={handleEnviarNavigate}
          header="Éxito"
          modal
          footer={<Button label="Cerrar" onClick={handleEnviarNavigate} />}
        >
          <div>¡La operación se completó con éxito!</div>
        </Dialog>
        <div className="table-container">
          <DataTable value={selectedItems} scrollHeight="400px" >
            <Column field="ItemCode" header="C&oacute;digo" style={{ width: "20%" }}/>
            <Column field="Description" header="Descripci&oacute;n" style={{ width: "45%" }}/>
            <Column field="BuyUnitMsr" header="Unidad" style={{ width: "10%" }}></Column>
            <Column field="Quantity" header="Cantidad" style={{ width: "10%" }}/>
            {/* <Column field="IVAName" header="Impuesto" /> */}
            <Column
              field=""
              style={{ width: "15%" }}
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    onClick={() => handleEdit(rowData)}
                    className="p-button-success"
                  />
                  <Button
                    icon="pi pi-trash"
                    onClick={() => handleDelete(rowData)}
                    rounded
                    className="p-button-danger"
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </Card>

      <div class="body-right">
      <Card title="Adjuntos" className="adjuntosaa">
        <div className="p-field-group">
          <div className="row align-right">
            {archivosSeleccionados.length < 10 && (
              <FileUpload
                mode="basic"
                name="demo[]"
                multiple
                accept="image/*,.pdf"
                maxFileSize={20000000}
                onSelect={handleFileSelect}
                auto
                chooseLabel="Agregar"
                className="upload-field-detail"
              />
            )}
          </div>
          <div className="row">
            <div className="p-col-field">
              <DataTable value={archivosSeleccionados}>
                <Column field="name" header="Nombre" />
                <Column
                  header="Acción"
                  body={(rowData) => (
                    <a
                      href={rowData.objectURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver
                    </a>
                  )}
                />
                <Column
                  header=""
                  body={(rowData) => (
                    <Button
                      onClick={() => eliminarFiles(rowData)}
                      icon="pi pi-times"
                      rounded
                      severity="danger"
                      aria-label="Cancel"
                    />
                  )}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </Card>
      </div>
      </div>
    </Layout>
  );
}

export default DuplicarCompra;