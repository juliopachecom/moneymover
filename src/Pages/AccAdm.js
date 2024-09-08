import React, { useState } from "react";
import logo from "../Assets/Images/logo.jpeg"; // Cambia el logo para el administrador si es necesario
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function AccAdm() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [admin_email, setAdmin_email] = useState("");
  const [admin_password, setAdmin_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(`${url}/Auth/loginAdmin/${email}/${password}`);
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(`${url}/Auth/findByTokenAdmin/${response.data.data.access_token}`);
      setLogged(true);
      history.push({
        pathname: "/AdminDashboard",
        state: {
          user: response2.data,
        },
      });
      return true; // Éxito en la autenticación
    } catch (error) {
      toast.error("Ocurrió un error durante el inicio de sesión. Por favor, verifica los datos e intenta nuevamente.");
      return false; // Fallo en la autenticación
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (attempts === 0) {
      setError("Has superado el número de intentos. Intenta más tarde.");
      setAlertVisible(true);
      return;
    }

    try {
      setLoading(true);
      const success = await fetchData(admin_email, admin_password);

      if (!success) {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (attempts <= 1) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
        setAttempts(0); // Evitar más acciones
      } else {
        setAttempts(attempts - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${attempts - 1}`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <img src={logo} alt="Admin Logo" className="admin-logo" />
        </div>
        <h2 className="admin-title">Administrador</h2>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            value={admin_email}
            onChange={(e) => setAdmin_email(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Contraseña"
              value={admin_password}
              onChange={(e) => setAdmin_password(e.target.value)}
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
        </div>
        {alertVisible && <div className="alert">{error}</div>}
        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={loading || attempts === 0}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
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

export { AccAdm };
