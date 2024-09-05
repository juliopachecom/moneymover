import React, { useState } from 'react';
import { FaEdit, FaSignOutAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import profileIcon from '../Assets/Images/profileicon.png';
import { NavBarUser } from '../Components/NavBarUser';

function Profile() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState('usuario@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(profileIcon);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (isEditingPassword && newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setShowConfirmationModal(true);
  };

  const confirmChanges = () => {
    setShowConfirmationModal(false);
    setShowResultModal(true);
    setIsSuccess(Math.random() > 0.5); // Aleatoriamente, éxito o error.
    setTimeout(() => {
      setShowResultModal(false);
      setIsEditingEmail(false);
      setIsEditingPhone(false);
      setIsEditingPassword(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  const handleCancelEdit = () => {
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingPassword(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="profile-page">
      <div className="profile">
      <NavBarUser />
        <h1>Perfil del Usuario</h1>

        <div className="profile__container">
          {/* Foto de perfil */}
          <div className="profile__photo-wrapper">
            <img src={profilePhoto} alt="Profile" className="profile__photo" />
            <div className="profile__photo-overlay">
              <label htmlFor="profile-photo-upload" className="profile__photo-edit">
                Editar imagen de perfil
              </label>
              <input
                type="file"
                id="profile-photo-upload"
                className="profile__photo-input"
                onChange={handlePhotoChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="profile__info">
            <div className="profile__info-item">
              <label>Nombre y Apellido:</label>
              <p>Juan Pérez</p>
            </div>

            <div className="profile__info-item">
              <label>Correo Electrónico:</label>
              {isEditingEmail ? (
                <div className="profile__editable-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="profile__input"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña actual"
                    className="profile__input"
                  />
                </div>
              ) : (
                <p>{email}</p>
              )}
              {!isEditingEmail && (
                <button onClick={() => setIsEditingEmail(true)} className="profile__button edit-field">
                  <FaEdit /> 
                </button>
              )}
            </div>

            <div className="profile__info-item">
              <label>Número Telefónico:</label>
              {isEditingPhone ? (
                <div className="profile__editable-field">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="profile__input"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña actual"
                    className="profile__input"
                  />
                </div>
              ) : (
                <p>{phone}</p>
              )}
              {!isEditingPhone && (
                <button onClick={() => setIsEditingPhone(true)} className="profile__button edit-field">
                  <FaEdit /> 
                </button>
              )}
            </div>

            {/* Editar contraseña */}
            <div className="profile__info-item">
              <label>Contraseña:</label>
              {isEditingPassword ? (
                <div className="profile__editable-field">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="profile__input"
                    placeholder="Contraseña actual"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="profile__input"
                    placeholder="Nueva contraseña"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="profile__input"
                    placeholder="Confirmar nueva contraseña"
                  />
                </div>
              ) : (
                <p>*********</p>
              )}
              {!isEditingPassword && (
                <button onClick={() => setIsEditingPassword(true)} className="profile__button edit-field">
                  <FaEdit /> 
                </button>
              )}
            </div>

            {error && <p className="profile__error">{error}</p>}

            {/* Acciones de guardar/cancelar y desloguearse */}
            <div className="profile__actions">
              {(isEditingEmail || isEditingPhone || isEditingPassword) && (
                <>
                  <button onClick={handleSaveChanges} className="profile__button save">
                    Guardar Cambios
                  </button>
                  <button onClick={handleCancelEdit} className="profile__button cancel">
                    <FaTimes /> Cancelar Cambios
                  </button>
                </>
              )}
              {!isEditingEmail && !isEditingPhone && !isEditingPassword && (
                <button className="profile__button logout">
                  <FaSignOutAlt /> Desloguearse
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal de confirmación */}
        {showConfirmationModal && (
          <div className="modal">
            <div className="modal__content">
              <h2>Confirmar Cambios</h2>
              <p>¿Estás seguro de que deseas guardar los cambios?</p>
              <button onClick={confirmChanges} className="modal__button confirm">
                Confirmar
              </button>
              <button onClick={toggleModal} className="modal__button cancel">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de resultado */}
        {showResultModal && (
          <div className="modal">
            <div className="modal__content">
              <h2>{isSuccess ? '¡Cambios guardados con éxito!' : 'Error al guardar cambios'}</h2>
              <FaCheckCircle className={isSuccess ? 'modal__icon success' : 'modal__icon error'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Profile };
