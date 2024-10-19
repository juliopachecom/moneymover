import React, { useState } from "react";
import logo from "../Assets/Images/logo.jpeg"; // Logo de la app
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function RecoverPassword() {
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { url } = useDataContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${url}/Mailer/emailRecovery/${email}`);
      setEmail("");
      toast.success(
        "¡Correo de recuperación enviado con éxito! Revisa tu bandeja de entrada."
      );
      setTimeout(() => {
        history.push("/Login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Error al enviar el correo de recuperación. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-container">
      <form className="recover-form" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="recover-logo" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Introduce tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
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

export { RecoverPassword };