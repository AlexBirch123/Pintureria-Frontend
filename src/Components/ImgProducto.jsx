import React, { useState } from "react";
import Modal from "react-modal";

export const ImgProducto = ({ producto }) => {
  const imgNotFound ="https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  const [hoverItem, setHoveredItem] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const input = document.getElementById("fileInput")

  const handleImg = async(prod) => {
    const formData = new FormData();
    formData.append("imagen", input.files[0]); 

    try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/upload", {
            method: "POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
              },
            body: formData, 
        });
        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (response.ok) {
            setMessage("Imagen subida con éxito");
            console.log("Imagen subida con éxito");
        } else {
            setMessage("Error al subir imagen: " + result.message);
            console.log("Error al subir imagen: " + result.message);
        }
    } catch (error) {
        setMessage("Error al subir imagen:", error);
        console.log("Error al subir imagen:", error);
    }
  };

  return (
    <td
      onDoubleClick={()=>{
        setIsOpen(true)
        setHoveredItem(false)
    }}
      onMouseEnter={() => {
        if (producto.imgUrl) setHoveredItem(producto.imgUrl);
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
          },
        }}
      >
        <input type="file" id="fileInput" />
        {producto.imgUrl ? 
        (
        <div>
            <img src={producto.imgUrl} alt="imagen" />
            <button onClick={()=>handleImg(producto)}>Guardar</button>
        </div>
        ) 
        : (<div>No hay imagenen cargada</div>)}
        <button
          onClick={() => {
            setIsOpen(false);
          }}
          >
          Cerrar
        </button>
      </Modal>
    </td>
  );
};
