import React, { useState } from 'react';
import logo from '../Assets/Images/logo.jpeg'; // Logo de la app

function RecoverPassword() {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir la lógica para enviar el correo de recuperación
    console.log('Correo enviado a:', email);
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
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Volver
          </button>
          <button type="submit" className="btn-primary">
            Recuperar Contraseña
          </button>
        </div>
      </form>
    </div>
  );
}

export { RecoverPassword };
