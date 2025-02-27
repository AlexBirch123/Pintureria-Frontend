import React, { useRef, useState } from "react";
import Modal from "react-modal";

export const CreatCategory = ({ categorias, setcategorias }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const catRef = useRef()

  const addCategory = async()=>{
    const desc = catRef.current.value
    const existingCat = categorias.find((cat)=> cat.description === desc)
    if(existingCat){
      catRef.current.value = ""
      setMessage("La categoria ya existe")
      setTimeout(()=>setMessage(null),3000)
      return
    }
    const newCat={description:desc}
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/category", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCat),
      });
      if(res.ok){
        const data = await res.json()
        setcategorias([...categorias, data])
        setMessage("Categoria creada con exito")
        setTimeout(()=>{
          setMessage(null)

          setIsOpen(false)
        },3000)  
      }else {
        setMessage("error al crear la categoria")
        setTimeout(()=>setMessage(null),3000)
      }
    } catch (error) {
      console.log(error)
      setMessage("error al crear la categoria")
      setTimeout(()=>setMessage(null),3000)
    }
  }

  return (
    <div style={{ marginTop: "7px" }}>
      <button onClick={() => { setIsOpen(true); }} className="btn btn-primary">
        Agregar categoria
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            width: "30%",
            height: "30%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div>
          <h2>Nueva categoria</h2>
          <input 
          type="text" 
          placeholder="Nombre de la categoria" 
          ref={catRef}
          className="form-control"
          style={{width:"100%"}}/>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={addCategory} className="btn btn-success">
            Guardar
          </button>
          <button
            onClick={() => {
              setIsOpen(false)
              setMessage(null)
            }}
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
          >
            Cerrar
          </button>
          {message && <p>{message}</p>}
        </div>
      </Modal>
    </div>
  );
};
