import { useState } from "react";
import * as XLSX from "xlsx";

export default function XLSXReader() {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Titulo: "", descripcion: "",Precio: "", Stock: ""  },    
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Productos.xlsx");
  };

  const handleConfirm = () => {
    console.log("Productos confirmados:", data);
    // Aquí podrías hacer la petición a la API para cargar los productos en la base de datos
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4" style={{marginTop:"10%"}}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="border p-2" />
        <button onClick={handleDownloadTemplate}>Descargar Planilla</button>
      </div>

      {data.length > 0 && (
        <div>
          <table>
            <thead>
                <tr>
                    <th>Titulo</th>
                    <th>Descripcion</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                {data.map(()=>{
                <tr>
                    <td>Titulo</td>
                    <td>Descripcion</td>
                    <td>Precio</td>
                    <td>Stock</td>
                </tr>

                })}
            </tbody>
            {/* <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody> */}
          </table>
          <button onClick={handleConfirm} className="mt-4">Confirmar</button>
        </div>
      )}
    </div>
  );
}
