import React, { useRef, useState } from "react";
import Modal from "react-modal";

export const CreatCategory = ({ categorias, setcategorias }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [change, setChange] = useState(true);
  const [message, setMessage] = useState(false);
  const [categories, setCategories] = useState(categorias);
  const [image, setImage] = useState(null);
  const input = document.getElementById("fileInput")

  const [selectedCat, setSelectedCat] = useState(null);
  const catRef = useRef();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(String(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const addCategory = async () => {

    //Busca si la categoria ya existe
    const desc = catRef.current.value;
    const existingCat = categorias.find((cat) => cat.description === desc);
    if (existingCat) {
      catRef.current.value = "";
      setMessage("La categoria ya existe");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    //agrega la imagen a un formData
    const formData = new FormData();
    formData.append("imagen", input.files[0]); 

    //sube la imagen a la carpeta uploads
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/upload", {
        method: "POST",
        credentials:"include",
        body: formData, 
      });
      if(!response.ok) return setMessage("error al subir la imagen")
      const data = await response.json()
      const newCat = { 
        description: desc,
        imgUrl: data.file,
       };
      //crea la nueva categoria con la url de la imagen y la descipcion
      const res = await fetch(process.env.REACT_APP_API_URL + "/category", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        const data = await res.json();
        setcategorias([...categorias, data]);
        setMessage("Categoria creada con exito");
        setTimeout(() => {
          setMessage(null);

          setIsOpen(false);
        }, 3000);
      } else {
        setMessage("error al crear la categoria");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.log(error);
      setMessage("error al crear la categoria");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateCategory ={
    
  }

  return (
    <div style={{ marginTop: "7px" }}>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="btn btn-primary"
      >
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
          <button onClick={() => {
            setChange(!change)
            setImage(null)
          }}>
            {change ? "Modificar categoria" : "Crear Categoria"}
          </button>
        </div>
        {change ? (
          <div>
            <div>
              <h2>Nueva categoria</h2>
              <input
                type="text"
                placeholder="Nombre de la categoria"
                ref={catRef}
                className="form-control"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <input
                type="file"
                id="fileInput"
                name="imagen"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 w-32 h-32 "
              />
              {image ? (
                <>
                  <img
                    src={image}
                    alt="imagen"
                    style={{ width: "50%", marginTop: "2%" }}
                  />
                </>
              ) : (
                <div style={{ margin: "20%", justifyContent: "center" }}>
                  No hay imagen cargada
                </div>
              )}
              <button onClick={addCategory} className="btn btn-success">
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessage(null);
                }}
                className="btn btn-secondary"
                style={{ marginLeft: "10px" }}
              >
                Cerrar
              </button>
              {message && <p>{message}</p>}
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h2>Modificar categoria</h2>
              <select
                name="cat"
                id="cat"
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                <option value="">Categorias</option>
                {categories.map((cat) => {
                  return <option value={cat.id}> {cat.description} </option>;
                })}
              </select>
              <input
                type="file"
                id="fileInput"
                name="imagen"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 w-32 h-32 "
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <button onClick={updateCategory} className="btn btn-success">
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessage(null);
                }}
                className="btn btn-secondary"
                style={{ marginLeft: "10px" }}
              >
                Cerrar
              </button>
              {message && <p>{message}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
