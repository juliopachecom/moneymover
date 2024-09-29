import React, { useState, useEffect, useCallback } from "react";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import NavBarAdmin from "../Components/NavBarAdmin";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import ukFlag from "../Assets/Images/uk.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";

function CurrencyPrice() {
  const { infoTkn, url } = useDataContext();

  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [porcentPrice, setPorcentPrice] = useState([]);
  const [porcent, setPorcent] = useState([]);
  const [porcentId, setPorcentId] = useState(null);

  const [activeMainTab, setActiveMainTab] = useState("Tasas");

  const [formDataPorcent, setFormDataPorcent] = useState({
    por_porcentGbp: "",
    por_porcentEur: "",
    por_porcentUsd: "",
    por_deliveryPrice: "",
  });

  const [formData, setFormData] = useState({
    cur_EurToBs: "",
    cur_EurToUsd: "",
    cur_EurToGbp: "",
    cur_EurToUsd_Pa: "",
    cur_EurToUsd_Ecu: "",
    cur_EurToSol_Pe: "",
    cur_EurToPes_Ch: "",
    cur_EurToPes_Mex: "",
    cur_EurToCol_Pes: "",
    cur_EurToArg_Pes: "",
    cur_EurToBra_Rea: "",
    cur_EurToUru_Pes: "",
    cur_EurToPar_Gua: "",
    cur_EurToBol_Bol: "",
    cur_UsdToBs: "",
    cur_UsdToEur: "",
    cur_UsdToGbp: "",
    cur_UsdToUsd_Pa: "",
    cur_UsdToUsd_Ecu: "",
    cur_UsdToSol_Pe: "",
    cur_UsdToPes_Ch: "",
    cur_UsdToPes_Mex: "",
    cur_UsdToCol_Pes: "",
    cur_UsdToArg_Pes: "",
    cur_UsdToBra_Rea: "",
    cur_UsdToUru_Pes: "",
    cur_UsdToPar_Gua: "",
    cur_UsdToBol_Bol: "",
    cur_GbpToBs: "",
    cur_GbpToUsd: "",
    cur_GbpToEur: "",
    cur_GbpToUsd_Pa: "",
    cur_GbpToUsd_Ecu: "",
    cur_GbpToSol_Pe: "",
    cur_GbpToPes_Ch: "",
    cur_GbpToPes_Mex: "",
    cur_GbpToCol_Pes: "",
    cur_GbpToArg_Pes: "",
    cur_GbpToBra_Rea: "",
    cur_GbpToUru_Pes: "",
    cur_GbpToPar_Gua: "",
    cur_GbpToBol_Bol: "",
    cur_UsdtToBs: "",
    cur_UsdtToUsd: "",
  });

  const [location, setLocation] = useState("Obligatorio"); // Estado inicial
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("EUR");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/CurrencyPrice`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setCurrencyPrice(response.data);
      // Set default values from the database
      setFormData(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setFormData, url]);

  const fetchDataPorcents = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/PorcentPrice/`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setPorcentPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setPorcentPrice, url]);

  useEffect(() => {
    fetchData();
    fetchDataPorcents();
  }, [fetchData, fetchDataPorcents]);

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${url}/CurrencyPrice/1`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`
        }
      });

      fetchData();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchingPorcent = async (id) => {
    try {
      if (id) {
        setPorcentId(id);

        const response = await axios.get(`${url}/PorcentPrice/${id}`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`
          }
        });
        setPorcent(response.data);

        setFormDataPorcent({
          por_porcentGbp: response.data.por_porcentGbp,
          por_porcentEur: response.data.por_porcentEur,
          por_porcentUsd: response.data.por_porcentUsd,
          por_deliveryPrice: response.data.por_deliveryPrice,
          por_status: response.data.por_status,
          por_comment: response.data.por_comment,
        });

        setLocation(response.data.por_status);
        setAdditionalInfo(response.data.por_comment);
      } else {
        setFormDataPorcent({
          por_porcentGbp: '',
          por_porcentEur: '',
          por_porcentUsd: '',
          por_deliveryPrice: '',
          por_status: '',
          por_comment: '',
        });

        setPorcent(null);
        setLocation('');
        setAdditionalInfo('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePorcentaje = async () => {
    try {
      const requestData = {
        por_porcentGbp: formDataPorcent.por_porcentGbp,
        por_porcentEur: formDataPorcent.por_porcentEur,
        por_porcentUsd: formDataPorcent.por_porcentUsd,
        por_deliveryPrice: formDataPorcent.por_deliveryPrice,
        por_status: location,
        por_comment: additionalInfo,
      };

      const id = porcentId;

      await axios.put(`${url}/PorcentPrice/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`
        }
      });

      handleFetchingPorcent();
    } catch (error) {
      console.error('Error al actualizar los datos de porcentaje:', error);
    }
  };

  const handleInputChangePorcent = (e) => {
    setFormDataPorcent({
      ...formDataPorcent,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleLocationChange = (newLocation) => {
  //   setLocation(newLocation);
  //   setAdditionalInfo('');
  // };

  // const handleAdditionalInfoChange = (e) => {
  //   setAdditionalInfo(e.target.value);
  // };

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
                  value={formData.cur_EurToBs}
                  onChange={handleInputChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
              <label>
                <img src={spainFlag} alt="EUR" className="flag" /> EUR a USD:
                <input
                  type="number"
                  name="cur_EurToUsd"
                  value={formData.cur_EurToUsd}
                  onChange={handleInputChange}
                />
                <img src={usaFlag} alt="USD" className="flag" />
              </label>
              <label>
                <img src={usaFlag} alt="USDT" className="flag" /> USDT a Bs:
                <input
                  type="number"
                  name="cur_UsdtToBs"
                  value={formData.cur_UsdtToBs}
                  onChange={handleInputChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
              <label>
                <img src={ukFlag} alt="GBP" className="flag" /> GBP a USD:
                <input
                  type="number"
                  name="cur_GbpToUsd"
                  value={formData.cur_GbpToUsd}
                  onChange={handleInputChange}
                />
                <img src={usaFlag} alt="USD" className="flag" />
              </label>
              <label>
                <img src={ukFlag} alt="GBP" className="flag" /> GBP a Bs:
                <input
                  type="number"
                  name="cur_GbpToBs"
                  value={formData.cur_GbpToBs}
                  onChange={handleInputChange}
                />
                <img src={venezuelaFlag} alt="Bs" className="flag" />
              </label>
            </div>
            <button className="btn btn-primary" onClick={openModal}>
              Editar Tasas Secundarias
            </button>
            <button className="btn btn-success" onClick={handleEdit}>
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
                  value={formDataPorcent.por_porcentGbp}
                  onChange={handleInputChangePorcent}
                />
              </label>
              <label>
                Porcentaje USD:
                <input
                  type="number"
                  name="por_porcentUsd"
                  value={formDataPorcent.por_porcentUsd}
                  onChange={handleInputChangePorcent}
                />
              </label>
              <label>
                Porcentaje EUR:
                <input
                  type="number"
                  name="por_porcentEur"
                  value={formDataPorcent.por_porcentEur}
                  onChange={handleInputChangePorcent}
                />
              </label>

              <label>
                Localización:
                <select
                  name="por_stateLocation"
                  value={formDataPorcent.por_stateLocation}
                  onChange={handleInputChangePorcent}
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
                  value={formDataPorcent.por_status}
                  onChange={handleInputChangePorcent}
                >
                  <option value="obligatorio">Obligatorio</option>
                  <option value="oficina">Oficina</option>
                  <option value="desactivado">Desactivado</option>
                </select>
              </label>

              {formDataPorcent.por_status === "obligatorio" && (
                <label>
                  Precio de Entrega:
                  <input
                    type="number"
                    name="por_deliveryPrice"
                    value={formDataPorcent.por_deliveryPrice}
                    onChange={handleInputChangePorcent}
                  />
                </label>
              )}

              {formDataPorcent.por_status === "oficina" && (
                <label>
                  Comentario:
                  <input
                    type="text"
                    name="por_comment"
                    value={formDataPorcent.por_comment}
                    onChange={handleInputChangePorcent}
                  />
                </label>
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUpdatePorcentaje}
            >
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
                      value={formData.cur_EurToUsd_Pa}
                      onChange={handleInputChange}
                    />
                    <label>EUR to USD (Ecuador):</label>
                    <input
                      type="number"
                      name="cur_EurToUsd_Ecu"
                      value={formData.cur_EurToUsd_Ecu}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Sol (Perú):</label>
                    <input
                      type="number"
                      name="cur_EurToSol_Pe"
                      value={formData.cur_EurToSol_Pe}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Peso Chileno:</label>
                    <input
                      type="number"
                      name="cur_EurToPes_Ch"
                      value={formData.cur_EurToPes_Ch}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Peso Mexicano:</label>
                    <input
                      type="number"
                      name="cur_EurToPes_Mex"
                      value={formData.cur_EurToPes_Mex}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Peso Colombiano:</label>
                    <input
                      type="number"
                      name="cur_EurToCol_Pes"
                      value={formData.cur_EurToCol_Pes}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Peso Argentino:</label>
                    <input
                      type="number"
                      name="cur_EurToArg_Pes"
                      value={formData.cur_EurToArg_Pes}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Real Brasileño:</label>
                    <input
                      type="number"
                      name="cur_EurToBra_Rea"
                      value={formData.cur_EurToBra_Rea}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Peso Uruguayo:</label>
                    <input
                      type="number"
                      name="cur_EurToUru_Pes"
                      value={formData.cur_EurToUru_Pes}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Guaraní Paraguayo:</label>
                    <input
                      type="number"
                      name="cur_EurToPar_Gua"
                      value={formData.cur_EurToPar_Gua}
                      onChange={handleInputChange}
                    />
                    <label>EUR to Boliviano:</label>
                    <input
                      type="number"
                      name="cur_EurToBol_Bol"
                      value={formData.cur_EurToBol_Bol}
                      onChange={handleInputChange}
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
                      value={formData.cur_UsdToSol_Pe}
                      onChange={handleInputChange}
                    />
                    <label>USD to Peso Chileno:</label>
                    <input
                      type="number"
                      name="cur_UsdToPes_Ch"
                      value={formData.cur_UsdToPes_Ch}
                      onChange={handleInputChange}
                    />
                    <label>USD to Peso Mexicano:</label>
                    <input
                      type="number"
                      name="cur_UsdToPes_Mex"
                      value={formData.cur_UsdToPes_Mex}
                      onChange={handleInputChange}
                    />
                    <label>USD to Peso Colombiano:</label>
                    <input
                      type="number"
                      name="cur_UsdToCol_Pes"
                      value={formData.cur_UsdToCol_Pes}
                      onChange={handleInputChange}
                    />
                    <label>USD to Peso Argentino:</label>
                    <input
                      type="number"
                      name="cur_UsdToArg_Pes"
                      value={formData.cur_UsdToArg_Pes}
                      onChange={handleInputChange}
                    />
                    <label>USD to Real Brasileño:</label>
                    <input
                      type="number"
                      name="cur_UsdToBra_Rea"
                      value={formData.cur_UsdToBra_Rea}
                      onChange={handleInputChange}
                    />
                    <label>USD to Peso Uruguayo:</label>
                    <input
                      type="number"
                      name="cur_UsdToUru_Pes"
                      value={formData.cur_UsdToUru_Pes}
                      onChange={handleInputChange}
                    />
                    <label>USD to Guaraní Paraguayo:</label>
                    <input
                      type="number"
                      name="cur_UsdToPar_Gua"
                      value={formData.cur_UsdToPar_Gua}
                      onChange={handleInputChange}
                    />
                    <label>USD to Boliviano:</label>
                    <input
                      type="number"
                      name="cur_UsdToBol_Bol"
                      value={formData.cur_UsdToBol_Bol}
                      onChange={handleInputChange}
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
                      value={formData.cur_GbpToSol_Pe}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Peso Chileno:</label>
                    <input
                      type="number"
                      name="cur_GbpToPes_Ch"
                      value={formData.cur_GbpToPes_Ch}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Peso Mexicano:</label>
                    <input
                      type="number"
                      name="cur_GbpToPes_Mex"
                      value={formData.cur_GbpToPes_Mex}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Peso Colombiano:</label>
                    <input
                      type="number"
                      name="cur_GbpToCol_Pes"
                      value={formData.cur_GbpToCol_Pes}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Peso Argentino:</label>
                    <input
                      type="number"
                      name="cur_GbpToArg_Pes"
                      value={formData.cur_GbpToArg_Pes}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Real Brasileño:</label>
                    <input
                      type="number"
                      name="cur_GbpToBra_Rea"
                      value={formData.cur_GbpToBra_Rea}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Peso Uruguayo:</label>
                    <input
                      type="number"
                      name="cur_GbpToUru_Pes"
                      value={formData.cur_GbpToUru_Pes}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Guaraní Paraguayo:</label>
                    <input
                      type="number"
                      name="cur_GbpToPar_Gua"
                      value={formData.cur_GbpToPar_Gua}
                      onChange={handleInputChange}
                    />
                    <label>GBP to Boliviano:</label>
                    <input
                      type="number"
                      name="cur_GbpToBol_Bol"
                      value={formData.cur_GbpToBol_Bol}
                      onChange={handleInputChange}
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
                      value={formData.cur_UsdtToBs}
                      onChange={handleInputChange}
                    />
                    <label>USDT to USD:</label>
                    <input
                      type="number"
                      name="cur_UsdtToUsd"
                      value={formData.cur_UsdtToUsd}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={handleEdit}>
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
