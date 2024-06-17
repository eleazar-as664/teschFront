import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (data) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16); // Tamaño de fuente del título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 160, 133); // Color verde esmeralda
  doc.text('ORDEN DE COMPRA', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Función para agregar una sección al PDF
  const addSection = (sectionTitle, sectionData, startY) => {
    doc.setFontSize(12); // Tamaño de fuente para el título de la sección
    doc.setTextColor(0); // Color de texto negro
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text(sectionTitle, 20, startY + 15); // Título de la sección

    const tableData = sectionData.map(item => [item.label, item.value]);

    doc.autoTable({
      body: tableData,
      startY: startY + 20,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'left'
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { fontStyle: 'normal' }
      }
    });
  };

  // Información del pedido dividida en secciones
  const infoSections = [
    {
      title: 'Información General',
      data: [
        { label: 'Número de Orden:', value: data.DocNum },
        { label: 'Fecha de Emisión:', value: data.DocDate },
        { label: 'Fecha de Vencimiento:', value: data.DocDueDate },
        { label: 'Proveedor:', value: `${data.CardName} (${data.CardCode})` },
        { label: 'Estado de Aprobación:', value: data.ApprovalStatus },
        { label: 'Comentarios:', value: data.Comments }
      ]
    },
    {
      title: 'Detalles Adicionales',
      data: [
        { label: 'ID Adjunto:', value: data.AbsAttachId },
        { label: 'Nombre de Negocio:', value: `${data.BusinessName} (${data.BusinessPartnerId})` },
        { label: 'Nombre de Compañía:', value: `${data.CompanyName} (${data.CompanyId})` },
        { label: 'Nombre de Base de Datos:', value: data.DBName },
        { label: 'Fecha de Entrega:', value: data.DeliveryDate },
        { label: 'ID de Empleado:', value: `${data.FirstName} ${data.MiddleName} ${data.LastName} (${data.EmployeeId})` }
      ]
    },
    {
      title: 'Documentación y Aprobación',
      data: [
        { label: 'Número de Documento de Solicitud de Compra:', value: data.PruchaseRequestDocNum },
        { label: 'ID de Orden de Compra:', value: data.PurchaseOrderId },
        { label: 'ID de Solicitud de Compra:', value: data.PurchaseRequestId },
        { label: 'Enviado:', value: data.Sent ? 'Sí' : 'No' },
        { label: 'Estado SAP:', value: data.StatusSAP },
        { label: 'Aprobado por:', value: data.UserApprover },
        { label: 'ID de Aprobador:', value: data.UserApproverId }
      ]
    }
  ];

  // Agregar cada sección al PDF
  let startY = 25; // Posición inicial de la primera sección

  infoSections.forEach(section => {
    addSection(section.title, section.data, startY);
    startY = doc.autoTable.previous.finalY + 10; // Actualizar posición inicial para la próxima sección
  });

  // Agregar tabla de detalles
  const detailsData = data.details || [];
  const detailsTableData = detailsData.map(item => [
    item.ItemCode || '',
    item.Description || '',
    item.Quantity || '',
    item.BuyUnitMsr || ''
  ]);

  doc.addPage(); // Agregar una nueva página para los detalles si es necesario

  doc.setFontSize(14); // Tamaño de fuente para el título de detalles
  doc.setTextColor(22, 160, 133); // Color verde esmeralda
  doc.setFont('helvetica', 'bold');
  doc.text('Detalles de la Orden', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.autoTable({
    head: [['Código Artículo', 'Descripción de Producto', 'Cantidad', 'Unidad de Medida']],
    body: detailsTableData,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: 'middle',
      halign: 'center'
    },
    headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { fontStyle: 'normal' }
    }
  });

  // Guardar el PDF
  doc.save('orden_de_compra.pdf');
};

export default generatePDF;
