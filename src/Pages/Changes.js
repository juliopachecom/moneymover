import React, { useState, useEffect, useCallback } from "react";
import profileIcon from "../Assets/Images/profileicon.png";
import euroIcon from "../Assets/Images/euro.png";
import poundIcon from "../Assets/Images/pound.png";
import dollarIcon from "../Assets/Images/dollar.png";
import spainFlag from "../Assets/Images/spain.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import uk from "../Assets/Images/uk.png";
import verification from "../Assets/Images/giphy.gif";
import usaFlag from "../Assets/Images/usa.png";
import { NotFound } from "../Components/NotFound";
import {
  FaEye,
  FaExclamationTriangle,
  FaInfoCircle,
  FaWhatsapp,
} from "react-icons/fa"; // FaExclamationTriangle para el ícono de advertencia
import { NavBarUser } from "../Components/NavBarUser";
import { Link } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const apiKey = "b50eb96202f539479e288ab6547ea9484003";
const formId = "caa6d8bd0157c94736286c78fa42fafccc0d";

function Changes() {
  useAxiosInterceptors();
  const { logged, infoTkn, url } = useDataContext();

  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profileIcon);

  const [activeTab, setActiveTab] = useState("recargar"); // Cambio entre recarga y retiro
  const [isTasaOpen, setIsTasaOpen] = useState(false); // Desplegar tasas
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de verificación
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [kycLink, setKycLink] = useState("");

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);

  //Enviar a Whatsapp
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  //Toggle de imagen
  const [imgTogle, setImgTogle] = useState(false);
  const toggleImg = () => {
    setIsDetailIsModalOpen(false);
    setIsDetailsModalOpen(false);
    setImgTogle(!imgTogle)};

  //kyc
  const fetchKycLink = async () => {
    try {
        console.log("Solicitando KYC para el usuario ID:", user.use_id);

        // Actualizar el campo use_verif del usuario
        user.use_verif = "E";
        await axios.put(
            `${url}/users/${user.use_id}`,
            { use_verif: "E" },
            {
                headers: {
                    Authorization: `Bearer ${infoTkn}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Campo use_verif actualizado a 'E' para el usuario:", user.use_id);

        // Verificar si ya existe un kyc_link
        const existingKycLinkResponse = await axios.get(
            `${url}/kyclink/user/${user.use_id}`,
            {
                headers: {
                    Authorization: `Bearer ${infoTkn}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const existingKycLink = existingKycLinkResponse.data;

        // Asegúrate de que la propiedad kyc_link exista
        if (existingKycLink && existingKycLink.kyc_link) {
            console.log("KYC link existente encontrado para el usuario:", user.use_id);
            window.open(existingKycLink.kyc_link, "_blank"); // Abre en una nueva pestaña
        } else {
            // Si no existe un link, obtener uno nuevo
            const response = await fetch(
                `https://kyc-api.amlbot.com/forms/${formId}/urls`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Token " + apiKey,
                    },
                }
            );

            const data = await response.json();
            console.log("Respuesta de la API:", data);

            if (data && data.form_url) {
                const kycData = {
                    kyc_link_status: "Pending",
                    kyc_link_date: new Date().toISOString(),
                    kyc_User_id: user.use_id,
                    form_id: data.form_id,
                    form_url: data.form_url,
                    verification_id: data.verification_id,
                    form_token: data.form_token,
                    verification_attempts_left: data.verification_attempts_left,
                };

                await axios.post(`${url}/kyclink/create`, kycData, {
                    headers: {
                        Authorization: `Bearer ${infoTkn}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Nuevo KYC link creado para el usuario:", user.use_id);

                // Redirigir inmediatamente al nuevo kycLink
                window.open(data.form_url, "_blank"); // Abre en una nueva pestaña
            }
        }
    } catch (error) {
        console.error("Error:", error);
        setKycLink("Error al conectar con la API");
    }
};



  // Función para redirigir al usuario a la URL KYC
  const handleRedirect = () => {
    if (kycLink.startsWith("http")) {
      window.open(kycLink, "_blank"); // Abre el enlace en una nueva pestaña
    }
  };

  // Alternar entre recarga y retiro
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Alternar visualizador de tasas
  const toggleTasaOpen = () => {
    setIsTasaOpen(!isTasaOpen);
  };

  // Función para abrir el modal de tasas
  const openRatesModal = () => {
    setIsRatesModalOpen(true);
  };

  // Función para cerrar el modal de tasas
  const closeRatesModal = () => {
    setIsRatesModalOpen(false);
  };

  // Alternar modal de verificación
  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDetailsIModalOpen, setIsDetailIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  // Función para abrir el modal con detalles del movimiento
  const openDetailsModal = (movement) => {
    setSelectedMovement(movement);
    setIsDetailsModalOpen(true);
  };

  const openDetailsIModal = (movement) => {
    setSelectedMovement(movement);
    setIsDetailIsModalOpen(true);
  };

  // Función para cerrar el modal con detalles del movimiento
  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMovement(null);
  };

  const closeModalI = () => {
    setIsDetailIsModalOpen(false);
    setSelectedMovement(null);
  };

  const sendMessageToWhatsApp = () => {
    const phoneNumber = "+34602679774";
    const message = `Hola, Me interesa enviar una remesa a`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  // Tasas de cambio estáticas
  const userStatusMessage = "Usuario no verificado. Haz clic para verificarte.";

  // Fetch de datos del usuario (Incluye movimientos y directorio)
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      const responseMovemments = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovemments(responseMovemments.data);

      // Manejo de la imagen de perfil
      const profilePhotoUrl =
        response.data.use_profileImg &&
        response.data.use_profileImg.trim() !== ""
          ? `${url}/Users/profileImg/${response.data.use_profileImg}`
          : profileIcon;
      setProfilePhotoUrl(profilePhotoUrl);

      // const responseDirectory = await axios.get(
      //   `${url}/AccBsUser/${response.data.use_id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${infoTkn}`,
      //     },
      //   }
      // );
      // setUserDirectory(responseDirectory.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

  // Fetch de datos de la tasa de cambio
  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]);

  useEffect(() => {
    fetchCurrencyData();
    fetchDataUser();
  }, [fetchCurrencyData, fetchDataUser]);

  return logged ? (
    <div className="changes">
      <NavBarUser />

      {/* Mensaje de verificación */}
      {(user.use_verif === "N" || user.use_verif === "E") && (
        <div className="verification-alert" onClick={toggleModal}>
          <FaExclamationTriangle className="warning-icon" />
          <span>{userStatusMessage}</span>
        </div>
      )}

      {/* Modal personalizado */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <img
              src={verification}
              alt="Verificación animada"
              className="verification-gif"
            />
            <h2>Verificación de Usuario</h2>
            <p>
              Para utilizar la plataforma de MoneyMover, debes verificar tu
              identidad utilizando nuestro sistema KYC. Cumplimos con las
              normativas ISO 27001 y GDPR para proteger tus datos y garantizar
              su seguridad.
            </p>
            {/* Botón para obtener el enlace de verificación KYC y redirigir */}
            <button className="button-kycaml" onClick={fetchKycLink}>
              Obtener enlace de verificación KYC
            </button>

            {/* Redirigir automáticamente si existe el enlace */}
            {kycLink && kycLink.startsWith("http") && (
              <>
                <p className="kyc-modal-text" style={{ textAlign: "center" }}>
                  <strong>Redirigiendo a la verificación KYC...</strong>
                </p>
                {handleRedirect()} {/* Llama a la función de redirección */}
              </>
            )}
            
            <button className="close-button" onClick={toggleModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para enviar al usuario a WhatsApp */}
      <Modal
        className="kyc-modal-content"
        isOpen={modal}
        toggle={toggle}
        centered
      >
        <ModalHeader toggle={toggle}>
          <FaInfoCircle /> Información
        </ModalHeader>
        <ModalBody className="text-center">
          Los cambios estarán próximamente habilitados. Mantente informado.
          <br />
          Puedes realizar los cambios por medio de <br />
          <a href="https://wa.me/+34624377261" className="whatsapp-btn">
            <FaWhatsapp /> WhatsApp
          </a>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Titulo de bienvenida */}
      <div className="changes__header">
        <h1>Bienvenido, {user.use_name}</h1>
        <div className="changes__profile">
          <Link to="/profile">
            <img src={profilePhotoUrl} alt="Profile" className="profile-pic" />
          </Link>
        </div>
      </div>

      {/* Apartado de saldos disponibles */}
      <div className="changes__balances">
        <div className="balance-item">
          <h3>Saldo en Euros</h3>
          <p>€{user.use_amountEur ? user.use_amountEur : 0}</p>
        </div>
        <div className="balance-item">
          <h3>Saldo en Dólares</h3>
          <p>${user.use_amountUsd ? user.use_amountUsd : 0}</p>
        </div>
        <div className="balance-item">
          <h3>Saldo en Libras Esterlinas</h3>
          <p>£{user.use_amountGbp ? user.use_amountGbp : 0}</p>
        </div>
      </div>

      {/* Tasa de cambio */}
      <div className="changes__tasa">
        <h2 onClick={toggleTasaOpen} className="tasa-header">
          Tasas de Cambio {isTasaOpen ? "▲" : "▼"}
        </h2>
        <div className={`tasa-content ${isTasaOpen ? "open" : "closed"}`}>
          <div className="tasa-item">
            <img src={euroIcon} alt="Euro icon" />
            <p>Euros a Bolívares</p>
            <span>
              1 Eur ={" "}
              {currencyPrice.length > 0 ? currencyPrice[0].cur_EurToBs : "N/A"}{" "}
              Bs
            </span>
          </div>
          <div className="tasa-item">
            <img src={poundIcon} alt="Pound icon" />
            <p>Libras a Bolívares</p>
            <span>
              1 Gbp ={" "}
              {currencyPrice.length > 0 ? currencyPrice[0].cur_GbpToBs : "N/A"}{" "}
              Bs
            </span>
          </div>
          <div className="tasa-item">
            <img src={dollarIcon} alt="Dollar icon" />
            <p>Dólares a Bolívares</p>
            <span>
              1 Usd ={" "}
              {currencyPrice.length > 0 ? currencyPrice[0].cur_UsdToBs : "N/A"}{" "}
              Bs
            </span>
          </div>
          <div className="tasa-item">
            <img src={poundIcon} alt="Pound icon" />
            <p>Libras a Dólares</p>
            <span>
              1 Gbp ={" "}
              {currencyPrice.length > 0 ? currencyPrice[0].cur_GbpToUsd : "N/A"}{" "}
              Usd
            </span>
          </div>
          <div className="tasa-item">
            <img src={euroIcon} alt="Euro icon" />
            <p>Euros a Dólares</p>
            <span>
              1 Eur ={" "}
              {currencyPrice.length > 0 ? currencyPrice[0].cur_EurToUsd : "N/A"}{" "}
              Usd
            </span>
          </div>
          <div className="changes__actions">
            <button className="action-button green" onClick={openRatesModal}>
              Tasas para resto de América
            </button>
          </div>
        </div>
      </div>

      {/* Alternal entre recargar y enviar remesas */}
      <div className="changes__actions">
        {/* Botón para Recargar Saldo */}
        <button
          className="action-button green"
          onClick={() => {
            if (user.use_verif === "N" || user.use_verif === "E") {
              toggleModal(); // Abre el modal si el estado de verificación es "N" o "E"
            } else {
              // Redirigir a la página de recarga si el usuario está verificado
              window.location.href = "/recharge";
            }
          }}
        >
          Recargar Saldo
        </button>

        {/* Botón para Enviar Remesas */}
        <button
          className="action-button green"
          onClick={() => {
            if (user.use_verif === "N" || user.use_verif === "E") {
              toggleModal(); // Abre el modal si el estado de verificación es "N" o "E"
            } else {
              // Redirigir a la página de envío de dinero si el usuario está verificado
              window.location.href = "/sendmoney";
            }
          }}
        >
          Enviar Remesas
        </button>
      </div>

      {/* Alterna entre moivimientos de recargas y envios de remesas */}
      <div className="changes__tabs">
        <button
          className={activeTab === "recargar" ? "tab active" : "tab"}
          onClick={() => handleTabChange("recargar")}
        >
          Movimientos de Recarga
        </button>
        <button
          className={activeTab === "remesas" ? "tab active" : "tab"}
          onClick={() => handleTabChange("remesas")}
        >
          Movimientos de Remesas
        </button>
      </div>

      {/* Lista de movimientos de recargas y envios de remesas */}
      <div className="changes__content">
        {activeTab === "recargar" ? (
          <div className="tab-content">
            <h3>Historial de Recargas</h3>
            <div className="table-responsive">
              <table className="movements__table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Recarga</th>
                    <th>Enviado</th>
                    <th>Estado</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {userMovemments.length > 0 ? (
                    userMovemments
                      .filter((movement) => movement.mov_type === "Deposito")
                      .map((movement) => (
                        <tr key={movement.mov_id}>
                          <td>{movement.mov_date}</td>
                          <td>{movement.mov_ref}</td>
                          <td>
                            {movement.mov_currency === "EUR"
                              ? "€"
                              : movement.mov_currency === "USD"
                              ? "$"
                              : "£"}{" "}
                            {movement.mov_amount}{" "}
                            {movement.mov_oldCurrency === "USD" && (
                              <img src={usaFlag} alt="USD" />
                            )}
                            {movement.mov_oldCurrency === "EUR" && (
                              <img src={spainFlag} alt="EUR" />
                            )}
                            {movement.mov_oldCurrency === "GBP" && (
                              <img src={uk} alt="GBP" />
                            )}
                          </td>
                          <td
                            className={
                              movement.mov_status === "V"
                                ? "completed"
                                : movement.mov_status === "E"
                                ? "en espera"
                                : "cancelled"
                            }
                          >
                            {movement.mov_status === "V" ? (
                              "Aprobado"
                            ) : movement.mov_status === "E" ? (
                              <div class="tooltip">
                                En espera
                                <span class="tooltiptext">
                                  Tu transferencia esta en proceso de
                                  verificación
                                </span>
                              </div>
                            ) : (
                              "Rechazado"
                            )}
                          </td>
                          <td>
                            <FaEye
                              style={{ marginLeft: '15px', cursor: "pointer" }}
                              className="view-details-icon"
                              onClick={() => {
                                openDetailsIModal(movement);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No hay movimientos para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <h3>Historial de Remesas</h3>
            <div className="table-responsive">
              <table className="movements__table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Remesa</th>
                    <th>Beneficiario</th>
                    <th>Enviado</th>
                    <th>Recibido</th>
                    <th>Estado</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {userMovemments.length > 0 ? (
                    userMovemments
                      .filter((movement) => movement.mov_type === "Retiro")
                      .map((movement) => (
                        <tr key={movement.mov_id}>
                          <td>{movement.mov_date}</td>
                          <td>{movement.mov_ref}</td>
                          <td>
                            {movement.AccountsBsUser
                              ? movement.AccountsBsUser.accbsUser_owner
                              : movement.mov_typeOutflow === "efectivo"
                              ? "Retiro en Efectivo"
                              : "Sin beneficiario"}
                          </td>
                          <td>
                            {movement.mov_oldCurrency === "EUR"
                              ? "€"
                              : movement.mov_oldCurrency === "USD"
                              ? "$"
                              : "£"}{" "}
                            {movement.mov_status === "V"
                              ? movement.mov_amount / movement.mov_currencyPrice
                              : movement.mov_amount}{" "}
                            {movement.mov_oldCurrency === "USD" && (
                              <img src={usaFlag} alt="USD" />
                            )}
                            {movement.mov_oldCurrency === "EUR" && (
                              <img src={spainFlag} alt="EUR" />
                            )}
                            {movement.mov_oldCurrency === "GBP" && (
                              <img src={uk} alt="GBP" />
                            )}
                          </td>
                          <td>
                            {movement.mov_status !== "R" &&
                            movement.mov_status !== "E" &&
                            movement.mov_currency === "BS"
                              ? "Bs " + movement.mov_amount
                              : movement.mov_status !== "R" &&
                                movement.mov_status !== "E" &&
                                movement.mov_currency === "USD"
                              ? "$ " + movement.mov_amount
                              : movement.mov_status === "R"
                              ? "Rechazado"
                              : "En espera"}
                            {movement.mov_currency === "USD" && (
                              <img src={usaFlag} alt="USD" />
                            )}
                            {movement.mov_currency === "BS" && (
                              <img src={venezuelaFlag} alt="BS" />
                            )}
                          </td>
                          <td
                            className={
                              movement.mov_status === "V"
                                ? "completed"
                                : movement.mov_status === "E"
                                ? "en espera"
                                : "cancelled"
                            }
                          >
                            {movement.mov_status === "V" ? (
                              "Aprobado"
                            ) : movement.mov_status === "E" ? (
                              <div class="tooltip">
                                En espera
                                <span class="tooltiptext">
                                  Tu transferencia esta en proceso de
                                  verificación
                                </span>
                              </div>
                            ) : (
                              "Rechazado"
                            )}
                          </td>
                          <td>
                            <FaEye
                              className="view-details-icon"
                              onClick={() => {
                                openDetailsModal(movement);
                              }}
                            />
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No hay movimientos para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles de recarga */}
      {isDetailsIModalOpen && (
        <div className="details-modal-overlay">
          <div className="details-modal-content">
            <h2>Detalles del Movimiento</h2>
            <p>
              <strong>Fecha:</strong> {selectedMovement.mov_date}
            </p>
            <p>
              <strong># Remesa:</strong> {selectedMovement.mov_ref}
            </p>
            {selectedMovement.mov_code ? (
              <p>
                <strong>Código:</strong> {selectedMovement.mov_code}
              </p>
            ) : null}
            {selectedMovement.mov_phone ? (
              <p>
                <strong>Teléfono:</strong> {selectedMovement.mov_phone}
              </p>
            ) : null}
            <p>
              <strong>Monto:</strong>{" "}
              {selectedMovement.mov_currency === "EUR" ? "€" : selectedMovement.mov_currency === "USD" ? "$" : "£"}
              {selectedMovement.mov_amount}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {selectedMovement.mov_status === "V"
                ? "Aprobado"
                : selectedMovement.mov_status === "E"
                ? "En espera"
                : "Rechazado"}
            </p>
            {selectedMovement.mov_status === "R" && (
              <p>
                <strong>Comentario:</strong> {selectedMovement.mov_comment}
              </p>
            )}
            <p>
              <strong>Imagen:</strong>{" "}
              <button className="button" onClick={toggleImg}>
                Visualizar Imagen
              </button>
            </p>
            <button className="close-button" onClick={closeModalI}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalles de remesa */}
      {isDetailsModalOpen && (
        <div className="details-modal-overlay">
          <div className="details-modal-content">
            <h2>Detalles del Movimiento</h2>
            <p>
              <strong>Fecha:</strong> {selectedMovement.mov_date}
            </p>
            <p>
              <strong># Remesa:</strong> {selectedMovement.mov_ref}
            </p>
            <p>
              <strong>Monto:</strong>{" "}
              {selectedMovement.mov_status !== "R" &&
              selectedMovement.mov_status !== "E" &&
              selectedMovement.mov_currency === "BS"
                ? "Bs " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "USD"
                ? "$ " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "ARS"
                ? "ARS " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "CLP"
                ? "CLP " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "MXN"
                ? "MXN " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "BRL"
                ? "BRL " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "PEN"
                ? "PEN " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "COP"
                ? "COP " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "USD-EC"
                ? "USD-EC " + selectedMovement.mov_amount
                : selectedMovement.mov_status !== "R" &&
                  selectedMovement.mov_status !== "E" &&
                  selectedMovement.mov_currency === "USD-PA"
                ? "USD-PA " + selectedMovement.mov_amount
                : selectedMovement.mov_status === "E"
                ? "Por establecer"
                : "Rechazado"}
            </p>
            <p>
              <strong>Beneficiario:</strong>{" "}
              {selectedMovement.AccountsBsUser
                ? selectedMovement.AccountsBsUser.accbsUser_owner
                : selectedMovement.mov_typeOutflow === "efectivo"
                ? "Retiro en Efectivo"
                : "Sin beneficiario"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {selectedMovement.mov_status === "V"
                ? "Aprobado"
                : selectedMovement.mov_status === "E"
                ? "En espera"
                : "Rechazado"}
            </p>
            <p>
              <strong>Imagen:</strong>{" "}
              <button className="button" onClick={toggleImg}>
                Visualizar Imagen
              </button>
            </p>
            <button className="close-button" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Verificación de usuario */}
      {isVerificationModalOpen && (
        <div className="kyc-modal-overlay">
          <div className="kyc-modal-content">
            <h2>Verificación de Usuario</h2>
            <p className="kyc-modal-text">
              Tu usuario necesita verificación. Prepara tu documentación
              VIGENTE: DNI, NIE, pasaporte o cédula. Sigue los pasos como lo
              indica el proceso.
              <strong>
                {" "}
                No subas cartón rojo, ni NIE de hoja blanca.
              </strong>{" "}
              Evita que tu verificación sea rechazada, subiendo una foto clara
              de la parte frontal y reverso del documento.
            </p>
            <p className="kyc-modal-text">
              El tiempo estimado de verificación dentro de nuestro horario
              laboral es de aproximadamente <strong>20 minutos</strong>.
            </p>

            <p className="kyc-modal-text">
              Si ya has realizado la verificación a través del link, espera a
              que nuestro equipo valide tu información. El sistema verifica que
              la documentación adjunta sea vigente y que el video de
              identificación facial proteja tu identidad. Esta comprobación
              llevará entre <strong>5 a 20 minutos</strong>.
            </p>

            {/* Botón para obtener el enlace de verificación KYC y redirigir */}
            <button className="button-kycaml" onClick={fetchKycLink}>
              Obtener enlace de verificación KYC
            </button>

           

            <button
              className="button-kycaml"
              style={{justifyContent: 'center'}}
              onClick={() => setIsVerificationModalOpen(false)}
            >
              Cerrarr
            </button>
          </div>
        </div>
      )}

      {/* Visualizador de tasas */}
      {isRatesModalOpen && (
        <div className="rates-modal-overlay">
          <div className="rates-modal-content">
            <h2>Tasas para el resto de América</h2>
            <div className="rates-table">
              {/* Cambios de Euros */}
              <div className="rates-column">
                <h3>De Euros</h3>
                <p>
                  <strong>Colombianos (COP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToCol_Pes
                    : "N/A"}
                </p>
                <p>
                  <strong>Argentinos (ARS):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToArg_Pes
                    : "N/A"}
                </p>
                <p>
                  <strong>Mexicanos (MXN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToPes_Mex
                    : "N/A"}
                </p>
                <p>
                  <strong>Chilenos (CLP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToPes_Ch
                    : "N/A"}
                </p>
                <p>
                  <strong>Panameños (PAB):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToUsd_Pa
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Brasileños (BRL):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToBra_Rea
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Soles (PEN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToSol_Pe
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Ecuatorianos (USD):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_EurToUsd_Ec
                    : "N/A"}{" "}
                </p>
              </div>

              {/* Cambios de Dolares */}
              <div className="rates-column">
                <h3>De Dólares</h3>
                <p>
                  <strong>Colombianos (COP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToCol_Pes
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Argentinos (ARS):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToArg_Pes
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Mexicanos (MXN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToPes_Mex
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Chilenos (CLP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToPes_Ch
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Panameños (PAB):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToUsd_Pa
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Brasileños (BRL):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToBra_Rea
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Soles (PEN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToSol_Pe
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Ecuatorianos (USD):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_UsdToUsd_Ec
                    : "N/A"}{" "}
                </p>
              </div>

              {/* Cambios de Libras */}
              <div className="rates-column">
                <h3>De Libras</h3>
                <p>
                  <strong>Colombianos (COP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToCol_Pes
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Argentinos (ARS):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToArg_Pes
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Mexicanos (MXN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToPes_Mex
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Chilenos (CLP):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToPes_Ch
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Panameños (PAB):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToUsd_Pa
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Brasileños (BRL):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToBra_Rea
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Soles (PEN):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToSol_Pe
                    : "N/A"}{" "}
                </p>
                <p>
                  <strong>Ecuatorianos (USD):</strong>{" "}
                  {currencyPrice.length > 0
                    ? currencyPrice[0].cur_GbpToUsd_Ec
                    : "N/A"}{" "}
                </p>
              </div>
            </div>
            <button className="whatsapp-button" onClick={sendMessageToWhatsApp}>
              Enviar Mensaje por WhatsApp
            </button>
            <button className="close-button" onClick={closeRatesModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de visualización de imagen */}
      {imgTogle && selectedMovement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Imagen de Recarga</h3>
            <div className="modal-details">
              {/* Muestra una imagen o un enlace de descarga si es PDF */}
              {selectedMovement.mov_img ? (
                selectedMovement.mov_img.endsWith(".pdf") ? (
                  <a
                    href={`${url}/download/${selectedMovement.mov_img}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar PDF
                  </a>
                ) : (
                  <img
                    src={`${url}/Movements/image/${selectedMovement.mov_img}`}
                    alt="Documento"
                    style={{ maxWidth: "100%" }}
                  />
                )
              ) : (
                <p>No hay documento adjunto.</p>
              )}
            </div>
            <div className="modal-actions">
              <button className="close-btn" onClick={toggleImg}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <NotFound />
  );
}

export { Changes };
