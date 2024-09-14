import React, { useState } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import ukFlag from "../Assets/Images/uk.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";

function CurrencyPrice() {
    const [activeMainTab, setActiveMainTab] = useState("Tasas");

  // Estados para las tasas principales y secundarias
  const [mainRates, setMainRates] = useState({
    cur_EurToBs: 1,
    cur_EurToUsd: 1,
    cur_UsdtToBs: 1,
    cur_GbpToUsd: 1,
    cur_GbpToBs: 1,
  });

  //Porcentaje de entrega en efectivo
  const [cashDelivery, setCashDelivery] = useState({
    por_porcentGbp: 1,
    por_porcentUsd: 1,
    por_porcentEur: 1,
    por_stateLocation: "Zulia",
    por_status: "oficina", // oficina, obligatorio, desactivado
    por_deliveryPrice: 1,
    por_comment: "Entrega en oficina",
  });

  // Manejar cambios en la entrega en efectivo
  const handleCashDeliveryChange = (e) => {
    const { name, value } = e.target;
    setCashDelivery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCashDelivery = () => {
    console.log("Guardando cambios de entrega en efectivo...", cashDelivery);
  };


  const [allRates, setAllRates] = useState({
    cur_EurToBs: 1,
    cur_EurToUsd: 1,
    cur_EurToGbp: 1,
    cur_EurToUsd_Pa: 1,
    cur_EurToUsd_Ecu: 1,
    cur_EurToSol_Pe: 1,
    cur_EurToPes_Ch: 1,
    cur_EurToPes_Mex: 1,
    cur_EurToCol_Pes: 1,
    cur_EurToArg_Pes: 1,
    cur_EurToBra_Rea: 1,
    cur_EurToUru_Pes: 1,
    cur_EurToPar_Gua: 1,
    cur_EurToBol_Bol: 1,
    cur_UsdToBs: 1,
    cur_UsdToEur: 1,
    cur_UsdToGbp: 1,
    cur_UsdToUsd_Pa: 1,
    cur_UsdToUsd_Ecu: 1,
    cur_UsdToSol_Pe: 1,
    cur_UsdToPes_Ch: 1,
    cur_UsdToPes_Mex: 1,
    cur_UsdToCol_Pes: 1,
    cur_UsdToArg_Pes: 1,
    cur_UsdToBra_Rea: 1,
    cur_UsdToUru_Pes: 1,
    cur_UsdToPar_Gua: 1,
    cur_UsdToBol_Bol: 1,
    cur_GbpToBs: 1,
    cur_GbpToUsd: 1,
    cur_GbpToEur: 1,
    cur_GbpToUsd_Pa: 1,
    cur_GbpToUsd_Ecu: 1,
    cur_GbpToSol_Pe: 1,
    cur_GbpToPes_Ch: 1,
    cur_GbpToPes_Mex: 1,
    cur_GbpToCol_Pes: 1,
    cur_GbpToArg_Pes: 1,
    cur_GbpToBra_Rea: 1,
    cur_GbpToUru_Pes: 1,
    cur_GbpToPar_Gua: 1,
    cur_GbpToBol_Bol: 1,
    cur_UsdtToBs: 1,
    cur_UsdtToUsd: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("EUR");

  // Manejar cambios de las tasas principales
  const handleMainRateChange = (e) => {
    const { name, value } = e.target;
    setMainRates((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios de todas las tasas en el modal
  const handleAllRateChange = (e) => {
    const { name, value } = e.target;
    setAllRates((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleUpdateRates = () => {
    console.log("Actualizando tasas principales y secundarias...");
    console.log(mainRates);
    closeModal();
  };

  const handleSaveChanges = () => {
    console.log("Guardando cambios de las tasas secundarias...", allRates);
    closeModal();
  };

  return (
    <div className="currency-price-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Modificar Tasas de Cambio</h2>

        <div className="main-tabs">
          <button
            className={activeMainTab === "Tasas" ? "active" : ""}
            onClick={() => setActiveMainTab("Tasas")}
          >
            Tasas
          </button>
          <button
            className={activeMainTab === "Efectivo" ? "active" : ""}
            onClick={() => setActiveMainTab("Efectivo")}
          >
            Entrega en Efectivo
          </button>
        </div>

        {activeMainTab === "Tasas" && (
          <div className="main-rates-section">
            <h3>Tasas Principales</h3>
            <div className="rate-inputs">
              <label>
                <img src={spainFlag} alt="EUR" className="flag" /> EUR a Bs:
                <input
                  type="number"
                  name="cur_EurToBs"
                  value={mainRates.cur_EurToBs}
                  onChange={handleMainRateChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
              <label>
                <img src={spainFlag} alt="EUR" className="flag" /> EUR a USD:
                <input
                  type="number"
                  name="cur_EurToUsd"
                  value={mainRates.cur_EurToUsd}
                  onChange={handleMainRateChange}
                />
                <img src={usaFlag} alt="USD" className="flag" />
              </label>
              <label>
                <img src={usaFlag} alt="USDT" className="flag" /> USDT a Bs:
                <input
                  type="number"
                  name="cur_UsdtToBs"
                  value={mainRates.cur_UsdtToBs}
                  onChange={handleMainRateChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
              <label>
                <img src={ukFlag} alt="GBP" className="flag" /> GBP a USD:
                <input
                  type="number"
                  name="cur_GbpToUsd"
                  value={mainRates.cur_GbpToUsd}
                  onChange={handleMainRateChange}
                />
                <img src={usaFlag} alt="USD" className="flag" />
              </label>
              <label>
                <img src={ukFlag} alt="GBP" className="flag" /> GBP a Bs:
                <input
                  type="number"
                  name="cur_GbpToBs"
                  value={mainRates.cur_GbpToBs}
                  onChange={handleMainRateChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
            </div>
            <button className="btn btn-primary" onClick={openModal}>
            Editar Tasas Secundarias
          </button>
            <button className="btn btn-success" onClick={handleUpdateRates}>
              Actualizar Tasas
            </button>
          </div>
        )}

        {activeMainTab === "Efectivo" && (
          <div className="cash-delivery-section">
            <h3>Configuración de Entrega en Efectivo</h3>
            <div className="delivery-inputs">
              <label>
                Porcentaje GBP:
                <input
                  type="number"
                  name="por_porcentGbp"
                  value={cashDelivery.por_porcentGbp}
                  onChange={handleCashDeliveryChange}
                />
              </label>
              <label>
                Porcentaje USD:
                <input
                  type="number"
                  name="por_porcentUsd"
                  value={cashDelivery.por_porcentUsd}
                  onChange={handleCashDeliveryChange}
                />
              </label>
              <label>
                Porcentaje EUR:
                <input
                  type="number"
                  name="por_porcentEur"
                  value={cashDelivery.por_porcentEur}
                  onChange={handleCashDeliveryChange}
                />
              </label>

              <label>
                Localización:
                <select
                  name="por_stateLocation"
                  value={cashDelivery.por_stateLocation}
                  onChange={handleCashDeliveryChange}
                >
                  <option value="Zulia">Zulia</option>
                  <option value="Caracas">Caracas</option>
                  <option value="Valencia">Valencia</option>
                </select>
              </label>

              <label>
                Estado de Entrega:
                <select
                  name="por_status"
                  value={cashDelivery.por_status}
                  onChange={handleCashDeliveryChange}
                >
                  <option value="obligatorio">Obligatorio</option>
                  <option value="oficina">Oficina</option>
                  <option value="desactivado">Desactivado</option>
                </select>
              </label>

              {cashDelivery.por_status === "obligatorio" && (
                <label>
                  Precio de Entrega:
                  <input
                    type="number"
                    name="por_deliveryPrice"
                    value={cashDelivery.por_deliveryPrice}
                    onChange={handleCashDeliveryChange}
                  />
                </label>
              )}

              {cashDelivery.por_status === "oficina" && (
                <label>
                  Comentario:
                  <input
                    type="text"
                    name="por_comment"
                    value={cashDelivery.por_comment}
                    onChange={handleCashDeliveryChange}
                  />
                </label>
              )}
            </div>

            <button className="btn btn-primary" onClick={handleSaveCashDelivery}>
              Guardar Configuración
            </button>
          </div>
        )}

        {/* Modal para las tasas secundarias */}
        {showModal && (
  <div className="modal show">
    <div className="modal-content">
      <h3>Modificar Tasas Secundarias</h3>
      <div className="tabs">
        <button
          className={activeTab === "EUR" ? "active" : ""}
          onClick={() => setActiveTab("EUR")}
        >
          EUR
        </button>
        <button
          className={activeTab === "USD" ? "active" : ""}
          onClick={() => setActiveTab("USD")}
        >
          USD
        </button>
        <button
          className={activeTab === "GBP" ? "active" : ""}
          onClick={() => setActiveTab("GBP")}
        >
          GBP
        </button>
        <button
          className={activeTab === "USDT" ? "active" : ""}
          onClick={() => setActiveTab("USDT")}
        >
          USDT
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "EUR" && (
          <div className="eur-rates">
            <label>EUR to USD (Panamá):</label>
            <input
              type="number"
              name="cur_EurToUsd_Pa"
              value={allRates.cur_EurToUsd_Pa}
              onChange={handleAllRateChange}
            />
            <label>EUR to USD (Ecuador):</label>
            <input
              type="number"
              name="cur_EurToUsd_Ecu"
              value={allRates.cur_EurToUsd_Ecu}
              onChange={handleAllRateChange}
            />
            <label>EUR to Sol (Perú):</label>
            <input
              type="number"
              name="cur_EurToSol_Pe"
              value={allRates.cur_EurToSol_Pe}
              onChange={handleAllRateChange}
            />
            <label>EUR to Peso Chileno:</label>
            <input
              type="number"
              name="cur_EurToPes_Ch"
              value={allRates.cur_EurToPes_Ch}
              onChange={handleAllRateChange}
            />
            <label>EUR to Peso Mexicano:</label>
            <input
              type="number"
              name="cur_EurToPes_Mex"
              value={allRates.cur_EurToPes_Mex}
              onChange={handleAllRateChange}
            />
            <label>EUR to Peso Colombiano:</label>
            <input
              type="number"
              name="cur_EurToCol_Pes"
              value={allRates.cur_EurToCol_Pes}
              onChange={handleAllRateChange}
            />
            <label>EUR to Peso Argentino:</label>
            <input
              type="number"
              name="cur_EurToArg_Pes"
              value={allRates.cur_EurToArg_Pes}
              onChange={handleAllRateChange}
            />
            <label>EUR to Real Brasileño:</label>
            <input
              type="number"
              name="cur_EurToBra_Rea"
              value={allRates.cur_EurToBra_Rea}
              onChange={handleAllRateChange}
            />
            <label>EUR to Peso Uruguayo:</label>
            <input
              type="number"
              name="cur_EurToUru_Pes"
              value={allRates.cur_EurToUru_Pes}
              onChange={handleAllRateChange}
            />
            <label>EUR to Guaraní Paraguayo:</label>
            <input
              type="number"
              name="cur_EurToPar_Gua"
              value={allRates.cur_EurToPar_Gua}
              onChange={handleAllRateChange}
            />
            <label>EUR to Boliviano:</label>
            <input
              type="number"
              name="cur_EurToBol_Bol"
              value={allRates.cur_EurToBol_Bol}
              onChange={handleAllRateChange}
            />
            {/* Resto de tasas relacionadas con EUR */}
          </div>
        )}
        {activeTab === "USD" && (
          <div className="usd-rates">         
            <label>USD to Sol (Perú):</label>
            <input
              type="number"
              name="cur_UsdToSol_Pe"
              value={allRates.cur_UsdToSol_Pe}
              onChange={handleAllRateChange}
            />
            <label>USD to Peso Chileno:</label>
            <input
              type="number"
              name="cur_UsdToPes_Ch"
              value={allRates.cur_UsdToPes_Ch}
              onChange={handleAllRateChange}
            />
            <label>USD to Peso Mexicano:</label>
            <input
              type="number"
              name="cur_UsdToPes_Mex"
              value={allRates.cur_UsdToPes_Mex}
              onChange={handleAllRateChange}
            />
            <label>USD to Peso Colombiano:</label>
            <input
              type="number"
              name="cur_UsdToCol_Pes"
              value={allRates.cur_UsdToCol_Pes}
              onChange={handleAllRateChange}
            />
            <label>USD to Peso Argentino:</label>
            <input
              type="number"
              name="cur_UsdToArg_Pes"
              value={allRates.cur_UsdToArg_Pes}
              onChange={handleAllRateChange}
            />
            <label>USD to Real Brasileño:</label>
            <input
              type="number"
              name="cur_UsdToBra_Rea"
              value={allRates.cur_UsdToBra_Rea}
              onChange={handleAllRateChange}
            />
            <label>USD to Peso Uruguayo:</label>
            <input
              type="number"
              name="cur_UsdToUru_Pes"
              value={allRates.cur_UsdToUru_Pes}
              onChange={handleAllRateChange}
            />
            <label>USD to Guaraní Paraguayo:</label>
            <input
              type="number"
              name="cur_UsdToPar_Gua"
              value={allRates.cur_UsdToPar_Gua}
              onChange={handleAllRateChange}
            />
            <label>USD to Boliviano:</label>
            <input
              type="number"
              name="cur_UsdToBol_Bol"
              value={allRates.cur_UsdToBol_Bol}
              onChange={handleAllRateChange}
            />
            {/* Resto de tasas relacionadas con USD */}
          </div>
        )}
        {activeTab === "GBP" && (
          <div className="gbp-rates">
           
            
           
            <label>GBP to Sol (Perú):</label>
            <input
              type="number"
              name="cur_GbpToSol_Pe"
              value={allRates.cur_GbpToSol_Pe}
              onChange={handleAllRateChange}
            />
            <label>GBP to Peso Chileno:</label>
            <input
              type="number"
              name="cur_GbpToPes_Ch"
              value={allRates.cur_GbpToPes_Ch}
              onChange={handleAllRateChange}
            />
            <label>GBP to Peso Mexicano:</label>
            <input
              type="number"
              name="cur_GbpToPes_Mex"
              value={allRates.cur_GbpToPes_Mex}
              onChange={handleAllRateChange}
            />
            <label>GBP to Peso Colombiano:</label>
            <input
              type="number"
              name="cur_GbpToCol_Pes"
              value={allRates.cur_GbpToCol_Pes}
              onChange={handleAllRateChange}
            />
            <label>GBP to Peso Argentino:</label>
            <input
              type="number"
              name="cur_GbpToArg_Pes"
              value={allRates.cur_GbpToArg_Pes}
              onChange={handleAllRateChange}
            />
            <label>GBP to Real Brasileño:</label>
            <input
              type="number"
              name="cur_GbpToBra_Rea"
              value={allRates.cur_GbpToBra_Rea}
              onChange={handleAllRateChange}
            />
            <label>GBP to Peso Uruguayo:</label>
            <input
              type="number"
              name="cur_GbpToUru_Pes"
              value={allRates.cur_GbpToUru_Pes}
              onChange={handleAllRateChange}
            />
            <label>GBP to Guaraní Paraguayo:</label>
            <input
              type="number"
              name="cur_GbpToPar_Gua"
              value={allRates.cur_GbpToPar_Gua}
              onChange={handleAllRateChange}
            />
            <label>GBP to Boliviano:</label>
            <input
              type="number"
              name="cur_GbpToBol_Bol"
              value={allRates.cur_GbpToBol_Bol}
              onChange={handleAllRateChange}
            />
            {/* Resto de tasas relacionadas con GBP */}
          </div>
        )}
        {activeTab === "USDT" && (
          <div className="usdt-rates">
            <label>USDT to Bs:</label>
            <input
              type="number"
              name="cur_UsdtToBs"
              value={allRates.cur_UsdtToBs}
              onChange={handleAllRateChange}
            />
            <label>USDT to USD:</label>
            <input
              type="number"
              name="cur_UsdtToUsd"
              value={allRates.cur_UsdtToUsd}
              onChange={handleAllRateChange}
            />
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={handleSaveChanges}>
        Guardar Cambios
      </button>
      <button className="btn btn-secondary" onClick={closeModal}>
        Cerrar
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export { CurrencyPrice };
