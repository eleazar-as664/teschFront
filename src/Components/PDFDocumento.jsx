import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (data) => {
  const doc = new jsPDF();

  const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      useGrouping: true
    }).format(value);

    return formattedValue;
  };

  const numberTemplate = (data) => {
    return formatCurrency(data);
  };


  const dataREP = [
        {          
          descripcion: {
                      content: "ORDEN DE COMPRA",
                      styles: { valign: 'middle', fontSize:'10', halign: 'center', fillColor : [255,255,255],  },
                      }
        },
        {
          descripcion: {
            content: data.BusinessName,
            styles: { valign: 'middle', fontSize:'12', fontStyle: 'bold', halign: 'center', fillColor : [255,255,255],  },
            }
        },
        {
          descripcion: {
            content: data.Address,
            styles: { valign: 'middle', fontSize:'8', halign: 'center', fillColor : [255,255,255],  },
            }
        },
        {
          descripcion: {
            content: data.LicTradNum,
            styles: { valign: 'middle', fontSize:'10', fontStyle: 'bold', halign: 'center', fillColor : [255,255,255],  },
            }
        }
    ];
  
  function addTableToPDF(data, codigo, doc, startY) {
      var body = []
      for (var i = 0; i <data.length; i++) {
      var row = []
      if (i == 0) {
        row.push({
          rowSpan: data.length,
          content: codigo,
          styles: { valign: 'middle', halign: 'center', fillColor : [255,255,255] },
        });
      } 
      for (var key in data[i]) {
        row.push(data[i][key]);
      }
      body.push(row);
      }
      doc.autoTable({
        startY: startY,
        body: body,
        columnStyles:{
                      0: {cellWidth: 60, halign: "center"}
                    },
        margin:{top:70,left:25}
      }
      );
      return doc.lastAutoTable.finalY + 15;  
    }
    addTableToPDF(dataREP, "", doc, 5);

   doc.autoTable({
          startY: doc.lastAutoTable.finalY + 5,
          theme: "grid",
          margin: {let: 0},
          columnStyles: { col1_header: { 
                                        fontSize:'10', halign: 'center',  font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 85
                                      },
                          col2_header: { fontSize:'10', halign: 'center', font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 97 }
                        },
          body: [
              { col1_header: 'Datos del proveedor', 
                col2_header: 'Información general del pedido'
              },
          ],
          columns: [
              { dataKey: 'col1_header' },
              { dataKey: 'col2_header' },
          ],
      });

      //////////////////// tabla de contenido  
      doc.autoTable({
        startY: doc.lastAutoTable.finalY,
        theme: "grid",
        columnStyles: { 0: { fontSize:'8', font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 85},
                        1: { fontSize:'8', font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 38},
                        2: { fontSize:'8', font:'helvetica', fillColor: [255,255,255], cellWidth: 59},
                      },
        body: [
            ['Proveedor:', 'No. de orden de compra:', data.DocNum],
            [data.CardName, 'Fecha contable:', data.DocDate],
            ['RFC:', 'Fecha de entrega:', data.DocDueDate],
            [data.BusinessPartnerLicTradNum , 'Comprador:', data.FirstName +' '+ data.MiddleName +' '+ data.LastName],
            ['Dirección:', 'Condición de pago:', data.BusinessPartnerPymntGroup],
            [data.BusinessPartnerAddress, 'Descuento:', '%']
        ],
    });


      // Agregar tabla de detalles
      const detailsData = data.details || [];
      const detailsTableData = detailsData.map(item => [
        item.ItemCode || '',
        item.Description || '',
        item.OcrCode || '',
        item.Quantity || '',
        item.BuyUnitMsr || '',
        numberTemplate(item.PriceByUnit) +' MXP' || '',
        numberTemplate(item.PriceByUnit * item.Quantity) +' MXP'
      ]);
    
    
      doc.setFont('helvetica');
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [['Código Artículo', 'Descripción de Producto', 'C/Costos', 'Cantidad', 'U/Medida','Precio Unitario', 'Importe Neto']],
        body: detailsTableData,
        theme: "grid",
        styles: {
          fontSize: 6,
          valign: 'middle',
          halign: 'center'
        },
        headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.2 },
      });
    

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 2,
        theme: "grid",
        columnStyles: { 0: { fontSize:'8', font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 35, lineWidth : 0},
                        1: { fontSize:'8', font:'helvetica', fillColor: [255,255,255], cellWidth: 77, lineWidth : 0},
                        2: { fontSize:'8', font:'helvetica', fontStyle: 'bold',fillColor: [255,255,255], cellWidth: 35, halign: 'right'},
                        3: { fontSize:'8', font:'helvetica', fillColor: [255,255,255], cellWidth: 35, halign: 'right'},                        
                      },
        body: [
            ['Forma de pago:', data.U_FormaPago33, 'Subtotal',numberTemplate(data.Subtotal) +' MXP'],
            ['Uso CFDI:', data.U_UsoCFDI, 'Ret. IVA:','0.0 MXP'],
            ['Metodo de pago:', data.U_MetodoPago33, 'Ret. ISR:','0.0 MXP']
        ],
    });      

    doc.autoTable({
      startY: doc.lastAutoTable.finalY,
      theme: "grid",
      columnStyles: { 0: { fontSize:'8', font:'helvetica', fontStyle: 'bold', fillColor: [255,255,255], cellWidth: 112, lineWidth : 0},
                      1: { fontSize:'8', font:'helvetica', fontStyle: 'bold',fillColor: [255,255,255], cellWidth: 35, halign: 'right'},
                      2: { fontSize:'8', font:'helvetica', fillColor: [255,255,255], cellWidth: 35, halign: 'right'},                        
                    },
      body: [
          ['Referencia de documento:', 'Impuesto:',numberTemplate(data.IVA) +' MXP'] ,
          [ data.NumAtCard, 'Total documento:', numberTemplate(data.Total) +' MXP'],
      ],
  });  

    let startY = doc.lastAutoTable.finalY;
    doc.setFontSize(8); // Tamaño de fuente para el título de la sección
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text('Dirección de envío:', 16, startY + 5); // Título de la sección

    doc.setFontSize(8); // Tamaño de fuente para el título de la sección
    doc.setFont('helvetica', 'normal');
    doc.text(data.DireccionEnvio, 16, startY + 10); // Título de la sección

    startY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(8); // Tamaño de fuente para el título de la sección
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text('Comentarios:', 16, startY + 5); // Título de la sección

    doc.setFontSize(8); // Tamaño de fuente para el título de la sección
    doc.setFont('helvetica', 'normal');
    doc.text(data.Comments, 16, startY + 10); // Título de la sección



    const addFooters = doc => {
      const pageCount = doc.internal.getNumberOfPages()
    
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Página ' + String(i) + ' de ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
          align: 'center'
        })
      }
    }

    addFooters(doc)

  //  doc.addImage('data:image/png;base64,'+ data.LogoPath, 'PNG', 32, 1);

  if (data.LogoPath != '' )
    {
        const imgProps= doc.getImageProperties('data:image/png;base64,'+ data.LogoPath);
        const pdfWidth = 50;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage('data:image/png;base64,'+ data.LogoPath, 'PNG', 30, 5, pdfWidth, pdfHeight);
    }
  // Guardar el PDF
  doc.save('orden_de_compra.pdf');
};

export default generatePDF;
