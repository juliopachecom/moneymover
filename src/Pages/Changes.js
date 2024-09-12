import React, { useState, useEffect, useCallback } from "react";
import profileIcon from "../Assets/Images/profileicon.png";
import euroIcon from "../Assets/Images/euro.png";
import poundIcon from "../Assets/Images/pound.png";
import dollarIcon from "../Assets/Images/dollar.png";
import spainFlag from "../Assets/Images/spain.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import verification from "../Assets/Images/giphy.gif";
import usaFlag from "../Assets/Images/usa.png";
import { FaEye, FaExclamationTriangle } from "react-icons/fa"; // FaExclamationTriangle para el ícono de advertencia
import { NavBarUser } from "../Components/NavBarUser";
import { Link } from "react-router-dom";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function Changes() {
  const { logged, infoTkn, url } = useDataContext();
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("recargar"); // Cambio entre recarga y retiro
  const [isTasaOpen, setIsTasaOpen] = useState(false); // Desplegar tasas
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de verificación
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false); 
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const kycLink = null;




  // Datos de la recarga
  const [payment, setPayment] = useState("");
  // const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  // const [receiveAmount, setReceiveAmount] = useState(0);
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [mov_img, setMov_img] = useState("");
  const [showConfirmationr, setShowConfirmationr] = useState(false);

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);
  // const [userDirectory, setUserDirectory] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  // const [cash, setCash] = useState("");
  // const [cashPhone, setCashPhone] = useState("");

  // Datos de los bancos
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [banksGBP, setBanksGBP] = useState([]);


  
  //Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Datos para verificación
  const [use_dni, setUseDNI] = useState("");
  const [use_phone, setUsePhone] = useState("");
  const [use_img, setUseImg] = useState("");
  const [use_imgDni, setUseImgDni] = useState("");
  const [termsCheckbox, setTermsCheckbox] = useState(false);

  // Limpiar LocalStorage
  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
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
  const toggleVerificationModal = () => {
    setIsModalOpen(false); // Cierra el primer modal
    setIsVerificationModalOpen(true); // Abre el modal de verificación
  };


  // Alternar modal de verificación
  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  // Función para abrir el modal con detalles del movimiento
  const openDetailsModal = (movement) => {
    setSelectedMovement(movement);
    setIsDetailsModalOpen(true);
  };

  // Función para cerrar el modal con detalles del movimiento
  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMovement(null);
  };

  const sendMessageToWhatsApp = () => {
    const phoneNumber = "+34602679774";
    const message = `Hola, Me interesa enviar una remesa a`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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

      // Validacion de verifición de usuario
      if (response.data.use_verif === "N") {
        setAlertMessage(
          <span style={{ cursor: "pointer" }} onClick={toggleModal}>
            Usuario no verificado
          </span>
        );
        setAlertType("error");
      } else if (response.data.use_verif === "E") {
        setAlertMessage("Usuario en proceso de verificación");
        setAlertType("info");
      } else if (response.data.use_verif === "S") {
        setAlertMessage("Usuario verificado");
        setAlertType("success");
      }

      const responseMovemments = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovemments(responseMovemments.data);

      // const responseDirectory = await axios.get(
      //   `${url}/AccBsUser/${response.data.use_id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${infoTkn}`,
      //     },
      //   }
      // );
      // setUserDirectory(responseDirectory.data);

      setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url, toggleModal]);

  // Fetch de datos de la tasa de cambio
  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]);

  // Fetch de datos de los bancos en EUR
  const fetchDataAccEur = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Acceur`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksEUR(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, infoTkn]);

  // Fetch de datos de los bancos en USD
  const fetchDataAccUsd = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccUsd`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, infoTkn]);

  // Fetch de datos de los bancos en GBP
  const fetchDataAccGbp = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccGbp`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, infoTkn]);

  useEffect(() => {
    fetchCurrencyData();
    fetchDataUser();
    fetchDataAccEur();
    fetchDataAccUsd();
    fetchDataAccGbp();
  }, [
    fetchCurrencyData,
    fetchDataUser,
    fetchDataAccEur,
    fetchDataAccUsd,
    fetchDataAccGbp,
  ]);

  return logged ? (
    <div className="changes">
      <NavBarUser />

      {/* Mensaje de verificación */}
      <div className="verification-alert" onClick={toggleModal}>
        <FaExclamationTriangle className="warning-icon" />
        <span>{userStatusMessage}</span>
      </div>

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
            <button className="verify-button" onClick={toggleVerificationModal}>
              ¡Verifícate!
            </button>
            <button className="close-button" onClick={toggleModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Titulo de bienvenida */}
      <div className="changes__header">
        <h1>Bienvenido, {user.use_name}</h1>
        <div className="changes__profile">
          <img src={profileIcon} alt="Profile" className="profile-pic" />
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
        <Link to="/recharge">
          {" "}
          <button className="action-button green">Recargar Saldo</button>
        </Link>
        <Link to="/sendmoney">
          {" "}
          <button className="action-button green">Enviar Remesas</button>
        </Link>
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
                  {/* <tr>
                    <td>25/08/2024</td>
                    <td>407843</td>
                    <td>
                      20,00 EUR <img src={spainFlag} alt="EUR" />
                    </td>
                    <td className="cancelled">Cancelado</td>
                    <td>
                      <FaEye className="view-details-icon" />
                    </td>
                  </tr> */}
                  {userMovemments.length > 0 ? (
                    userMovemments
                      .filter((movement) => movement.mov_type === "Deposito")
                      .map((movement) => (
                        <tr key={movement.mov_id}>
                          <td>{movement.mov_date}</td>
                          <td>0001</td>
                          <td>
                            {movement.mov_currency === "EUR"
                              ? "€"
                              : movement.mov_currency === "USD"
                              ? "$"
                              : "£"}{" "}
                            {movement.mov_amount}{" "}
                            {movement.mov_currency === "USD" && (
                              <img src={usaFlag} alt="USD" />
                            )}
                            {movement.mov_currency === "EUR" && (
                              <img src={spainFlag} alt="EUR" />
                            )}
                          </td>
                          <td className="completed">Aprobado</td>
                          <td>
                            <FaEye className="view-details-icon" />
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
                  {/* <tr>
                    <td>26/08/2024</td>
                    <td>407844</td>
                    <td>
                      30,00 USD <img src={usaFlag} alt="USD" />
                    </td>
                    <td className="completed">Aprobado</td>
                    <td>
                      <FaEye className="view-details-icon" />
                    </td>
                  </tr> */}
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
                   <tr>
                    <td>25/08/2024</td>
                    <td>407845</td>
                    <td>Maribel Esther M...</td>
                    <td>
                      20,00 EUR <img src={spainFlag} alt="EUR" />
                    </td>
                    <td>
                      86,20 VEF <img src={venezuelaFlag} alt="VEF" />
                    </td>
                    <td className="cancelled">Cancelado</td>
                    <td>
                      <FaEye className="view-details-icon" onClick={openDetailsModal} />
                    </td>
                  </tr> 
                  {userMovemments.length > 0 ? (
                    userMovemments
                      .filter((movement) => movement.mov_type === "Retiro")
                      .map((movement) => (
                        <tr key={movement.mov_id}>
                          <td>{movement.mov_date}</td>
                          <td>0001</td>
                          <td>Carlos Pérez</td>
                          <td>
                            50,00 USD <img src={usaFlag} alt="USD" />
                          </td>
                          <td>
                            {movement.mov_currency === "BS"
                              ? "Bs"
                              : movement.mov_currency === "USD"
                              ? "$"
                              : "£"}{" "}
                            {movement.mov_amount}{" "}
                            {movement.mov_currency === "USD" && (
                              <img src={usaFlag} alt="USD" />
                            )}
                            {movement.mov_currency === "BS" && (
                              <img src={venezuelaFlag} alt="BS" />
                            )}
                          </td>
                          <td className="completed">Aprobado</td>
                          <td>
                            <FaEye className="view-details-icon" onClick={openDetailsModal} />
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
                  {/* <tr>
                    <td>26/08/2024</td>
                    <td>407846</td>
                    <td>Carlos Pérez</td>
                    <td>
                      50,00 USD <img src={usaFlag} alt="USD" />
                    </td>
                    <td>
                      150,00 VEF <img src={venezuelaFlag} alt="VEF" />
                    </td>
                    <td className="pending">En espera</td>
                    <td>
                      <FaEye className="view-details-icon" />
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            
          </div>

          
          
        )}
      </div>
      {isDetailsModalOpen && (
        <div className="details-modal-overlay">
          <div className="details-modal-content">
            <h2>Detalles del Movimiento</h2>
            <p><strong>Fecha:</strong> {selectedMovement.mov_date}</p>
            <p><strong># Remesa:</strong> {selectedMovement.mov_id}</p>
            <p>
              <strong>Monto:</strong> {selectedMovement.mov_currency === "EUR" ? "€" : "$"}
              {selectedMovement.mov_amount}
            </p>
            <p><strong>Beneficiario:</strong> {selectedMovement.beneficiary}</p>
            <p><strong>Estado:</strong> {selectedMovement.status}</p>
            <p><strong>Imagen:</strong> imagen</p>
            <button className="close-button" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

{isVerificationModalOpen && (
        <div className="kyc-modal-overlay">
          <div className="kyc-modal-content">
            <h2>Verificación de Usuario</h2>
            <p className="kyc-modal-text">
              Tu usuario necesita verificación. Prepara tu documentación VIGENTE: DNI, NIE, pasaporte o cédula. Sigue los pasos como lo indica el proceso.
              <strong> No subas cartón rojo, ni NIE de hoja blanca.</strong> Evita que tu verificación sea rechazada, subiendo una foto clara de la parte frontal y reverso del documento.
            </p>
            <p className="kyc-modal-text">
              El tiempo estimado de verificación dentro de nuestro horario laboral es de aproximadamente <strong>20 minutos</strong>.
            </p>

            {kycLink ? (
              <button color="primary" className="kyc-modal-button" href={kycLink} target="_blank" rel="noopener noreferrer">
                Ir a la verificación KYC
              </button>
            ) : (
              <p className="kyc-modal-text">
                Aún no tienes un link asignado. Te llegará un correo en breve con tu link, o podrás hacer clic aquí cuando esté disponible.
              </p>
            )}

            <p className="kyc-modal-text">
              Si ya has realizado la verificación a través del link, espera a que nuestro equipo valide tu información. El sistema verifica que la documentación adjunta sea vigente y que el video de identificación facial proteja tu identidad. Esta comprobación llevará entre <strong>5 a 20 minutos</strong>.
            </p>

            <button className="close-button"  onClick={() => setIsVerificationModalOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}



{isRatesModalOpen && (
        <div className="rates-modal-overlay">
          <div className="rates-modal-content">
            <h2>Tasas para el resto de América</h2>
            <div className="rates-table">
              <div className="rates-column">
                <h3>De Euros</h3>
                <p><strong>Colombianos (COP):</strong> x</p>
                <p><strong>Argentinos (ARS):</strong> x</p>
                <p><strong>Mexicanos (MXN):</strong> x</p>
                <p><strong>Chilenos (CLP):</strong> x</p>
                <p><strong>Panameños (PAB):</strong> x </p>
                <p><strong>Brasileños (BRL):</strong> x </p>
                <p><strong>Soles (PEN):</strong> x  </p>
              </div>
              <div className="rates-column">
                <h3>De Dólares</h3>
                <p><strong>Colombianos (COP):</strong> x</p>
                <p><strong>Argentinos (ARS):</strong> x</p>
                <p><strong>Mexicanos (MXN):</strong> x</p>
                <p><strong>Chilenos (CLP):</strong> x</p>
                <p><strong>Panameños (PAB):</strong> x</p>
                <p><strong>Brasileños (BRL):</strong> x</p>
                <p><strong>Soles (PEN):</strong> x</p>
              </div>
              <div className="rates-column">
                <h3>De Libras</h3>
                <p><strong>Colombianos (COP):</strong> x</p>
                <p><strong>Argentinos (ARS):</strong> x</p>
                <p><strong>Mexicanos (MXN):</strong> x</p>
                <p><strong>Chilenos (CLP):</strong> x</p>
                <p><strong>Panameños (PAB):</strong> x</p>
                <p><strong>Brasileños (BRL):</strong>x</p>
                <p><strong>Soles (PEN):</strong> x</p>
              </div>
            </div>
            <button className="whatsapp-button" onClick={sendMessageToWhatsApp}>
              Enviar Mensaje por WhatsApp 
            </button>
            <button className="close-button" onClick={closeRatesModal}>Cerrar</button>
          </div>
        </div>
      )}
      
    </div>
  ) : (
    "Log In"
  );
}

export { Changes };