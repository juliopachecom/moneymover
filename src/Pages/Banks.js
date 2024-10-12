import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaPlus } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
import { useDataContext } from "../Context/dataContext";

function Banks() {
  const { infoTkn, url } = useDataContext();

  const [banksEur, setBanksEUR] = useState([]);
  const [banksUsd, setBanksUSD] = useState([]);
  const [banksGbp, setBanksGBP] = useState([]);
  const [currency, setCurrency] = useState("EUR"); // Estado para la moneda seleccionada

  // const [banksBs, setBanksBS] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");

  // const [admin, setAdmin] = useState([]);

  // const [acceur_Bank, setAcceur_Bank] = useState("");
  // const [acceur_owner, setAcceur_owner] = useState("");
  // const [acceur_number, setAcceur_number] = useState("");
  // const [acceur_nie, setAcceur_nie] = useState("");
  // const [acceur_phone, setAcceur_phone] = useState("");

  // const [accgbp_Bank, setAccgbp_Bank] = useState("");
  // const [accgbp_owner, setAccgbp_owner] = useState("");
  // const [accgbp_number, setAccgbp_number] = useState("");
  // const [accgbp_Ident, setAccgbp_Ident] = useState("");
  // const [accgbp_phone, setAccgbp_phone] = useState("");

  // const [accusd_Bank, setAccusd_Bank] = useState("");
  // const [accusd_owner, setAccusd_owner] = useState("");
  // const [accusd_email, setAccusd_email] = useState("");
  // const [accusd_number, setAccusd_number] = useState("");
  // const [accusd_Ident, setAccusd_Ident] = useState("");
  // const [accusd_phone, setAccusd_phone] = useState("");

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

  // Estado para los bancos
  const [banks, setBanks] = useState([
    {
      bankName: "Banco Santander",
      iban: "ES9121000418450200051332",
      swift: "BSCHESMMXXX",
      accountHolder: "Juan Pérez",
      active: true,
    },
    {
      bankName: "CaixaBank",
      iban: "ES7921000813610123456789",
      swift: "CAIXESBBXXX",
      accountHolder: "Maria García",
      active: false,
    },
    {
      bankName: "BBVA",
      iban: "ES9121000418450200067890",
      swift: "BBVAESMMXXX",
      accountHolder: "Pedro Fernández",
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBank, setNewBank] = useState({
    bankName: "",
    iban: "",
    swift: "",
    accountHolder: "",
  });

  // Función para abrir el modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewBank({ bankName: "", iban: "", swift: "", accountHolder: "" });
  };

  // Función para manejar el cambio de input
  // Función para manejar el cambio de input, incluyendo la moneda
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currency") {
      setCurrency(value);
    } else {
      setNewBank((prevBank) => ({
        ...prevBank,
        [name]: value,
      }));
    }
  };

  // Función para añadir un nuevo banco
  const handleAddBank = (e) => {
    e.preventDefault();
    setBanks((prevBanks) => [...prevBanks, { ...newBank, active: true }]);
    closeModal();
  };

  // Función para alternar el estado activo/inactivo de un banco
  const toggleBankStatus = (index) => {
    const updatedBanks = [...banks];
    updatedBanks[index].active = !updatedBanks[index].active;
    setBanks(updatedBanks);
  };

  useEffect(() => {
    fetchDataEUR();
    fetchDataUSD();
    fetchDataGBP();
  }, [fetchDataEUR, fetchDataUSD, fetchDataGBP]);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (typeAcc === "EUR") {
  //     try {
  //       await axios.post(
  //         `${url}/Acceur/create`,
  //         {
  //           acceur_Bank,
  //           acceur_owner,
  //           acceur_number,
  //           acceur_nie,
  //           acceur_phone,
  //           acceur_type: "Normal",
  //           acceur_status: "Activo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${infoTkn}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   if (typeAcc === "GBP") {
  //     try {
  //       await axios.post(
  //         `${url}/Accgbp/create`,
  //         {
  //           accgbp_Bank,
  //           accgbp_owner,
  //           accgbp_number,
  //           accgbp_Ident,
  //           accgbp_phone,
  //           accgbp_status: "Activo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${infoTkn}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   if (typeAcc === "USD") {
  //     try {
  //       await axios.post(
  //         `${url}/Accusd/create`,
  //         {
  //           accusd_Bank,
  //           accusd_owner,
  //           accusd_email,
  //           accusd_number,
  //           accusd_Ident,
  //           accusd_phone,
  //           accusd_type: "Normal",
  //           accusd_status: "Activo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${infoTkn}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // const handleEdit = async (event) => {
  //   event.preventDefault();

  //   if (selectModal.acceur_Bank) {
  //     try {
  //       await axios.put(
  //         `${url}/Acceur/${selectModal.acceur_id}`,
  //         {
  //           acceur_status:
  //             selectModal.acceur_status === "Desactivo"
  //               ? "Activo"
  //               : "Desactivo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessAdminToken.access_token}`,
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //       fetchDataBS();

  //       toast.success("¡Datos cambiados con éxito!", {
  //         position: "bottom-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });

  //       toggle1();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   if (selectModal.accgbp_Bank) {
  //     try {
  //       await axios.put(
  //         `${url}/Accgbp/${selectModal.accgbp_id}`,
  //         {
  //           accgbp_status:
  //             selectModal.accgbp_status === "Desactivo"
  //               ? "Activo"
  //               : "Desactivo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessAdminToken.access_token}`,
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //       fetchDataBS();

  //       toast.success("¡Datos cambiados con éxito!", {
  //         position: "bottom-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });

  //       toggle1();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   if (selectModal.accusd_Bank) {
  //     try {
  //       await axios.put(
  //         `${url}/Accusd/${selectModal.accusd_id}`,
  //         {
  //           accusd_status:
  //             selectModal.accusd_status === "Desactivo"
  //               ? "Activo"
  //               : "Desactivo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessAdminToken.access_token}`,
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //       fetchDataBS();

  //       toast.success("¡Datos cambiados con éxito!", {
  //         position: "bottom-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });

  //       toggle1();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   if (selectModal.accbs_bank) {
  //     try {
  //       await axios.put(
  //         `${url}/Accbs/${selectModal.accbs_id}`,
  //         {
  //           accbs_status:
  //             selectModal.accbs_status === "Desactivo" ? "Activo" : "Desactivo",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessAdminToken.access_token}`,
  //           },
  //         }
  //       );

  //       fetchDataEUR();
  //       fetchDataGBP();
  //       fetchDataUSD();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  return (
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
          {banks.length > 0 ? (
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
                      <td>bank.swift</td>
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
                          className={`btn ${
                            bank.active ? "btn-danger" : "btn-success"
                          }`}
                          onClick={() =>
                            toggleBankStatus(
                              bank.acceur_id
                                ? bank.acceur_id
                                : bank.accusd_id
                                ? bank.accusd_id
                                : bank.accgbp_id
                            )
                          }
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
              <form onSubmit={handleAddBank}>
                <label>
                  Nombre del Banco:
                  <input
                    type="text"
                    name="bankName"
                    value={newBank.bankName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                {/* Select para elegir moneda */}
                <label className="select-label">Moneda:</label>
                <div className="select-container">
                  <select
                    className="select-currency"
                    name="currency"
                    value={currency}
                    onChange={handleInputChange}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <label>
                  IBAN:
                  <input
                    type="text"
                    name="iban"
                    value={newBank.iban}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                {/* Cambiar campo SWIFT a correo electrónico si la moneda es USD */}
                <label>
                  {currency === "USD"
                    ? "Correo Electrónico (Zelle)"
                    : "SWIFT/BIC"}
                  :
                  <input
                    type={currency === "USD" ? "email" : "text"}
                    name="swift"
                    value={newBank.swift}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Titular de la Cuenta:
                  <input
                    type="text"
                    name="accountHolder"
                    value={newBank.accountHolder}
                    onChange={handleInputChange}
                    required
                  />
                </label>

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
  );
}

export { Banks };
