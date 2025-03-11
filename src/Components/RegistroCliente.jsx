import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import validatePassword from "../utils/validationPass";
import { Eye, EyeOff } from "lucide-react";

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    pswHash: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusPass, setFocusPass] = useState(false);
  const [valid, setValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const validPass = validatePassword(formData.pswHash)
    if(!validPass) {
      setMessage("Contraseña invalida")
      setTimeout(()=> setMessage(null),3000)
      return null
    }
      
      try {
      const res = await fetch(process.env.REACT_APP_API_URL + `/register`, {
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
      const res = await fetch(process.env.REACT_APP_API_URL + `/users/email/${formData.email}`);

      if (res.status === 200) {
        setMessage("Email existente");
        setTimeout(()=> setMessage(null),3000)
        return true
      }
      const response = await fetch(process.env.REACT_APP_API_URL + `/users/name/${formData.userName}`);


      if (response.status === 200){
        setMessage("Nombre de usuario existente");
        setTimeout(()=> setMessage(null),3000)
        return true
      }

      return false;

    } catch (error) {
      setMessage("error en la validacion de los datos")
        setTimeout(() => {
          setMessage(null);
        }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valido = await validateData();
    if (!valido) {
      postUser().then(data =>{
        if (data) {
          setSubmitted(true);
          setTimeout(() => {navigate("/login");}, 4000); 
        }
      }
    );
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "80px" }}>
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
              <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="pswHash"
                className="form-control"
                placeholder="Cree su contraseña"
                value={formData.pswHash}
                onChange={ (e)=>{
                  handleChange(e)
                  if(validatePassword(e.target.value))setValid(true)
                } }
                onFocus={()=>setFocusPass(true)}
                onBlur={()=>setFocusPass(false)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowPassword(!showPassword)
                  setFocusPass(true)
                  }
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
          {submitted && (
            <div className="alert alert-success mt-3" role="alert">
              ¡Cliente registrado con éxito! Redirigiendo al inicio de sesión...
            </div>       
          )
          }
          {focusPass && (
            valid ? (
              <div className="alert alert-success mt-3" role="alert">
            Contraseña valida 
           </div>
            ):(
            
              <div className="alert alert-danger mt-3" role="alert">
            -Minimo 6 digitos <br /> -Minimo una mayuscula <br /> -Minimo una minuscula <br /> -Minimo un número 
            </div>
            )
            
          )
          }
          {message && <p className="text-danger text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
