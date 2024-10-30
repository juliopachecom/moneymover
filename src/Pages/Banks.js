import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaPlus } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import { NotFound } from "../Components/NotFound";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function Banks() {
  useAxiosInterceptors();
  const { loggedAdm, infoTkn, url } = useDataContext();

  const [banksEur, setBanksEUR] = useState([]);
  const [banksUsd, setBanksUSD] = useState([]);
  const [banksGbp, setBanksGBP] = useState([]);
  const [currency, setCurrency] = useState(""); // Estado para la moneda seleccionada

  // const [banksBs, setBanksBS] = useState([]);

  // const [admin, setAdmin] = useState([]);

  const [acceur_Bank, setAcceur_Bank] = useState("");
  const [acceur_owner, setAcceur_owner] = useState("");
  const [acceur_number, setAcceur_number] = useState("");
  const [acceur_nie, setAcceur_nie] = useState("");
  const [acceur_swift, setAcceur_swift] = useState("");
  const [acceur_phone, setAcceur_phone] = useState("");

  const [accgbp_Bank, setAccgbp_Bank] = useState("");
  const [accgbp_owner, setAccgbp_owner] = useState("");
  const [accgbp_number, setAccgbp_number] = useState("");
  const [accgbp_Ident, setAccgbp_Ident] = useState("");
  const [accgbp_swift, setAccgbp_swift] = useState("");
  const [accgbp_codSucursal, setAccgbp_codSucursal] = useState("");
  const [accgbp_phone, setAccgbp_phone] = useState("");

  const [accusd_Bank, setAccusd_Bank] = useState("");
  const [accusd_owner, setAccusd_owner] = useState("");
  const [accusd_email, setAccusd_email] = useState("");
  const [accusd_number, setAccusd_number] = useState("");
  const [accusd_Ident, setAccusd_Ident] = useState("");
  const [accusd_phone, setAccusd_phone] = useState("");

  // const [accbs_bank, setAccbs_bank] = useState("");
  // const [accbs_owner, setAccbs_owner] = useState("");
  // const [accbs_number, setAccbs_number] = useState("");
  // const [accbs_dni, setAccbs_dni] = useState("");
  // const [accbs_phone, setAccbs_phone] = useState("");

  // const [typeAcc, setTypeAcc] = useState("");

  const filteredBanks = [...banksEur, ...banksUsd, ...banksGbp].filter(
    (Bank) => {
      const fullName =
        `${Bank.acceur_Bank} ${Bank.accusd_Bank} ${Bank.accgbp_Bank}`.toLowerCase();
      return fullName;
    }
  );

  const fetchDataEUR = useCallback(async () => {
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
  }, [infoTkn, setBanksEUR, url]);

  const fetchDataUSD = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accusd`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setBanksUSD, url]);

  const fetchDataGBP = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accgbp`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setBanksGBP(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setBanksGBP, url]);

  const [showModal, setShowModal] = useState(false);

  const handleStatus = async (bank) => {
    try {
      if (bank.acceur_status === "Inactivo") {
        await axios.put(
          `${url}/Acceur/${bank.acceur_id}`,
          {
            acceur_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (bank.acceur_status === "Activo") {
        await axios.put(
          `${url}/Acceur/${bank.acceur_id}`,
          {
            acceur_status: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (bank.accusd_status === "Inactivo") {
        await axios.put(
          `${url}/Accusd/${bank.accusd_id}`,
          {
            accusd_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (bank.accusd_status === "Activo") {
        await axios.put(
          `${url}/Accusd/${bank.accusd_id}`,
          {
            accusd_status: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (bank.accgbp_status === "Inactivo") {
        await axios.put(
          `${url}/Accgbp/${bank.accgbp_id}`,
          {
            accgbp_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else if (bank.accgbp_status === "Activo") {
        await axios.put(
          `${url}/Accgbp/${bank.accgbp_id}`,
          {
            accgbp_status: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      fetchDataEUR();
      fetchDataUSD();
      fetchDataGBP();
    } catch (error) {
      console.log(error);
    }
  };

  // Función para abrir el modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setAcceur_Bank("");
    setAcceur_owner("");
    setAcceur_number("");
    setAcceur_nie("");
    setAcceur_swift("");
    setAcceur_phone("");

    setAccgbp_Bank("");
    setAccgbp_owner("");
    setAccgbp_number("");
    setAccgbp_Ident("");
    setAccgbp_swift("");
    setAccgbp_codSucursal("");
    setAccgbp_phone("");

    setAccusd_Bank("");
    setAccusd_owner("");
    setAccusd_email("");
    setAccusd_number("");
    setAccusd_Ident("");
    setAccusd_phone("");

    setCurrency("");
  };

  useEffect(() => {
    fetchDataEUR();
    fetchDataUSD();
    fetchDataGBP();
  }, [fetchDataEUR, fetchDataUSD, fetchDataGBP]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (currency === "EUR") {
      try {
        await axios.post(
          `${url}/Acceur/create`,
          {
            acceur_Bank,
            acceur_owner,
            acceur_number,
            acceur_nie,
            acceur_swift,
            acceur_phone,
            acceur_type: "Normal",
            acceur_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchDataEUR();
        fetchDataGBP();
        fetchDataUSD();

        closeModal();
      } catch (error) {
        console.log(error);
      }
    }

    if (currency === "GBP") {
      try {
        await axios.post(
          `${url}/Accgbp/create`,
          {
            accgbp_Bank,
            accgbp_owner,
            accgbp_number,
            accgbp_Ident,
            accgbp_swift,
            accgbp_codSucursal,
            accgbp_phone,
            accgbp_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchDataEUR();
        fetchDataGBP();
        fetchDataUSD();

        closeModal();
      } catch (error) {
        console.log(error);
      }
    }

    if (currency === "USD") {
      try {
        await axios.post(
          `${url}/Accusd/create`,
          {
            accusd_Bank,
            accusd_owner,
            accusd_email,
            accusd_number,
            accusd_Ident,
            accusd_phone,
            accusd_type: "Normal",
            accusd_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchDataEUR();
        fetchDataGBP();
        fetchDataUSD();

        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return loggedAdm ? (
    <div className="add-banks-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Agregar Bancos - España</h2>

        <div className="banks-section">
          {/* Botón para agregar bancos */}
          <button className="btn btn-add-bank" onClick={openModal}>
            <FaPlus /> Agregar Banco
          </button>

          {/* Listado de Bancos */}
          {filteredBanks.length > 0 ? (
            <table className="banks-table">
              <thead>
                <tr>
                  <th>Nombre del Banco</th>
                  <th>IBAN</th>
                  <th>SWIFT/BIC</th>
                  <th>Titular de la Cuenta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanks
                  .filter(
                    (bank) =>
                      bank.acceur_Bank !== "Ghost" &&
                      bank.accgbp_Bank !== "Ghost" &&
                      bank.accusd_Bank !== "Ghost" &&
                      bank.accbs_bank !== "Ghost"
                  )
                  .map((bank) => (
                    <tr>
                      <td>
                        {bank.acceur_Bank
                          ? bank.acceur_Bank
                          : bank.accusd_Bank
                            ? bank.accusd_Bank
                            : bank.accgbp_Bank}
                      </td>
                      <td>
                        {bank.acceur_number
                          ? bank.acceur_number
                          : bank.accusd_number
                            ? bank.accusd_number
                            : bank.accgbp_number}
                      </td>
                      <td>
                        {bank.acceur_swift
                          ? bank.acceur_swift
                          : bank.accusd_email
                            ? bank.accusd_email
                            : bank.accgbp_swift}
                      </td>
                      <td>
                        {bank.acceur_owner
                          ? bank.acceur_owner
                          : bank.accusd_owner
                            ? bank.accusd_owner
                            : bank.accgbp_owner}
                      </td>
                      <td>
                        {bank.acceur_status
                          ? bank.acceur_status
                          : bank.accusd_status
                            ? bank.accusd_status
                            : bank.accgbp_status}
                      </td>
                      <td>
                        <button
                          className={`btn ${bank.acceur_status === "Activo" ||
                              bank.accusd_status === "Activo" ||
                              bank.accgbp_status === "Activo"
                              ? "btn-danger"
                              : "btn-success"
                            }`}
                          onClick={() => handleStatus(bank)}
                        >
                          {bank.acceur_status && bank.acceur_id
                            ? bank.acceur_status === "Activo"
                              ? "Desactivar"
                              : "Activar"
                            : bank.accusd_status && bank.accusd_id
                              ? bank.accusd_status === "Activo"
                                ? "Desactivar"
                                : "Activar"
                              : bank.accgbp_status && bank.accgbp_id
                                ? bank.accgbp_status === "Activo"
                                  ? "Desactivar"
                                  : "Activar"
                                : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No se han agregado bancos aún.</p>
          )}
        </div>

        {/* Modal para agregar banco */}
        {/* Modal para agregar banco */}
        {showModal && (
          <div className="modal show">
            <div className="modal-content">
              <h3>Agregar Nuevo Banco</h3>
              <form onSubmit={handleSubmit}>
                {/* Select para elegir moneda */}
                <label className="select-label">Moneda:</label>
                <div className="select-container">
                  <select
                    className="select-currency"
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option>Seleccione una moneda</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                {currency === "EUR" ? (
                  <>
                    <label>
                      Nombre del Banco:
                      <input
                        type="text"
                        name="acceur_Bank"
                        value={acceur_Bank}
                        onChange={(e) => setAcceur_Bank(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Titular de la Cuenta:
                      <input
                        type="text"
                        name="acceur_owner"
                        value={acceur_owner}
                        onChange={(e) => setAcceur_owner(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Número de Cuenta:
                      <input
                        type="text"
                        name="acceur_number"
                        value={acceur_number}
                        onChange={(e) => setAcceur_number(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      NIE/NIF:
                      <input
                        type="text"
                        name="acceur_nie"
                        value={acceur_nie}
                        onChange={(e) => setAcceur_nie(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      CONCEPTO                      
                      <input
                        type="text"
                        name="acceur_swift"
                        value={acceur_swift}
                        onChange={(e) => setAcceur_swift(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Teléfono:
                      <input
                        type="text"
                        name="acceur_phone"
                        value={acceur_phone}
                        onChange={(e) => setAcceur_phone(e.target.value)}
                        required
                      />
                    </label>
                  </>
                ) : currency === "GBP" ? (
                  <>
                    <label>
                      Nombre del Banco:
                      <input
                        type="text"
                        name="accgbp_Bank"
                        value={accgbp_Bank}
                        onChange={(e) => setAccgbp_Bank(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Titular de la Cuenta:
                      <input
                        type="text"
                        name="accgbp_owner"
                        value={accgbp_owner}
                        onChange={(e) => setAccgbp_owner(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Número de Cuenta:
                      <input
                        type="text"
                        name="accgbp_number"
                        value={accgbp_number}
                        onChange={(e) => setAccgbp_number(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Identificación:
                      <input
                        type="text"
                        name="accgbp_Ident"
                        value={accgbp_Ident}
                        onChange={(e) => setAccgbp_Ident(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      CONCEPTO
                      <input
                        type="text"
                        name="accgbp_swift"
                        value={accgbp_swift}
                        onChange={(e) => setAccgbp_swift(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Código de Sucursal:
                      <input
                        type="text"
                        name="accgbp_codSucursal"
                        value={accgbp_codSucursal}
                        onChange={(e) => setAccgbp_codSucursal(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Teléfono:
                      <input
                        type="text"
                        name="accgbp_phone"
                        value={accgbp_phone}
                        onChange={(e) => setAccgbp_phone(e.target.value)}
                        required
                      />
                    </label>
                  </>
                ) : currency === "USD" ? (
                  <>
                    <label>
                      Nombre del Banco:
                      <input
                        type="text"
                        name="accusd_Bank"
                        value={accusd_Bank}
                        onChange={(e) => setAccusd_Bank(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Titular de la Cuenta:
                      <input
                        type="text"
                        name="accusd_owner"
                        value={accusd_owner}
                        onChange={(e) => setAccusd_owner(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Correo Electrónico:
                      <input
                        type="email"
                        name="accusd_email"
                        value={accusd_email}
                        onChange={(e) => setAccusd_email(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Número de Cuenta:
                      <input
                        type="text"
                        name="accusd_number"
                        value={accusd_number}
                        onChange={(e) => setAccusd_number(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Identificación:
                      <input
                        type="text"
                        name="accusd_Ident"
                        value={accusd_Ident}
                        onChange={(e) => setAccusd_Ident(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      CONCEPTO
                      <input
                        type="text"
                        name="accusd_phone"
                        value={accusd_phone}
                        onChange={(e) => setAccusd_phone(e.target.value)}
                        required
                      />
                    </label>
                  </>
                ) : null}
                <button type="submit" className="btn btn-primary">
                  Guardar Banco
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export { Banks };
