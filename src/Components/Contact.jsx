import { useState } from "react";
import sucursal1 from "../utils/images/sucursal1.png"
import sucursal2 from "../utils/images/sucursal2.png"
import { useMediaQuery } from "react-responsive";

const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", mensaje: "" });
  const isMobile = useMediaQuery({ maxWidth: 768 });

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

return isMobile?(
  <div className="container mx-auto p-4 max-w-md md:max-w-2xl lg:max-w-4xl">
  <div className="flex flex-col md:flex-row justify-between mt-8">
    <div className="w-full md:w-2/3">
      <h2 className="text-xl font-bold text-white mb-4">Nuestras Sucursales</h2>
      {sucursales.map((sucursal, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-bold text-white">Sucursal {sucursal.nombre}</h4>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white flex flex-col md:flex-row items-start">
            <div className="w-full md:w-1/2">
              <p><strong>Dirección:</strong> <br /> {sucursal.direccion}</p>
              <p><strong>Horarios:</strong> <br /> {sucursal.horarios}</p>
              <p><strong>Teléfono:</strong> <br /> {sucursal.telefono}</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0" style={{width:"50%"}}>
              <img className="w-full max-w-xs md:max-w-sm rounded-lg" src={sucursal.imagen} alt={`Sucursal ${sucursal.nombre}`} style={{width:"100%"}} />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="w-full md:w-1/3 mt-8 md:mt-0 text-white">
      <h2 className="text-2xl font-bold text-center">Contáctanos</h2>
      <h3 className="text-xl font-bold text-center">Formulario de Contacto</h3>
      <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg mt-4">
        <div className="flex flex-col gap-4" style={{marginBottom:"5%"}}>
          <input name="nombre" style={{marginBottom:"1%"}} value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="form-control w-full p-2 rounded" required />
          <input name="apellido" style={{marginBottom:"1%"}}value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="form-control w-full p-2 rounded" required />
          <input name="email" type="email" style={{marginBottom:"1%"}}value={formData.email} onChange={handleChange} placeholder="Email" className="form-control w-full p-2 rounded" required />
          <textarea name="mensaje"style={{marginBottom:"1%"}} value={formData.mensaje} onChange={handleChange} placeholder="Mensaje" className="form-control w-full p-2 rounded h-32" required />
          <button type="submit" className="btn btn-primary w-full">Enviar</button>
        </div>
      </form>
    </div>
  </div>
</div>
  ):(
    <div className="container mx-auto p-6">
      <div className="d-flex justify-content-between mb-1" style={{marginTop:"5%"}}>
        <div className=" align-items-center ">
          <h2 className="text-xl font-bold" style={{color:"white"}}>Nuestras Sucursales</h2>
          {sucursales.map((sucursal, index) => (
            <div>
                <h4 className="font-bold" style={{color:"white"}}>Sucursal {sucursal.nombre}</h4>
              <div key={index} className="d-flex p-4 rounded-lg shadow-lg mb-3" 
              style={{maxWidth:"700px", color:"white", display:"flex"}}>
              <div style={{alignItems:"start", width:"700px"}}>
                <p><strong>Dirección:</strong> <br /> {sucursal.direccion}</p>
                <p><strong>Horarios:</strong> <br /> {sucursal.horarios}</p>
                <p><strong>Teléfono:</strong> <br /> {sucursal.telefono}</p>
              </div>
              <div style={{marginLeft:"5%", alignItems:"end"}}>
                <img style={{width:"350px"}} src={sucursal.imagen} alt={`Sucursal ${sucursal.nombre}`} className="mt-2 rounded-lg" />
              </div>
            </div>
            </div>
          ))}
        </div>
        <div className="d-flex flex-column align-items-end mb-3" style={{marginLeft:"6%", color:"white", marginRight:"5%"}}>
          <h2 className="text-3xl font-bold text-center">Contactanos</h2>
          <h3 className="text-xl font-bold">Formulario de Contacto</h3>
          <form onSubmit={handleSubmit} style={{width:"600px"}}>
            <div className="mt-3 p-3 border rounded bg-light ">
              <div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-between", marginTop	:"2%"}}>
               <div style={{width:"280px"}}>
                 <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="form-control" required />
               </div>
               <div style={{width:"280px"}} >
                 <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="form-control" required />
              </div>
            </div>
            <div >
              <div style={{width:"100%", marginTop:"2%"}} >
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-control" required />
              </div>
              <div>
                <textarea name="mensaje" style={{width:"100%", height:"150px"}} value={formData.mensaje} onChange={handleChange} placeholder="Mensaje" className="border p-2 rounded w-full mt-4 h-32" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary me-2" >Enviar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
