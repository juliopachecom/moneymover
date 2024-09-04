import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logo from '../Assets/Images/logo.jpeg';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phonePrefix: '+34',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const openModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleSubmit = () => {
    closeModal();
    console.log('User data:', formData);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={openModal}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="register-logo" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">Nombres</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Nombres"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Apellidos</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Apellidos"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group phone-group">
  <label htmlFor="phone">Teléfono</label>
  <div className="d-flex phone-container">
    <select
      name="phonePrefix"
      id="phonePrefix"
      value={formData.phonePrefix}
      onChange={handleChange}
      className="phone-prefix"
    >
      <option value="+34">🇪🇸 +34</option>
      <option value="+1">🇺🇸 +1</option>
    </select>
    <input
      type="text"
      name="phone"
      id="phone"
      placeholder="Número de teléfono"
      value={formData.phone}
      onChange={handleChange}
      required
    />
  </div>
</div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="termsAccepted"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
          />
          <label htmlFor="termsAccepted">Acepto los términos y condiciones</label>
        </div>
        <div className="button-group">
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Volver
          </button>
          <button type="submit" className="btn-primary">
            Continuar
          </button>
        </div>
      </form>

      <Modal isOpen={modalIsOpen} toggle={closeModal} centered>
        <ModalHeader toggle={closeModal}>Confirmación de Datos</ModalHeader>
        <ModalBody>
          <p><strong>Correo electrónico:</strong> {formData.email}</p>
          <p><strong>Nombres:</strong> {formData.firstName}</p>
          <p><strong>Apellidos:</strong> {formData.lastName}</p>
          <p><strong>Teléfono:</strong> {formData.phonePrefix} {formData.phone}</p>
          <p><strong>Contraseña:</strong> {formData.password}</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn-secondary" onClick={closeModal}>
            Editar
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Confirmar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export { Register };
