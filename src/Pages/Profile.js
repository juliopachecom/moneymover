import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaSignOutAlt, FaTimes, FaCheckCircle } from "react-icons/fa";
import profileIcon from "../Assets/Images/profileicon.png";
import { NavBarUser } from "../Components/NavBarUser";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import axios from "axios";
import { useDataContext } from "../Context/dataContext"; // Para obtener el token y la URL

function Profile() {
  const { url, infoTkn } = useDataContext(); // Obtener el token y la URL de la API desde el contexto
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+34"); // Prefijo predeterminado
  const [currentPassword, setCurrentPassword] = useState(""); // Contraseña actual
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmar nueva contraseña
  const [profilePhoto, setProfilePhoto] = useState(profileIcon);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const userId = 1; // Aquí deberías obtener el ID del usuario autenticado.

  // Obtener datos del perfil
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      const userData = response.data;
      setEmail(userData.use_email);
      setPhone(userData.use_phone);
      setProfilePhoto(
        userData.use_profileImg
          ? `/Users/profileImg/${userData.use_profileImg}`
          : profileIcon
      );
    } catch (err) {
      console.error("Error al obtener datos del perfil:", err);
    }
  }, [userId, url, infoTkn]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Limpiar LocalStorage
  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
  };

  // Manejar cambio de foto de perfil
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("use_profileImg", file);

      try {
        const response = await axios.put(
          `${url}/Users/profileImg/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedImgUrl = `/Users/profileImg/${response.data.fileName}`;
        setProfilePhoto(updatedImgUrl);
        setShowResultModal(true);
        setIsSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        console.error("Error al subir la imagen:", err);
        setError("Error al subir la imagen.");
        setShowResultModal(true);
        setIsSuccess(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  // Función para alternar abrir y cerrar el modal de confirmación
  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  // Función para validar contraseña actual
  const verifyCurrentPassword = async () => {
    try {
      const response = await axios.get(`${url}/Auth/VerifyPassword/${userId}/${currentPassword}`);
      return response.data; // Retorna true o false
    } catch (err) {
      setError("Error al verificar la contraseña.");
      return false; // En caso de error, consideramos que no es válida
    }
  };

  const handleSaveChanges = async () => {
    setError(""); // Reiniciar error
    if (isEditingPhone) {
      const isPasswordValid = await verifyCurrentPassword();
      if (!isPasswordValid) {
        setError("La contraseña actual es incorrecta.");
        return;
      }
    } else if (isEditingPassword) {
      if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      const isPasswordValid = await verifyCurrentPassword();
      if (!isPasswordValid) {
        setError("La contraseña actual es incorrecta.");
        return;
      }
    }
    toggleModal(); // Llamar a toggleModal para abrir el modal de confirmación
  };

  const confirmChanges = async () => {
    try {
      const updatedData = {
        use_email: email,
        use_phone: phone,
      };

      if (isEditingPassword) {
        updatedData.use_password = newPassword; // Solo actualizar la contraseña si hay una nueva
      }

      // Llamada PUT para actualizar el perfil
      await axios.put(
        `${url}/Users/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      setShowConfirmationModal(false);
      setShowResultModal(true);
      setIsSuccess(true);
      setTimeout(() => {
        setShowResultModal(false);
        setIsEditingPhone(false);
        setIsEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      setError("Error al guardar cambios.");
      setShowResultModal(true);
      setIsSuccess(false);
      console.error("Error al actualizar el perfil:", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPhone(false);
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="profile-page">
      <div className="profile">
        <NavBarUser />
        <h1>Perfil del Usuario</h1>
        <div className="profile__container">
          {/* Foto de perfil */}
          <div className="profile__photo-wrapper">
            <img
              src={`${url}${profilePhoto}`}
              alt="Profile"
              className="profile__photo"
            />
            <div className="profile__photo-overlay">
              <label
                htmlFor="profile-photo-upload"
                className="profile__photo-edit"
              >
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
              <label>Correo Electrónico:</label>
              <p>{email}</p>
            </div>

            <div className="profile__info-item">
              <label>Número Telefónico:</label>
              {isEditingPhone ? (
                <div className="profile__editable-field">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Contraseña actual"
                    className="profile__input"
                  />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="profile__input"
                  >
                    <option value="+34">+34 (España)</option>
                    <option value="+58">+58 (Venezuela)</option>
                    <option value="+55">+55 (Brasil)</option>
                    <option value="+54">+54 (Argentina)</option>
                    <option value="+52">+52 (México)</option>
                    <option value="+57">+57 (Colombia)</option>
                    <option value="+51">+51 (Perú)</option>
                    <option value="+506">+506 (Costa Rica)</option>
                    <option value="+52">+52 (Chile)</option>
                    <option value="+41">+41 (Suiza)</option>
                    <option value="+44">+44 (Reino Unido)</option>
                    <option value="+49">+49 (Alemania)</option>
                    <option value="+33">+33 (Francia)</option>
                    <option value="+39">+39 (Italia)</option>
                    <option value="+31">+31 (Países Bajos)</option>
                    <option value="+32">+32 (Bélgica)</option>
                    <option value="+420">+420 (República Checa)</option>
                  </select>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nuevo número telefónico"
                    className="profile__input"
                  />
                </div>
              ) : (
                <p>{phone}</p> // Mostrar el número si no está en modo de edición
              )}
              <div className="profile__edit-button">
                {!isEditingPhone && (
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="profile__button edit-field"                  >
                    <FaEdit /> 
                  </button>
                )}
              </div>
            </div>

            <div className="profile__info-item">
              <label>Contraseña Actual:</label>
              {isEditingPassword ? (
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Contraseña actual"
                  className="profile__input"
                />
              ) : (
                <p>******</p> // Mostrar asteriscos si no está en modo de edición
              )}
            </div>

            <div className="profile__info-item">
              <label>Nueva Contraseña:</label>
              {isEditingPassword ? (
                <div className="profile__editable-field">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="profile__input"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="profile__input"
                  />
                </div>
              ) : (
                <p>******</p> // Mostrar asteriscos si no está en modo de edición
              )}
              <div className="profile__edit-button">
                {!isEditingPassword && (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="profile__button edit-field"                  >
                    <FaEdit /> 
                  </button>
                )}
              </div>
            </div>

            {error && <p className="profile__error">{error}</p>}

            {/* Acciones de guardar/cancelar y desloguearse */}
            <div className="profile__actions">
              {(isEditingPhone || isEditingPassword) && (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="profile__button save"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="profile__button cancel"
                  >
                    <FaTimes /> Cancelar Cambios
                  </button>
                </>
              )}
              {!isEditingPhone && !isEditingPassword && (
                <button onClick={clearLocal} className="profile__button logout">
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
              <button
                onClick={confirmChanges}
                className="modal__button confirm"
              >
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
              <h2>
                {isSuccess
                  ? "¡Cambios guardados con éxito!"
                  : "Error al guardar cambios"}
              </h2>
              <FaCheckCircle
                className={
                  isSuccess ? "modal__icon success" : "modal__icon error"
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Profile };
