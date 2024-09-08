import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import logo from "../Assets/Images/logo.jpeg";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function RecoverUpdate() {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState([]);
  const [use_password, setUse_Password] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useDataContext();
  const { id, email } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (use_password.length < 8) {
      toast.error("La contraseña debe contener al menos 8 caracteres.");
      return;
    }
    if (confirmPassword !== use_password) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (email !== userEmail.use_email || parseInt(id) !== userEmail.use_id) {
      toast.error("Los datos no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${url}/Users/PasswordRecovery/${id}`, {
        use_password,
      });
      toast.success(
        "Contraseña recuperada con éxito. Redirigiendo al login..."
      );
      setTimeout(() => {
        history.push("/Login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(
        "Error al recuperar la contraseña. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users/email/${email}`);
      setUserEmail(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [email, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="recover-update-container">
      <form className="recover-update-form" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="recover-update-logo" />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Nueva contraseña"
              value={use_password}
              onChange={(e) => setUse_Password(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="btn-primary">
            {loading ? "Enviando..." : "Recuperar"}
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

export { RecoverUpdate };