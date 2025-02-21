import { useState } from "react";
import * as XLSX from "xlsx";

export default function XLSXReader() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);

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
      console.log(data)
    };
  };

  const handleDownloadFile = () => {
    const ws = XLSX.utils.json_to_sheet([
      { SKU:"",Titulo: "", descripcion: "",Precio: "", Stock: ""  },    
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Productos.xlsx");
  };

  const handleConfirm = async() => {
    console.log("Productos confirmados:", data);
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/products",{
        credentials:"include",
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if(!res.ok) return setMessage("error al ingresar los productos")
      setMessage("productos ingresados con exitos, redirigiendo a productos")
      setTimeout(()=>setMessage(null),3000)
    } catch (error) {
      console.log("error al ingresar los productos", error)
      setMessage("error al ingresar los productos")

    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4" style={{marginTop:"10%"}}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="border p-2" />
        <button onClick={handleDownloadFile}>Descargar Planilla</button>
      </div>
        <div>
          <table>
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Titulo</th>
                    <th>Descripcion</th>
                    <th>Precio</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
          {data.length > 0 ? (
                data.map((d) => (
                <tr key={d.SKU}>
                    <td>{d.SKU}</td>
                    <td>{d.Titulo}</td>
                    <td>{d.descripcion}</td>
                    <td>{d.Precio}</td>
                    <td>{d.Stock}</td>
                </tr>
                ))
              ): <p>No hay productos en la lista</p>}
              </tbody>
            </table>
            <button onClick={handleConfirm} className="mt-4">Confirmar</button>
          </div>
    </div>
  );
}
