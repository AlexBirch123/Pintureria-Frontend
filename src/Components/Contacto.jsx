import { useState } from "react";
import sucursal1 from "../utils/images/sucursal1.png"
import sucursal2 from "../utils/images/sucursal2.png"

const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", mensaje: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", formData);
  };

  const sucursales = [
    {
      nombre: "Arijon",
      direccion: "Av. Arijon 2185, Rosario, Santa Fe, CP2000",
      horarios: "Lu-Vi: 8:30 a 13:00 y 16:00 a 19:00 | Sa: 9:00 a 13:00",
      telefono: "3415 526 588",
      imagen: sucursal1, // Reemplazar con URL real
    },
    {
      nombre: "San Martín",
      direccion: "Av. San Martín 6001, Rosario, Santa Fe, CP2000",
      horarios: "Lu-Vi: 8:30 a 13:00 y 16:00 a 19:00 | Sa: 9:00 a 13:00",
      telefono: "3415 527 234",
      imagen: sucursal2, // Reemplazar con URL real
    },
  ];

return (
    <div className="container mx-auto p-6">
      <div className="d-flex justify-content-between mb-1" style={{marginTop:"5%"}}>
        <div className=" align-items-center mb-3">
          <h2 className="text-xl font-bold" style={{color:"white"}}>Nuestras Sucursales</h2>
          {sucursales.map((sucursal, index) => (
            <div>
                <h4 className="font-bold" style={{color:"white"}}>Sucursal {sucursal.nombre}</h4>
              <div key={index} className="d-flex justify-content-between p-4 rounded-lg shadow-lg mb-3" style={{maxWidth:"700px", color:"white"}}>
              <div className="align-items-center mb-3">
                <p><strong>Dirección:</strong> <br /> {sucursal.direccion}</p>
                <p><strong>Horarios:</strong> <br /> {sucursal.horarios}</p>
                <p><strong>Teléfono:</strong> <br /> {sucursal.telefono}</p>
              </div>
              <div className="align-items-end" style={{marginLeft:"5%"}}>
                <img style={{maxWidth:"80%"}} src={sucursal.imagen} alt={`Sucursal ${sucursal.nombre}`} className="mt-2 rounded-lg" />
              </div>
            </div>
            </div>
          ))}
        </div>
        <div className="d-flex flex-column align-items-end mb-3" style={{marginLeft:"6%"}}>
          <h2 className="text-3xl font-bold text-center">Contactanos</h2>
          <h3 className="text-xl font-bold">Formulario de Contacto</h3>
          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
              <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" required />
            </div>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full mt-4" required />
            <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder="Mensaje" className="border p-2 rounded w-full mt-4 h-32" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
