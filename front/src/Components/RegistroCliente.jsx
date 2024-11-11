// src/RegistroCliente.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    pswHash: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const postUser = async () => {
    try {
      const res = await fetch(`http://localhost:8080/allUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      setMessage("Error al crear nuevo usuario");
      return error;
    }
  };

  const validateData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/allUsers/email/${formData.email}`
      );
      const email = await res.json();
      if (!email) {
        const response = await fetch(
          `http://localhost:8080/allUsers/name/${formData.userName}`
        );
        const name = await response.json();
        if (!name) {
          return name;
        } else {
          setMessage("Nombre de usuario existente");

          return name;
        }
      } else {
        setMessage("Email existente");
        return email;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valido = await validateData();
    console.log(valido);
    console.log("1");
    if (!valido) {
      const data = postUser();
      if (data) {
        console.log(true);
        // Mostrar mensaje de éxito y redirigir al login después de unos segundos
        setSubmitted(true);
        setTimeout(() => {
          navigate("/login"); // Redirigir al login
        }, 2000); // Redirigir después de 2 segundos
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nombre de Usuario:
              </label>
              <input
                type="text"
                id="username"
                name="userName"
                className="form-control"
                placeholder="Cree su nombre de usuario"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                name="pswHash"
                className="form-control"
                placeholder="Cree su contraseña"
                value={formData.pswHash}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
          {submitted && (
            <div className="alert alert-success mt-3" role="alert">
              ¡Cliente registrado con éxito! Redirigiendo al inicio de sesión...
            </div>
          )}
          {message && <p className="text-danger text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;