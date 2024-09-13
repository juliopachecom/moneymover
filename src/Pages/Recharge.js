import React, { useState, useEffect, useCallback } from "react";
import { NavBarUser } from "../Components/NavBarUser";
import { FaCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // FaTimesCircle para el ícono de error
import { CSSTransition } from "react-transition-group";
import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function Recharge() {
  const { logged, infoTkn, url } = useDataContext();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar el error en el paso 4
  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [cash, setCash] = useState("");
  const [cashPhone, setCashPhone] = useState("");

  // Datos de los bancos
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [banksGBP, setBanksGBP] = useState([]);

  //Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Datos de la recarga
  const [payment, setPayment] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  // const [receiveAmount, setReceiveAmount] = useState(0);
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [mov_img, setMov_img] = useState("");
  const [showConfirmationr, setShowConfirmationr] = useState(false);

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
        `${url}/AccBsUser/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserDirectory(responseDirectory.data);

      setShowAlert(true);
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

  const totalSteps = 4;

  const handleCurrencyChange = (currency) => {
    setPayment(currency);
    setStep(2); // Avanzar al siguiente paso
  };

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleBankChange = (e) => {
    setBankOptionPay(e.target.value);
    console.log(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateStep = () => {
    if (step === 2) {
      if (!selectedMethod) {
        setErrorMessage("Por favor, selecciona un método de recarga.");
        return false;
      }

      if (selectedMethod === "transferencia" && (!bankOptionPay || !amount)) {
        setErrorMessage("Por favor, selecciona un banco y un monto.");
        return false;
      }

      if (
        (selectedMethod === "efectivoBBVA" ||
          selectedMethod === "efectivoSantander") &&
        (!document.querySelector('input[placeholder="Nombre"]').value ||
          !document.querySelector('input[placeholder="Teléfono"]').value ||
          !document.querySelector('input[placeholder="Código"]').value)
      ) {
        setErrorMessage(
          "Por favor, completa todos los campos de Efectivo Móvil."
        );
        return false;
      }
    }

    if (step === 3 && !file) {
      setErrorMessage("Por favor, selecciona un archivo de comprobante.");
      return false;
    }

    setErrorMessage(""); // Resetear el mensaje de error
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const goToStep = (targetStep) => {
    if (step < totalSteps && targetStep < step) {
      setStep(targetStep);
    }
  };

  // Simulación de transacción aleatoria
  useEffect(() => {
    if (step === 4 && !transactionDone) {
      const isSuccess = Math.random() > 0.5; // Generar aleatoriamente si la transacción es exitosa o fallida
      setTransactionError(!isSuccess); // true si falla, false si es exitosa
      setTransactionDone(true); // Marcar como que la transacción ya fue intentada
    }
  }, [step, transactionDone]);

  const resetRecharge = () => {
    setStep(1);
    setPayment("");
    setSelectedMethod("");
    setBankOptionPay("");
    setAmount("");
    setFile(null);
    setTransactionError(false);
    setTransactionDone(false);
  };

  return (
    <div className="recharge">
      <NavBarUser />
      <h1>Recargar Saldo</h1>

      {/* Mostrar los saldos disponibles con menor protagonismo */}
      <div className="balances-info">
        <div>
          Saldo en Euros: €{user.use_amountEur ? user.use_amountEur : 0}
        </div>
        <div>
          Saldo en Dólares: ${user.use_amountUsd ? user.use_amountUsd : 0}
        </div>
        <div>
          Saldo en Libras: £{user.use_amountGbp ? user.use_amountGbp : 0}
        </div>
      </div>

      {/* Step Tracker */}
      <div className="step-tracker">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`step ${
              step >= stepNumber
                ? step > stepNumber
                  ? "completed"
                  : "active"
                : ""
            }`}
            onClick={() => goToStep(stepNumber)}
            style={{
              cursor:
                step < totalSteps && stepNumber < step ? "pointer" : "default",
            }}
          >
            <div className="step-circle">
              {step > stepNumber ? <FaCheck color="white" /> : stepNumber}
            </div>
            <p>
              {
                ["Moneda", "Método", "Comprobante", "Confirmación"][
                  stepNumber - 1
                ]
              }
            </p>
          </div>
        ))}
      </div>

      {/* Validación de error */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Paso 1: Selección de moneda */}
      <CSSTransition
        in={step === 1}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <h2>¿Qué moneda quieres recargar?</h2>
          <p className="hint">Selecciona una opción para continuar</p>

          <div className="currency-selection">
            <div
              className={`currency-card ${payment === "EUR" ? "active" : ""}`}
              onClick={() => handleCurrencyChange("EUR")}
            >
              <h3>Euros</h3>
              <p>€</p>
            </div>
            <div
              className={`currency-card ${payment === "USD" ? "active" : ""}`}
              onClick={() => handleCurrencyChange("USD")}
            >
              <h3>Dólares</h3>
              <p>$</p>
            </div>
            <div
              className={`currency-card ${payment === "GBP" ? "active" : ""}`}
              onClick={() => handleCurrencyChange("GBP")}
            >
              <h3>Libras</h3>
              <p>£</p>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Paso 2: Selección de método */}
      <CSSTransition
        in={step === 2}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="form-container-edit">
          <h2>Selecciona el método de recarga</h2>
          <select
            className="custom-method-select"
            onChange={handleMethodChange}
            value={selectedMethod}
          >
            <option value="">Selecciona el método</option>
            {payment === "EUR" && (
              <>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivoBBVA">Efectivo Móvil BBVA</option>
                <option value="efectivoSantander">
                  Efectivo Por Cajero Santander
                </option>
                <option value="efectivoMadrid">
                  Entrega en efectivo en Madrid
                </option>
              </>
            )}
            {payment === "USD" && (
              <option value="transferenciaUSA">
                Transferencia Bancaria - Bank of America
              </option>
            )}
            {payment === "GBP" && (
              <option value="transferenciaUK">Transferencia Bancaria</option>
            )}
          </select>

          {/* Campos para Transferencia Bancaria */}
          {selectedMethod === "transferencia" && (
            <div className="bank-details">
              <label>Selecciona el banco:</label>
              <select
                onChange={handleBankChange}
                className="custom-bank-select"
              >
                <option value="">Selecciona un banco</option>
                {payment === "EUR"
                  ? banksEUR
                      .filter((bank) => bank.acceur_status === "Activo")
                      .map((bank) => {
                        return bank.acceur_Bank ? (
                          <option value={bank.acceur_id}>
                            {bank.acceur_Bank}
                          </option>
                        ) : null;
                      })
                  : payment === "USD"
                  ? banksUSD
                      .filter((bank) => bank.accusd_status === "Activo")
                      .map((bank) => {
                        return bank.accusd_Bank ? (
                          <option value={bank.accusd_id}>
                            {bank.accusd_Bank}
                          </option>
                        ) : null;
                      })
                  : payment === "GBP"
                  ? banksUSD
                      .filter((bank) => bank.accusd_status === "Activo")
                      .map((bank) => {
                        return bank.accusd_Bank ? (
                          <option value={bank.accusd_id}>
                            {bank.accusd_Bank}
                          </option>
                        ) : null;
                      })
                  : null}
              </select>
              {bankOptionPay &&
                (payment === "EUR"
                  ? banksEUR.map((bank) => {
                      return (
                        bank.acceur_id === parseInt(bankOptionPay) && (
                          <p className="iban-info">{bank.acceur_number}</p>
                        )
                      );
                    })
                  : payment === "USD"
                  ? banksUSD.map((bank) => {
                      return bank.accusd_id === parseInt(bankOptionPay) ? (
                        <p className="iban-info">{bank.accusd_number}</p>
                      ) : null;
                    })
                  : payment === "GBP"
                  ? banksUSD.map((bank) => {
                      return bank.accusd_id === parseInt(bankOptionPay) ? (
                        <p className="iban-info">{bank.accgbp_number}</p>
                      ) : null;
                    })
                  : null)}
              <div className="form-group">
                <label>Monto a transferir</label>
                <input
                  type="number"
                  className="custom-form-input"
                  placeholder="Introduce el monto"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
          )}

          {/* Campos para Efectivo Móvil */}
          {(selectedMethod === "efectivoBBVA" ||
            selectedMethod === "efectivoSantander") && (
            <div className="efectivo-movil">
              <p>
                Deberás realizar un efectivo móvil a tu nombre y a tu número
                telefónico.
              </p>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  className="custom-form-input"
                  placeholder="Teléfono"
                />
              </div>
              <div className="form-group">
                <label>Código de la transacción</label>
                <input
                  type="text"
                  className="custom-form-input"
                  placeholder="Código"
                />
              </div>
            </div>
          )}

          {/* Entrega en Efectivo en Madrid */}
          {selectedMethod === "efectivoMadrid" && (
            <div className="efectivo-madrid">
              <p>
              Para entregas en efectivo en Madrid, deberás contactarte por correo
            electrónico o WhatsApp. Este tipo de recargas **no se reflejará en la página**.
            Por favor, elige otro método si deseas que la recarga se refleje en la página.
              </p>
              <button
                onClick={() => window.open("mailto:info@genericemail.com")}
                className="contact-button"
              >
                Correo electrónico
              </button>
              <button
                onClick={() => window.open("https://wa.me/123456789")}
                className="contact-button"
              >
                WhatsApp
              </button>
            </div>
          )}

          {/* Archivo de comprobante */}
          {selectedMethod && (
    <>
        <div className="file-upload">
            {selectedMethod !== "efectivoMadrid" && (
                <>
                    <h4>Adjuntar comprobante de pago</h4>
                    <input type="file" onChange={handleFileChange} />
                </>
            )}
        </div>

        <div className="form-actions" style={{justifyContent: "center"}}>
            <button className="back-button" onClick={handlePreviousStep}>
                Volver
            </button>
            {selectedMethod !== "efectivoMadrid" && (
    <button
      className="continue-button"
      onClick={handleNextStep}
    >
      Continuar
    </button>
  )}
        </div>
    </>
)}
        </div>
      </CSSTransition>

      {/* Paso 3: Confirmar comprobante */}
      <CSSTransition
        in={step === 3}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="form-container-edit step-3">
          <h2>Confirmar Comprobante</h2>
          {file && <p>Archivo seleccionado: {file.name}</p>}

          <div className="form-actions">
            <button className="back-button" onClick={handlePreviousStep}>
              Volver
            </button>
            <button className="continue-button" onClick={handleNextStep}>
              Confirmar
            </button>
          </div>
        </div>
      </CSSTransition>

      {/* Paso 4: Confirmación final */}
      <CSSTransition
        in={step === 4}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="form-container-edit step-4">
          <h2>
            {transactionError ? "¡Ocurrió un problema!" : "¡Recarga Exitosa!"}
          </h2>
          <p>
            {transactionError
              ? "Hubo un error en la transacción. Por favor, intenta nuevamente más tarde."
              : "En breve se verá reflejado el estatus de tu transferencia."}
          </p>
          {transactionError ? (
            <FaTimesCircle size={50} color="#dc3545" />
          ) : (
            <FaCheckCircle size={50} color="#28a745" />
          )}

          <div className="form-actions">
            <button className="another-recharge-button" onClick={resetRecharge}>
              Realizar otra recarga
            </button>
            <button
              className="finish-button"
              onClick={() => (window.location.href = "/changes")}
            >
              Finalizar
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export { Recharge };