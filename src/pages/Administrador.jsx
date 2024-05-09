import React from 'react'

// export const Admin = () => {
//   return (
//     <h1>Hola soy el admin</h1>
//   )
// }

function Administrador() {
return (
  <Layout>
    <Card className="card-header">
      <Toast ref={(el) => (toast = el)} />
      <div class="row">
        <div className="p-card-title">Solicitudes</div>
        <div class="gorup-search">
          <div>
            <Link to="./Requisitor/NuevaCompra">
              <Button
                label="Nueva Solicitud"
                severity="primary"
                raised
                icon="pi pi-plus-circle"
                iconPos="left"
                className="botonInsertarRequisitor"
              />
            </Link>
          </div>
        </div>
      </div>
    </Card>
    </Layout>
)
}

export default Administrador;