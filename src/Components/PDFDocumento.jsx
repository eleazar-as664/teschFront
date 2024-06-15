import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (data) => {
  const doc = new jsPDF();

  // Agregar el título
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEN DE COMPRA', 105, 20, { align: 'center' });

  // Agregar información del proveedor
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre del Proveedor: ${data.CardName || ''}`, 20, 40);
  doc.text(`RFC: ${data.CardCode || ''}`, 20, 45);
  doc.text(`Dirección: N/A`, 20, 50);

  // Agregar información general del pedido
  doc.text(`No. de Orden de Compra: ${data.DocNum || ''}`, 20, 60);
  doc.text(`Fecha Contable: ${data.DocDate || ''}`, 20, 65);
  doc.text(`Fecha de Entrega: ${data.DeliveryDate || 'N/A'}`, 20, 70);
  doc.text(`Comprador: ${data.FirstName || ''} ${data.MiddleName || ''} ${data.LastName || ''}`, 20, 75);
  doc.text(`Condición de Pago: N/A`, 20, 80);
  doc.text(`% Descuento: 0.00%`, 20, 85);

  // Agregar tabla de artículos
  const items = data.items || [];
  const tableData = items.map(item => [
    item.codigo || '', 
    item.descripcion || '', 
    item.cantidad || '', 
    item.precioUnitario || '', 
    item.importeNeto || ''
  ]);

  doc.autoTable({
    head: [['Código Artículo', 'Descripción de Producto', 'Cantidad', 'Precio Unitario', 'Importe Neto']],
    body: tableData,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  // Agregar comentarios
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.text('Comentarios:', 20, finalY);
  doc.text(data.Comments || '', 20, finalY + 5);

  // Guardar el PDF
  doc.save('orden_de_compra.pdf');
};

export default generatePDF;
