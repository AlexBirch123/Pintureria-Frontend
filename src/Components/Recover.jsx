import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import validatePassword from "../utils/validationPass";

const Recover = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get('token');
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAndDeleteToken = async () => {
      try {
        //buscar si existe el token
        const res = await fetch(process.env.REACT_APP_API_URL + `/recover/${queryToken}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (data && data.email) {
          const timeToken = Date.now() - new Date(data.createdAt).getTime();
          console.log(timeToken)
          if (timeToken < 900000) setEmail(data.email);
          else {
            setToken(null)
            setErrorMessage("Token Invalido")
            setTimeout(()=> setErrorMessage(null),5000)
          }
        }

        //eliminar tokens expirados
        if(email){
          const res = await fetch(process.env.REACT_APP_API_URL + `/recover/${email}`, {
            credentials: "include",
          });
          const data = await res.json();
          if (data) {
            for (const t of data) {
              const timeToken = Date.now() - new Date(t.cretedAt).getTime();
              if (timeToken > 900000){
                await fetch(
                  process.env.REACT_APP_API_URL + `/recover/${t.id}`,
                  {
                    method: "DELETE",
                    credentials: "include",
                  }
                );
              } 
            }
          }
        }

      } catch (error) {
        console.log(error);
      }
    };
    if (queryToken) {
      setToken(queryToken);
      fetchAndDeleteToken();
    }
  }, [queryToken]);

  const changePass = async (e) => {
    e.preventDefault();
    if (!(pass === pass2)) {  
      setErrorMessage("Las contraseñas no coinciden")
      return setTimeout(() => {setErrorMessage(null)}, 3000);
    };
    const data = {
      pswHash: pass,
      email: email,
    };
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + `/users`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccessMessage("Contraseña modificada con exito, redirigiendo al login");
        setTimeout(() => navigate("/login"), 3000);
        await fetch(process.env.REACT_APP_API_URL + `/recover/${queryToken}`, {
          method: "DELETE",
          credentials: "include",
        });
      }
    } catch (error) {
      setErrorMessage("Error en la solicitud");
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    const data = {
      email:email
    }
    try {
        const res = await fetch( process.env.REACT_APP_API_URL+ "/recover", {
          method:"POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if(res.ok) {
          setSuccessMessage(`Se envio un correo de recuperacion a ${email}`)
          setEmail(null)
        }else{
          setErrorMessage("El correo electronico ingresado no esta ligado a un usuario existente")
          setTimeout(()=>setErrorMessage(null),5000)
        }
    } catch (error) {
      setSuccessMessage(`Error al enviar correo de recuperacion a ${email}`)
      setTimeout(()=>setSuccessMessage(null),3000)
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center " style={{marginTop:"5%"}}>
    {token && email ? (
      <div className="w-100 p-4" style={{ maxWidth: "450px" }}>
      <h2 className="text-center mb-4">Recuperacion de contraseña</h2>
      <form onSubmit={changePass} className="card p-4 shadow">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nueva contraseña:
          </label>
          <div className="input-group">
          <input
            type={showPassword ?"text":"password"}
            id="pass"
            className="form-control"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value)
              validatePassword(e.target.value)
            }}
            onFocus={()=>setSuccessMessage("-6 digitos como minimo /br -Minimo 1 mayuscula /br -Minimo 1 minuscula /br -Minimo un número ")}
            />
          <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

          </div>
          <label htmlFor="username" className="form-label">
            Repita contraseña:
          </label>
          <div className="input-group">

          <input
            type={showPassword ?"text":"password"}
            id="pass2"
            className="form-control"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
          />
          <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Enviar
        </button>
      </form>
      {successMessage && <p className="text-success text-center">{successMessage}</p>}
      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
    </div>
    ):(
    <div className="container" style={{ maxWidth: "400px", marginTop: "200px" }}>
      <h2 className="text-center">Recuperacion de contraseña</h2>
      <form onSubmit={handleRecover}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Correo electronico:
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Enviar
        </button>
      </form>
      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
      {successMessage && <p className="text-success text-center">{successMessage}</p>}
    </div>)}
    </div>
);
};

export default Recover;
