import React, { useState } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaPlus } from "react-icons/fa";

function Banks() {
    
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBank((prevBank) => ({
      ...prevBank,
      [name]: value,
    }));
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
                {banks.map((bank, index) => (
                  <tr key={index}>
                    <td>{bank.bankName}</td>
                    <td>{bank.iban}</td>
                    <td>{bank.swift}</td>
                    <td>{bank.accountHolder}</td>
                    <td>{bank.active ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button
                        className={`btn ${
                          bank.active ? "btn-danger" : "btn-success"
                        }`}
                        onClick={() => toggleBankStatus(index)}
                      >
                        {bank.active ? "Desactivar" : "Activar"}
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
                <label>
                  SWIFT/BIC:
                  <input
                    type="text"
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
