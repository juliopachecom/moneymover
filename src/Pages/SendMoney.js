import React, { useState, useEffect, useCallback } from "react";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import { NavBarUser } from "../Components/NavBarUser";
import { FaCheckCircle } from "react-icons/fa"; // Icono de check para confirmación
import { StepTracker } from "../Components/StepTracker"; // Importación del componente StepTracker
import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { useHistory } from "react-router-dom";

function SendMoney() {
  const { logged, infoTkn, url } = useDataContext();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // Controla los pasos del formulario
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [selectedOption, setSelectedOption] = useState(""); // Controla la opción seleccionada (Pago Móvil o Cuenta Bancaria)

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [cash, setCash] = useState("");
  const [cashPhone, setCashPhone] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  //Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Datos de Envio de remesas
  const [payment, setPayment] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [amountToReceive, setAmountToReceive] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  // const [receiveAmount, setReceiveAmount] = useState(0);
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [mov_img, setMov_img] = useState("");
  const [showConfirmationr, setShowConfirmationr] = useState(false);

  //DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState("");
  const [accbsUser_owner, setAccbsUser_owner] = useState("");
  const [accbsUser_number, setAccbsUser_number] = useState("");
  const [accbsUser_dni, setAccbsUser_dni] = useState("");
  const [accbsUser_phone, setAccbsUser_phone] = useState("");

  // Fetch de datos del usuario (Incluye movimientos y directorio)
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      const responseDirectory = await axios.get(
        `${url}/AccBsUser/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserDirectory(responseDirectory.data);
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

  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni,
          accbsUser_phone,
          accbsUser_type: selectedOption,
          accbsUser_status: "activo",
          accbsUser_userId: user.use_id,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      // Refresh the page after adding account
      fetchDataUser();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrencyChange = (e) => {
    setPayment(e.target.value);
  };

  const handleamountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);

    currencyPrice.forEach((coin) => {
      if (payment === "EUR") {
        setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToBs);
      } else if (payment === "GBP") {
        setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToBs);
      } else if (payment === "USD") {
        setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToBs);
      }
    });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const validateAmount = () => {
    const minAmount = 20;

    if (amount < minAmount) {
      alert(`El monto mínimo a enviar es ${minAmount} ${payment}`);
      return false;
    }

    // if (amount > maxAmount) {
    //   alert(`No puedes enviar más de tu saldo disponible: ${maxAmount} ${payment}`);
    //   return false;
    // }

    return true;
  };

  const handleContinue = () => {
    if (validateAmount()) {
      setStep(step + 1); // Pasar al siguiente paso
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep(3); // Pasar al paso de confirmación
  };

  const handleConfirm = () => {
    // Lógica de envío de los datos
    setShowAlert(true); // Mostrar alerta de éxito
  };

  //Enviar a espera un retiro
  const handleSubmitSend = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("mov_currency", payment);
    formData.append("mov_amount", amount);
    formData.append("mov_type", "Retiro");
    formData.append("mov_status", "E");
    formData.append("mov_code", "");
    formData.append("mov_phone", "");

    // const selectedAccount = userDirectory.find(
    //   (account) =>
    //     parseInt(account.accbsUser_id) === parseInt(selectedIdAccount)
    // );
    formData.append(
      "mov_comment",
      "Hola"
      // `${
      //   (sendOption === "Cuenta Bancaria" || sendOption === "Pago Movil") &&
      //   `Banco: ` +
      //     selectedAccount.accbsUser_bank +
      //     `\n Propietario: ` +
      //     selectedAccount.accbsUser_owner +
      //     `\n Número de cuenta: ` +
      //     selectedAccount.accbsUser_number +
      //     `\n DNI: ` +
      //     selectedAccount.accbsUser_dni +
      //     `\n Teléfono: ` +
      //     selectedAccount.accbsUser_phone +
      //     `\n Tipo de cuenta: ` +
      //     selectedAccount.accbsUser_type +
      //     `\n` +
      //     sendOption
      // } ${
      //   sendOption === "Transferencias por dólares" &&
      //   accNumber + accBank + accOwner + accTlf + accDni + sendOption
      // } ${
      //   sendOption === "Efectivo" && porcent
      //     ? `\n` +
      //       porcent.por_stateLocation +
      //       `\n` +
      //       accNumber +
      //       accBank +
      //       accOwner +
      //       accTlf +
      //       accDni +
      //       `\n`
      //     : ""
      // } ${
      //   sendOption === "Efectivo" && porcent.por_comment !== ""
      //     ? porcent.por_comment + "\n"
      //     : ""
      // }` + note
    );
    formData.append("mov_img", "Retiro de Divisa");
    formData.append("mov_typeOutflow", "sendOption");
    formData.append("mov_accEurId", payment === "EUR" ? 99 : 0);
    formData.append("mov_accUsdId", payment === "USD" ? 99 : 0);
    formData.append("mov_accGbpId", payment === "GBP" ? 99 : 0);
    formData.append("mov_userId", user.use_id);
    formData.append("mov_accBsUserId", selectedBeneficiary.accbsUser_id);

    console.log(selectedBeneficiary);

    const formDataUser = new FormData();
    // if (sendOption === "Efectivo") {
    //   formDataUser.append(
    //     "use_amountUsd",
    //     payment === "USD"
    //       ? user.use_amountUsd - amountToReceive
    //       : user.use_amountUsd
    //   );
    //   formDataUser.append(
    //     "use_amountGbp",
    //     payment === "GBP"
    //       ? user.use_amountGbp - amountToReceive
    //       : user.use_amountGbp
    //   );
    //   formDataUser.append(
    //     "use_amountEur",
    //     payment === "EUR"
    //       ? user.use_amountEur - amountToReceive
    //       : user.use_amountEur
    //   );
    // } else {
    // }
    formDataUser.append(
      "use_amountUsd",
      payment === "USD" ? user.use_amountUsd - amount : user.use_amountUsd
    );
    formDataUser.append(
      "use_amountGbp",
      payment === "GBP" ? user.use_amountGbp - amount : user.use_amountGbp
    );
    formDataUser.append(
      "use_amountEur",
      payment === "EUR" ? user.use_amountEur - amount : user.use_amountEur
    );

    try {
      setLoading(true);
      axios.post(`${url}/Movements/create`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // await sendPaymentNotification();
      // await sendApprovalNotification();

      await axios.put(`${url}/Users/${user.use_id}`, formDataUser, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        "Cambio realizado con exito!, En un momento tu egreso será procesado",
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      history.push("/changes");
      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAccbsUser_bank("");
    setAccbsUser_owner("");
    setAccbsUser_number("");
    setAccbsUser_dni("");
    setAccbsUser_phone("");
  };

  useEffect(() => {
    fetchCurrencyData();
    fetchDataUser();
  }, [fetchCurrencyData, fetchDataUser]);

  return (
    <div className="send-money">
      <NavBarUser />

      {/* Integración del Step Tracker */}
      <StepTracker currentStep={step} />

      <h1>¿Cuánto quieres enviar?</h1>

      {/* Paso 1: Formulario de selección de moneda y montos */}
      {step === 1 && (
        <>
          <div className="balances-cards">
            <div className="balance-item">
              <h3>Saldo en Euros</h3>
              <p>€{user.use_amountEur ? user.use_amountEur.toFixed(2) : 0}</p>
            </div>
            <div className="balance-item">
              <h3>Saldo en Dólares</h3>
              <p>${user.use_amountUsd ? user.use_amountUsd.toFixed(2) : 0}</p>
            </div>
            <div className="balance-item">
              <h3>Saldo en Libras Esterlinas</h3>
              <p>£{user.use_amountGbp ? user.use_amountGbp.toFixed(2) : 0}</p>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor="currency">Moneda a enviar</label>
              <select
                id="currency"
                value={payment}
                onChange={handleCurrencyChange}
              >
                <option>Seleccione...</option>
                <option value="EUR">Euros (€)</option>
                <option value="USD">Dólares ($)</option>
                <option value="GBP">Libras (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="currency-receive">
                ¿Qué moneda quieres recibir?
              </label>
              <select
                id="currency-receive"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="">Seleccione una moneda</option>
                <option value="VES">Bolívares</option>
                <option value="USD">Dólares (USD)</option>
                <option value="COP">Pesos Colombianos (COP)</option>
                <option value="CLP">Pesos Chilenos (CLP)</option>
                <option value="PEN">Soles (PEN)</option>
                <option value="BRL">Reales Brasileños (BRL)</option>
                <option value="USD-EC">Dólar Ecuatoriano</option>
                <option value="USD-PA">Dólar Panameño</option>
                <option value="MXN">Pesos Mexicanos (MXN)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount-send">Monto a enviar</label>
              <input
                type="number"
                id="amount-send"
                value={amount}
                onChange={handleamountChange}
                placeholder="Ingrese monto"
              />
              <small>
                Saldo disponible:{" "}
                {payment === "EUR"
                  ? `€${user.use_amountEur}`
                  : payment === "USD"
                  ? `$${user.use_amountUsd}`
                  : `£${user.use_amountGbp}`}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="amount-receive">Monto a recibir</label>
              <input
                type="number"
                id="amount-receive"
                value={amountToReceive}
                readOnly
                placeholder="Calculando..."
              />
            </div>

            <div className="exchange-rate-box">
              <h4>Tasa de cambio</h4>
              {currencyPrice.forEach((coin) => {
                if (payment === "EUR") {
                  <p>{`1 ${payment} = ${coin.cur_EurToBs} Bs.`}</p>;
                } else if (payment === "GBP") {
                  <p>{`1 ${payment} = ${coin.cur_GbpToBs} Bs.`}</p>;
                } else if (payment === "USD") {
                  <p>{`1 ${payment} = ${coin.cur_UsdToBs} Bs.`}</p>;
                }
              })}
            </div>

            {/* Botón de continuar */}
            <div className="form-actions">
              <button className="continue-button" onClick={handleContinue}>
                Continúa
              </button>
            </div>
          </div>
        </>
      )}

      {/* Paso 2: Selección de beneficiario */}
      {step === 2 && (
        <div className="beneficiary-step">
          <h2>Selecciona un beneficiario</h2>
          <div className="beneficiaries-list">
            {userDirectory.map((beneficiary) => (
              <div
                className="beneficiary-card"
                key={beneficiary.accbsUser_id}
                onClick={() => handleBeneficiarySelect(beneficiary)}
              >
                <img
                  src={venezuelaFlag}
                  alt="Venezuela flag"
                  className="flag-icon"
                />
                <div className="beneficiary-info">
                  <h3>{beneficiary.accbsUser_owner}</h3>
                  <p>Cédula: {beneficiary.accbsUser_dni}</p>
                  <p>Banco: {beneficiary.accbsUser_bank}</p>
                  <p>
                    {beneficiary.accbsUser_type === "Pago Movil"
                      ? "Teléfono: " + beneficiary.accbsUser_phone
                      : "Cuenta: " + beneficiary.accbsUser_number}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="back-button" onClick={handleBack}>
              Volver
            </button>
            <button className="add-beneficiary-button" onClick={openModal}>
              Nuevo Beneficiario
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && selectedBeneficiary && (
        <div className="confirmation-step">
          <h2>Confirma los detalles</h2>
          <p>
            <strong>Moneda a enviar:</strong> {payment}
          </p>
          <p>
            <strong>Monto a enviar:</strong> {amount} {payment}
          </p>
          <p>
            <strong>Monto a recibir:</strong> {amountToReceive}
          </p>
          <h3>Beneficiario seleccionado</h3>
          <p>
            <strong>Nombre:</strong> {selectedBeneficiary.accbsUser_owner}
          </p>
          <p>
            <strong>Cédula:</strong> {selectedBeneficiary.accbsUser_dni}
          </p>
          <p>
            <strong>Banco:</strong> {selectedBeneficiary.accbsUser_bank}
          </p>
          <p>
            <strong>
              {selectedBeneficiary.accbsUser_type === "Pago Movil"
                ? "Teléfono: " + selectedBeneficiary.accbsUser_phone
                : "Cuenta: " + selectedBeneficiary.accbsUser_number}
            </strong>
          </p>

          <div className="form-actions">
            <button className="back-button" onClick={handleBack}>
              Volver
            </button>
            <button className="confirm-button" onClick={handleSubmitSend}>
              Confirmar y Enviar
            </button>
          </div>
        </div>
      )}

      {/* Modal de nuevo beneficiario */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? "open" : "close"}`}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>Agregar Nuevo Beneficiario</h2>

            {/* Nombre y apellido */}
            <label>Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              value={accbsUser_owner}
              onChange={(e) => setAccbsUser_owner(e.target.value)}
              placeholder="Ingresa el nombre y apellido"
            />

            {/* Cédula */}
            <label>Cédula</label>
            <input
              type="text"
              name="cedula"
              value={accbsUser_dni}
              onChange={(e) => setAccbsUser_dni(e.target.value)}
              placeholder="Ingresa la cédula"
            />

            {/* Selección de tipo de transacción */}
            <label>Seleccione el tipo de transacción</label>
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="">Seleccione...</option>
              <option value="Pago Movil">Pago Móvil</option>
              <option value="Cuenta Bancaria">Cuenta Bancaria</option>
            </select>

            {/* Campos dinámicos */}
            {selectedOption === "Pago Movil" && (
              <>
                <label>Número de Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={accbsUser_phone}
                  onChange={(e) => setAccbsUser_phone(e.target.value)}
                  placeholder="Ingresa el número de teléfono"
                />
                <label>Banco</label>
                <select
                  name="banco"
                  value={accbsUser_bank}
                  onChange={(e) => setAccbsUser_bank(e.target.value)}
                >
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {selectedOption === "Cuenta Bancaria" && (
              <>
                <label>Cuenta Bancaria</label>
                <input
                  type="text"
                  name="cuenta"
                  value={accbsUser_number}
                  onChange={(e) => setAccbsUser_number(e.target.value)}
                  placeholder="Ingresa el número de cuenta"
                />
                <label>Banco</label>
                <select
                  name="banco"
                  value={accbsUser_bank}
                  onChange={(e) => setAccbsUser_bank(e.target.value)}
                >
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {/* Botón para guardar */}
            <button className="submit-button" onClick={handleAddAccountSubmit}>
              Guardar Beneficiario
            </button>
          </div>
        </div>
      )}

      {/* Alerta de confirmación */}
      {showAlert && (
        <div className="alert">
          <FaCheckCircle size={50} color="#28a745" />
          <h3>¡Transacción exitosa!</h3>
          <p>¿Deseas realizar otra transacción?</p>
          <div className="alert-actions">
            <button
              className="alert-button"
              onClick={() => {
                setStep(1); // Volver al paso inicial
                setAmount(""); // Limpiar el monto a enviar
                setAmountToReceive(""); // Limpiar el monto a recibir
                setSelectedBeneficiary(null); // Limpiar beneficiario
                setShowAlert(false); // Cerrar la alerta
              }}
            >
              Sí
            </button>
            <button
              className="alert-button"
              onClick={() => (window.location.href = "/changes")}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { SendMoney };
