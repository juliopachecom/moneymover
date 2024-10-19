import React, { useState } from 'react';
import logo from '../Assets/Images/logo.jpeg'; // Asegúrate de tener tu logo en la carpeta correcta
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [tkn, setTkn] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(
        `${url}/Auth/login/${email}/${password}`
      );
      // console.log(response)
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(
        `${url}/Auth/findByToken/${response.data.data.access_token}`
      );
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Changes",
        state: {
          user: tkn,
        },
      });
    } catch (error) {
      toast.error(
        "Ocurrió un error durante el inicio de sesión. Por favor, verifica los datos e intenta nuevamente."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await fetchData(user, password);
      if (!success) {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (attemps <= 1) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
        setAttemps(0);
      } else {
        setAttemps(attemps - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${
          attemps - 1
        }`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-logo" />
        <div className="form-group">
          <input
            type="email"
            id="user"
            placeholder="Email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {alertVisible && <div className="alert">{error}</div>}
        <a href="/Recoverpassword" className="forgot-password">Olvidé la contraseña</a>
        <button type="submit" className="login-button">Login</button>
        <div className="login-options">
          <span>¿No tienes una cuenta?</span> <a href="/register">Regístrate</a>
        </div>
      </form>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export { Login };