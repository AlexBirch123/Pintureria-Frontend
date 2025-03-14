import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

export default function XLSXReader() {
  const [data, setData] = useState([]);
  const [suppliers,setSuppliers] = useState([]);
  const [categories,setCategories] = useState([]);
  const [selectedSupp,setSelectedSupp] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate()

useEffect(() => {
    const fetchData = async (url, localStorageKey, setState) => {
      const local = getLocalStorage(localStorageKey);
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + url, {
          credentials: "include",
        });
        if (!res.ok) return setState(local.datos);
        const data = await res.json();
        setState(data);
        setLocalStorage(data, localStorageKey);
      } catch (error) {
        if(local) setState(local.datos);     
      }
    };
    fetchData("/suppliers", "suppliers", setSuppliers);
    fetchData("/category", "category", setCategories);
  }, []);


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

  const handleDownloadFile = () => {
    const ws = XLSX.utils.json_to_sheet([
      { SKU: "", Titulo: "", Descripcion: "", Precio: "", Stock: ""},
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "Plantilla_Productos.xlsx");
  };

  const handleConfirm = async() => {
     const newList = data.map((d)=>{
        return {
          sku:d.SKU,
          title:d.Titulo,
          description:d.Descripcion,
          price:d.Precio,
          stock:d.Stock,
          idProv:Number(selectedSupp),
          idCat:Number(d.idCat)
        }
      })
    const productsArray = {productsArray:newList}
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/products",{
        credentials:"include",
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsArray),
      })
      if(!res.ok) return setMessage("error al ingresar los productos")
      setMessage("productos ingresados con exitos, redirigiendo a productos")
      setTimeout(()=>{
        setMessage(null)
        navigate("/productos")
      },3000)
    } catch (error) {
      setMessage("error al ingresar los productos")

    }
  };


  return (
    <div className="p-4 space-y-4 flex justify-center items-center min-h-screen">
      <div
        className="d-flex justify-content-between align-items-center mb-2"
        style={{ marginTop: "2%" }}
      >
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="border p-2 w-32 h-32 "
            style={{ marginTop: "8%" }}
          />
          <select
            name="idProv"
            id="idProv"
            className="form-select mt-2"
            onChange={(e) => setSelectedSupp(e.target.value)}
            required
          >
            <option value="">Proveedores</option>
            {suppliers.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={handleDownloadFile} className="btn btn-primary mt-3">
            Descargar Planilla
          </button>
        </div>
      </div>
      <div style={{ marginTop: "5%" }}>
        <h3>Productos seleccionados</h3>
        <table className="table table-sm table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>SKU</th>
              <th>Titulo</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.SKU}>
                  <td>{row.SKU}</td>
                  <td>{row.Titulo}</td>
                  <td>{row.Descripcion}</td>
                  <td>{row.Precio}</td>
                  <td>{row.Stock}</td>
                  <td>
                    {
                      <select
                        name="idCat"
                        id="idCat"
                        className="form-select mt-2"
                        onChange={(e) => setData(
                          data.map((d)=>
                          d.id === row.id ? {...d,idCat:Number(e.target.value)}: d
                        ))}
                        required
                      >
                        <option value="">Categoria</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.description}
                          </option>
                        ))}
                      </select>
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={handleConfirm} className="btn btn-success btn-sm mx-1">
          Confirmar
        </button>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
}
