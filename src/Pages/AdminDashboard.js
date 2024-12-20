import React, { useState, useEffect, useCallback } from "react";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import ukFlag from "../Assets/Images/uk.png";
import { format } from "date-fns";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaEye } from "react-icons/fa";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { NotFound } from "../Components/NotFound";
import { ToastContainer, toast } from "react-toastify";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function AdminDashboard() {
  useAxiosInterceptors();
  const { loggedAdm, infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("recargas");
  const currentDate = format(new Date(), "dd/MM/yyyy");

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);

  //Datos CurrencyPrice
  const [currencyPrice, setCurrencyPrice] = useState([]);

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);
  const [totalGbp, setTotalGbp] = useState([]);
  const [userCountV, setUserCountV] = useState(0); // Verificados
  const [userCountE, setUserCountE] = useState(0); // En espera
  const [userCountR, setUserCountR] = useState(0); // Rechazados

  // Datos de Remesas
  const [mov_img, setMovImg] = useState("");
  const [payment, setPayment] = useState("");
  const [fileSelected, setFileSelected] = useState(false);

  //Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectionVisible, setIsRejectionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Fetch de usuarios y filtrado
  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      const allUsers = response.data;

      // Filtramos los usuarios por su estado de verificación
      const verifiedUsers = allUsers.filter((user) => user.use_verif === "S");
      const pendingUsers = allUsers.filter((user) => user.use_verif === "E");
      const rejectedUsers = allUsers.filter((user) => user.use_verif === "N");

      // Actualizamos el estado con los contadores
      setUserCountV(verifiedUsers.length);
      setUserCountE(pendingUsers.length);
      setUserCountR(rejectedUsers.length);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, url]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch de datos del admin
  const fetchDataAdm = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/Auth/findByTokenAdmin/${infoTkn}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

  // Fetch de datos Movements
  const fetchDataMovemments = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Movements`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUserMovemments(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUserMovemments, infoTkn, url]);

  // Fetch de Total de Eur
  const fetchDataTotalEur = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totaleur/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalEur(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalEur, url]);

  // Fetch de Total de Usd
  const fetchDataTotalUsd = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalusd/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalUsd(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalUsd, url]);

  // Fetch de Total de Gbp
  const fetchDataTotalGbp = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalgbp/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalGbp(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalGbp, url]);

  // Fetch de CurrencyPrice
  const fetchDataCurrencyPrice = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/CurrencyPrice/1`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setCurrencyPrice, url]);

  const openDetailModal = (movement) => {
    setSelectedMovement(movement);
    setIsDetailModalOpen(true);
  };

  // Cerrar modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setIsRejectionVisible(false); // Reiniciar la visibilidad del rechazo
    setRejectionReason(""); // Limpiar el campo de razón de rechazo
    setSelectedMovement(null);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setShowRejectionReason(false); // Resetea el campo de rechazo
    setRejectionReason(""); // Limpiar la razón de rechazo
  };

  //Agregar saldo después de recargar
  const handleSubmitSummary = () => {
    const totalAmountEur = parseFloat(selectedMovement.User.use_amountEur);
    const totalAmountUsd = parseFloat(selectedMovement.User.use_amountUsd);
    const totalAmountGbp = parseFloat(selectedMovement.User.use_amountGbp);
    const formData = new FormData();
    if (selectedMovement.mov_currency === "EUR") {
      formData.append(
        "use_amountEur",
        totalAmountEur + selectedMovement.mov_amount
      );
    }
    if (selectedMovement.mov_currency === "USD") {
      formData.append(
        "use_amountUsd",
        totalAmountUsd + selectedMovement.mov_amount
      );
    }
    if (selectedMovement.mov_currency === "GBP") {
      formData.append(
        "use_amountGbp",
        totalAmountGbp + selectedMovement.mov_amount
      );
    }

    try {
      axios.put(`${url}/Users/${selectedMovement.User.use_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      console.log("Request send successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Aprobar Recarga
  const handleSubmitVerify = async (event) => {
    setIsLoading(true);  // Activa el estado de carga
    event.preventDefault();
    const formData = new FormData();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    formData.append("mov_date", formattedDate);

    try {
      await axios.get(`${url}/Movements/verif/${selectedMovement.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      await axios.put(`${url}/Movements/${selectedMovement.mov_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      await axios.post(
        `${url}/Mailer/EmailVRecharge/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      if (selectedMovement.mov_currency === "EUR") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accEurId: selectedMovement.AccountsEur.acceur_id,
            tor_currencyPrice: currencyPrice.cur_EurToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: selectedMovement.AccountsUsd.accusd_id,
            tor_currencyPrice: currencyPrice.cur_UsdToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "GBP") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accGbpId: selectedMovement.AccountsGbp.accgbp_id,
            tor_currencyPrice: currencyPrice.cur_GbpToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      closeDetailModal();
      handleSubmitSummary();
      fetchDataMovemments();

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setIsLoading(false);  // Desactiva el estado de carga
    }
  };

  //Aprobar Remesa
  const handleSubmitSendVerify = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // Activa el estado de carga

    const formData = new FormData();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    if (selectedMovement.mov_typeOutflow === "efectivo") {
      formData.append("mov_currency", "USD");
      formData.append("mov_accEurId", 0);
      formData.append("mov_accGbpId", 0);
      formData.append("mov_amount", selectedMovement.mov_amount);
      formData.append("mov_date", formattedDate);
      formData.append("mov_currencyPrice", 1);
    } else {
      formData.append(
        "mov_currency",
        selectedMovement.mov_currency === "USD" ||
          selectedMovement.mov_currency === "EUR" ||
          selectedMovement.mov_currency === "GBP"
          ? payment
          : selectedMovement.mov_currency
      );
      formData.append("mov_accEurId", 0);
      formData.append("mov_accGbpId", 0);
      formData.append("mov_accUsdId", payment === "USD" ? 1 : 0);
      formData.append("mov_accBsId", payment === "BS" ? 1 : 0);
      formData.append("mov_img", mov_img);
      formData.append(
        "mov_amount",
        selectedMovement.mov_currency === payment
          ? parseFloat(selectedMovement.mov_amount)
          : selectedMovement.mov_currency === "USD" &&
            selectedMovement.mov_currency !== payment
            ? parseFloat(selectedMovement.mov_amount) * selectedMovement.mov_currencyPrice
            : selectedMovement.mov_currency === "EUR"
              ? parseFloat(selectedMovement.mov_amount) * selectedMovement.mov_currencyPrice
              : selectedMovement.mov_currency === "GBP"
                ? parseFloat(selectedMovement.mov_amount) * selectedMovement.mov_currencyPrice
                : parseFloat(selectedMovement.mov_amount)
      );
      formData.append("mov_date", formattedDate);
    }

    try {
      await axios.put(`${url}/Movements/${selectedMovement.mov_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      await axios.get(`${url}/Movements/verif/${selectedMovement.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      // Enviar correo dependiendo del tipo de retiro
      if (selectedMovement.mov_typeOutflow === "efectivo") {
        await axios.post(
          `${url}/Mailer/EmailVCashWithdraw/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else {
        await axios.post(
          `${url}/Mailer/EmailVWithdraw/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      // Registrar el cambio en TotalRegister dependiendo de la moneda
      if (selectedMovement.mov_currency === "EUR" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: 1,
            tor_currencyPrice: parseFloat(currencyPrice.cur_EurToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "EUR" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: 1,
            tor_currencyPrice: parseInt(currencyPrice.cur_EurToUsd),
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "USD" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: 1,
            tor_currencyPrice: parseFloat(currencyPrice.cur_UsdToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "USD" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: 1,
            tor_currencyPrice: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "GBP" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: 1,
            tor_currencyPrice: parseFloat(currencyPrice.cur_GbpToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      if (selectedMovement.mov_currency === "GBP" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: 1,
            tor_currencyPrice: parseFloat(currencyPrice.cur_GbpToUsd),
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      // Colocamos el toast modal
      toast.success("¡Accion Realizada!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Cerrar el modal
      closeModal();
      fetchDataMovemments();

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setIsLoading(false);  // Desactiva el estado de carga
    }
  };



  const handleReject = () => {
    setShowRejectionReason(true); // Muestra el campo de razón de rechazo
  };

  const handleReject1 = () => {
    setIsRejectionVisible(true);
  };

  // Rechazar Movimiento
  const handleSendRejection = async (event) => {
    event.preventDefault();

    try {
      // Rechazar el movimiento
      await axios.get(`${url}/Movements/reject/${selectedMovement.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      // Actualizar comentario con la razón del rechazo
      await axios.put(
        `${url}/Movements/${selectedMovement.mov_id}`,
        {
          mov_comment: rejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      // Si es un retiro, ejecutar acciones adicionales
      if (selectedMovement.mov_type === "Retiro") {
        handleSubmitSummary();
      }

      // Cerrar modales y actualizar los movimientos
      closeDetailModal();
      closeModal();
      fetchDataMovemments();

      // Enviar correo de rechazo dependiendo del tipo de movimiento
      if (selectedMovement.mov_type === "Deposito") {
        // Enviar correo si es un depósito
        await axios.post(
          `${url}/Mailer/EmailRRecharge/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (selectedMovement.mov_typeOutflow === "efectivo") {
        // Enviar correo si es un retiro en efectivo
        await axios.post(
          `${url}/Mailer/EmailRCashWithdraw/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else {
        // Enviar correo si no es efectivo ni depósito (retiro por transferencia)
        await axios.post(
          `${url}/Mailer/EmailRWithdraw/${selectedMovement.User.use_email}/${selectedMovement.mov_id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      // Mostrar notificación de éxito
      toast.success("¡Datos enviados con éxito!", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const handleCancel = () => {
    setShowRejectionReason(false); // Oculta el cuadro de texto
  };


  useEffect(() => {
    fetchDataAdm();
    fetchDataMovemments();
    fetchDataTotalEur();
    fetchDataTotalUsd();
    fetchDataTotalGbp();
    fetchDataUsers();
    fetchDataCurrencyPrice();
  }, [
    fetchDataAdm,
    fetchDataMovemments,
    fetchDataTotalEur,
    fetchDataTotalUsd,
    fetchDataTotalGbp,
    fetchDataUsers,
    fetchDataCurrencyPrice,
  ]);

  return loggedAdm ? (
    <div className="admin-dashboard">
      <NavBarAdmin />
      {/* Bienvenida Administrador */}
      <div className="welcome-admin">
        <h2>Bienvenido de nuevo, {user.adm_user}</h2>
        <div className="date">{currentDate}</div>
      </div>

      <div className="cards-section totales">
        <div className="card">
          <h3>Total de Euros ingresados</h3>
          <div className="value">€{totalEur.totalIn}</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Libras ingresados</h3>
          <div className="value">£{totalGbp.totalIn}</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Dólares ingresados</h3>
          <div className="value">${totalUsd.totalIn}</div>
          <a href="/relation">Ver detalles</a>
        </div>
      </div>

      <div className="cards-section usuarios">
        <div className="card">
          <h3>Usuarios Verificados</h3>
          <div className="value">{userCountV}</div>
          <a href="/usersV">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Usuarios en Espera</h3>
          <div className="value">{userCountE}</div>
          <a href="/usersE">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Usuarios Rechazados</h3>
          <div className="value">{userCountR}</div>
          <a href="/usersR">Ver detalles</a>
        </div>
      </div>

      {/* Sección de Movimientos */}
      <div className="transactions-section">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "recargas" ? "active" : "inactive"}
            onClick={() => handleTabChange("recargas")}
          >
            Movimientos de Recarga (
            {
              userMovemments.filter(
                (movement) =>
                  movement.mov_type === "Deposito" &&
                  movement.mov_status === "E"
              ).length
            }
            )
          </button>
          <button
            className={activeTab === "remesas" ? "active" : "inactive"}
            onClick={() => handleTabChange("remesas")}
          >
            Movimientos de Remesas (
            {
              userMovemments.filter(
                (movement) =>
                  movement.mov_type === "Retiro" && movement.mov_status === "E"
              ).length
            }
            )
          </button>
        </div>

        {/* Tabla de Recargas */}
        {activeTab === "recargas" && (
          <div className="table-responsive">
            <table className="movements__table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Recarga</th>
                  <th>Enviado</th>
                  <th>Estado</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {userMovemments.length > 0 ? (
                  userMovemments
                    .filter(
                      (movement) =>
                        movement.mov_type === "Deposito" &&
                        movement.mov_status === "E"
                    )
                    .map((movement) => (
                      <tr key={movement.mov_id}>
                        <td>{movement.mov_date}</td>
                        <td>
                          {movement.User.use_name} {movement.User.use_lastName}
                        </td>
                        <td>{movement.mov_ref}</td>
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
                          {movement.mov_currency === "GBP" && (
                            <img src={ukFlag} alt="GBP" />
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
                          En espera
                        </td>
                        <td>
                          <FaEye
                            className="view-details-icon"
                            style={{
                              cursor: "pointer",
                              textAlign: "center",
                              width: "20px",
                            }}
                            onClick={() => openDetailModal(movement)}
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
        )}

        {/* Tabla de Remesas */}
        {activeTab === "remesas" && (
          <div className="table-responsive">
            <table className="movements__table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Remesa</th>
                  <th>Beneficiario</th>
                  <th>Enviado</th>
                  <th>Recibido</th>
                  <th>Estado</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {userMovemments && userMovemments.length > 0 ? (
                  userMovemments
                    .filter(
                      (movement) =>
                        movement.mov_type === "Retiro" &&
                        movement.mov_status === "E"
                    )
                    .map((movement) => (
                      <tr key={movement.mov_id}>
                        <td>{movement.mov_date}</td>
                        <td>
                          {movement.User && movement.User.use_name}{" "}
                          {movement.User && movement.User.use_lastName}
                        </td>
                        <td>{movement.mov_ref}</td>
                        <td>
                          {movement.AccountsBsUser
                            ? movement.AccountsBsUser.accbsUser_owner
                            : movement.mov_typeOutflow === "efectivo"
                              ? "Retiro en Efectivo"
                              : "Sin beneficiario"}
                        </td>
                        <td>
                          {movement.mov_typeOutflow === "efectivo"
                            ? movement.mov_oldAmount
                            : movement.mov_amount}
                          {movement.mov_currency === "USD" && (
                            <img src={usaFlag} alt="USD" />
                          )}
                          {movement.mov_currency === "EUR" && (
                            <img src={spainFlag} alt="EUR" />
                          )}
                          {movement.mov_currency === "GBP" && (
                            <img src={ukFlag} alt="GBP" />
                          )}
                        </td>
                        <td>
                          {movement.mov_typeOutflow === "efectivo"
                            ? movement.mov_amount
                            : movement.mov_amount * movement.mov_currencyPrice}
                        </td>
                        <td
                          className={
                            movement.mov_status === "S"
                              ? "completed"
                              : movement.mov_status === "E"
                                ? "en espera"
                                : "cancelled"
                          }
                        >
                          En espera
                        </td>
                        <td>
                          <FaEye
                            style={{ cursor: "pointer", height: "20px" }}
                            className="view-details-icon"
                            onClick={() => {
                              setSelectedMovement(movement); // Establece el movimiento seleccionado
                              setIsModalOpen(true); // Abre el modal
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
        )}

        {/* Modales */}

        {/* Modal de Recarga */}
        {isDetailModalOpen && selectedMovement && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Detalles del Movimiento</h3>
              <div className="modal-details">
                <p>
                  <strong>Monto:</strong>{" "}
                  {selectedMovement.mov_currency === "EUR"
                    ? "€"
                    : selectedMovement.mov_currency === "USD"
                      ? "$"
                      : "£"}{" "}
                  {selectedMovement.mov_amount}
                </p>
                <p>
                  <strong>
                    Banco:{" "}
                    {selectedMovement.AccountsEur
                      ? selectedMovement.AccountsEur.acceur_Bank
                      : selectedMovement.AccountsUsd
                        ? selectedMovement.AccountsUsd.accusd_Bank
                        : selectedMovement.AccountsGbp
                          ? selectedMovement.AccountsGbp.accgbp_Bank
                          : "Sin banco"}
                  </strong>
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

                {/* Muestra una imagen o un enlace de descarga si es PDF */}
                {selectedMovement.mov_img ? (
                  selectedMovement.mov_img.endsWith(".pdf") ? (
                    <a
                      href={`${url}/Movements/image/${selectedMovement.mov_img}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descargar PDF
                    </a>
                  ) : (
                    <img
                      src={`${url}/Movements/image/${selectedMovement.mov_img}`}
                      alt="Documento"
                      style={{ width: "200px" }}
                    />
                  )
                ) : (
                  <p>No hay documento adjunto.</p>
                )}
              </div>
              <div className="modal-buttons">
                <button
                  className="approve-btn"
                  onClick={handleSubmitVerify}
                  disabled={isLoading}  // Deshabilita el botón cuando está en proceso
                >
                  {isLoading ? <span className="spinner"></span> : "Aprobar"}
                </button>

                <button className="reject-btn" onClick={handleReject1}>
                  Rechazar
                </button>
              </div>

              {isRejectionVisible && (
                <div className="rejection-reason open">
                  <label htmlFor="rejection-reason">Razón del rechazo:</label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button className="send-btn" onClick={handleSendRejection}>
                      Enviar
                    </button>
                    <button className="close-btn" onClick={closeDetailModal}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button className="close-btn" onClick={closeDetailModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Remesa */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Detalles del Beneficiario</h3>
              {selectedMovement ? (
                <div className="modal-details">
                  {selectedMovement.AccountsBsUser ? (
                    <>
                      <p>
                        <strong>Propietario:</strong>{" "}
                        {selectedMovement.AccountsBsUser
                          ? selectedMovement.AccountsBsUser.accbsUser_owner
                          : "Sin información"}
                      </p>
                      <p>
                        <strong>Banco:</strong>{" "}
                        {selectedMovement.AccountsBsUser
                          ? selectedMovement.AccountsBsUser.accbsUser_bank
                          : "Sin información"}
                      </p>
                      <p>
                        <strong>DNI:</strong>{" "}
                        {selectedMovement.AccountsBsUser
                          ? selectedMovement.AccountsBsUser.accbsUser_dni
                          : "Sin información"}
                      </p>
                      <p>
                        <strong>
                          {selectedMovement.AccountsBsUser
                            ? selectedMovement.AccountsBsUser.accbsUser_type ===
                              "Pago Movil"
                              ? "Teléfono: " +
                              selectedMovement.AccountsBsUser.accbsUser_phone
                              : "Cuenta: " +
                              selectedMovement.AccountsBsUser.accbsUser_number
                            : "Sin información"}
                        </strong>
                      </p>
                      <p>
                        <strong>PAIS:</strong>{" "}
                        {selectedMovement.AccountsBsUser
                          ? selectedMovement.AccountsBsUser.accbsUser_country
                          : "Sin información"}
                      </p>
                      <p>
                        <strong>
                          Monto:{" "}
                          {selectedMovement.mov_amount *
                            selectedMovement.mov_currencyPrice}{" "}
                        </strong>
                      </p>
                    </>
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedMovement &&
                          selectedMovement.mov_comment.replace(/\n/g, "<br/>"),
                      }}
                    />
                  )}
                </div>
              ) : (
                <p>Cargando datos...</p>
              )}

              {selectedMovement.mov_typeOutflow !== "efectivo" && (
                <>
                  <div className="modal-actions">
                    <label className="select-label">
                      Selecciona una Moneda
                    </label>
                    <select
                      id="payment"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    >
                      <option>Selecciona una moneda...</option>
                      <option value="BS">Bolívares</option>
                      <option value="USD">Dólares (USD)</option>
                      <option value="ARS">Pesos Argentinos</option>
                      <option value="COP">Pesos Colombianos (COP)</option>
                      <option value="CLP">Pesos Chilenos (CLP)</option>
                      <option value="MXN">Pesos Mexicanos (MXN)</option>
                      <option value="PEN">Soles (PEN)</option>
                      <option value="BRL">Reales Brasileños (BRL)</option>
                      <option value="USD-EC">Dólar Ecuatoriano</option>
                      <option value="USD-PA">Dólar Panameño</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <label className="file-label" htmlFor="file-upload">
                      Subir Imagen
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={(e) => {
                        setMovImg(e.target.files[0]);
                        setFileSelected(!!e.target.files[0]);
                      }}
                    />
                    {fileSelected && (
                      <p className="file-selected-message">
                        Archivo seleccionado: {mov_img.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="modal-buttons">
                <button
                  className="approve-btn"
                  onClick={handleSubmitSendVerify}
                  disabled={isLoading}  // Deshabilita el botón cuando está en proceso
                >
                  {isLoading ? <span className="spinner"></span> : "Aprobar"}
                </button>

                <button className="reject-btn" onClick={handleReject}>
                  Rechazar
                </button>
              </div>

              {showRejectionReason && (
                <div className="rejection-reason open">
                  <label htmlFor="rejection-reason">Razón del rechazo:</label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <button className="send-btn" onClick={handleSendRejection}>
                    Enviar
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              )}

              <button className="close-btn" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  ) : (
    <NotFound />
  );
}

export { AdminDashboard };
