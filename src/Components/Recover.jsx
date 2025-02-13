import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const Recover = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get('token');
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [passChanged,setPassChanged] = useState(false);
  // const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  // // const [role, setLocalRole] = useState("");
  const [message, setMessage] = useState("");
  // const {setIsAuthenticated,setRole } = useAuth()
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAndDeleteToken = async () => {
      try {
        //buscar si existe el token
        const res = await fetch(`http://localhost:8080/recover/${queryToken}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (data && data.email) {
          console.log(Date.now())
          const timeStamp = new Date(data.cretedAt).getTime()
          console.log(timeStamp)
          const timeToken = Date.now() - new Date(data.cretedAt).getTime();
          console.log(timeToken)
          if (timeToken < 900000) setEmail(data.email);
          else {
            setMessage("Token Invalido")
            setTimeout(()=> setMessage(null),5000)
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
    if (!(pass === pass2)) return setMessage("Las contraseñas no coinciden");
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
        setMessage("Contraseña modificada con exito, redirigiendo al login");
        setTimeout(() => navigate("/login"), 3000);
        await fetch(process.env.REACT_APP_API_URL + `/recover/${queryToken}`, {
          method: "DELETE",
          credentials: "include",
        });
      }
    } catch (error) {
      setMessage("Error en la solicitud");
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    const data = {
      email:email
    }
    try {
        const res = await fetch("http://localhost:8080/recover", {
          method:"POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if(res.ok) {
          setMessage(`Se envio un correo de recuperacion a ${email}`)
          setEmail(null)
        }else{
          setMessage("El correo electronico ingresado no esta ligado a un usuario existente")
          setTimeout(()=>setMessage(null),5000)
        }
    } catch (error) {
      setMessage(`Error al enviar correo de recuperacion a ${email}`)
      setTimeout(()=>setMessage(null),3000)
    }
  };

  return (
    <div>
    {token && email ? (
      <div className="container" style={{ maxWidth: "400px", marginTop: "200px" }}>
      <h2 className="text-center">Recuperacion de contraseña</h2>
      <form onSubmit={changePass}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nueva contraseña:
          </label>
          <input
            type="password"
            id="pass"
            className="form-control"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <label htmlFor="username" className="form-label">
            Repita contraseña:
          </label>
          <input
            type="password"
            id="pass2"
            className="form-control"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Enviar
        </button>
      </form>
      {message && <p className="text-danger text-center">{message}</p>}
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
      {message && <p className="text-danger text-center">{message}</p>}
    </div>)}
    </div>
);
};

export default Recover;
