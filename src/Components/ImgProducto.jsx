import React, { useState } from "react";
import Modal from "react-modal";

export const ImgProducto = ({ producto }) => {
  const imgNotFound ="https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  const [hoverItem, setHoveredItem] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [image, setImage] = useState(false);
  const input = document.getElementById("fileInput")
  const imgUrl = process.env.REACT_APP_API_URL + `/uploads/` + producto.imgUrl

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(String(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImg = async(prod) => {
    if (!image) {
      setMessage("No hay imagen cargada")
      setTimeout(()=>setMessage(null),3000)
      return
    }
    const formData = new FormData();
    formData.append("imagen", input.files[0]); 

    try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/upload", {
            method: "POST",
            credentials:"include",
            body: formData, 
        });
        const result = await res.json();
        if(!result.file){
          setMessage("Error a subir la imagen");
          setTimeout(()=> setMessage(null),200)
          return
        }
        const imgUrl = {imgUrl:result.file}
        const response = await fetch(process.env.REACT_APP_API_URL + `/Products/${producto.id}`, {
          method: "PATCH",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imgUrl), 
      });
      if(!response.ok){
          setMessage("error al actualizar imagen")
          setTimeout(()=> setMessage(null),200)  
          return
        } 
      setMessage("Imagen cargada con exito")
      setTimeout(()=> {
        setMessage(null)
        setIsOpen(false)
        setImage(false)
      },200)
    } catch (error) {
        setMessage("Error al subir imagen:", error);
        setTimeout(()=> setMessage(null),200)
    }
  };

  return (
    <td
      onDoubleClick={() => {
        setIsOpen(true);
        setHoveredItem(false);
        setMessage(null)
      }}
      onMouseEnter={() => {
        if (producto.imgUrl) return setHoveredItem(imgUrl);
        setHoveredItem(imgNotFound);
      }}
      onMouseLeave={() => setHoveredItem(null)}
      style={{ padding: "10px", cursor: "pointer", position: "relative" }}
    >
      {producto.imgUrl ? "True" : "False"}
      {hoverItem && (
        <div
          style={{ position: "absolute", left: "100%", top: "0", zIndex: 10 }}
        >
          <img
            src={hoverItem}
            alt="Imagen"
            style={{
              width: "100px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
              borderRadius: "5px",
            }}
          />
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            width: "50%",
            height: "50%",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input type="file" id="fileInput" name="imagen" accept="image/*" onChange={handleImageChange} className="border p-2 w-32 h-32 "/>
          {image || producto.imgUrl ? (
            <>
              <img src={imgUrl? imgUrl: image} 
              alt="imagen" 
              style={{ width: "50%", marginTop:"2%" }} 
              />
            </>):
            (<div style={{ margin: "20%", justifyContent: "center" }}>No hay imagen cargada</div>)}
        
          {message && <p className="text-danger text-center mt-2">{message}</p>}
          <div style={{ display: "flex",justifyContent:"space-between", marginTop:"1%" }}>
           <div>
             <button className="btn btn-success btn-sm mx-1" onClick={() => handleUploadImg(producto)}>Guardar</button>
           </div>
           <div >
             <button
               className="btn btn-danger btn-sm"
               style={{ marginTop: "1%", width: "100%" }}
               onClick={() => {
                 setIsOpen(false);
                 setImage(null);
               }}
               onBlur={() => {
                setIsOpen(false);
                setImage(null);
              }}
             >
               Cerrar
             </button>
           </div>
          </div>
          
        </div>
      </Modal>
    </td>
  );
};
