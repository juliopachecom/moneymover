import React, { useState, useEffect, useCallback } from "react";
import { NavBarUser } from "../Components/NavBarUser";
import { FaCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // FaTimesCircle para el ícono de error
import { CSSTransition } from "react-transition-group";
import { toast } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { NotFound } from "../Components/NotFound";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function Recharge() {
  useAxiosInterceptors();
  const { logged, infoTkn, url } = useDataContext();
   const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  // const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar el error en el paso 4
  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada
  const [isValid, setIsValid] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Datos Usuario
  const [user, setUser] = useState([]);

  // Datos de los bancos
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [banksGBP, setBanksGBP] = useState([]);

  //Alertas
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  // const [alertType, setAlertType] = useState("");

  // Datos de la recarga
  const [payment, setPayment] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  // const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  // const [receiveAmount, setReceiveAmount] = useState(0);
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [mov_img, setMov_img] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [cash, setCash] = useState("");
  const [cashPhone, setCashPhone] = useState("");
  // const [showConfirmationr, setShowConfirmationr] = useState(false);

  // Fetch de datos del usuario (Incluye movimientos y directorio)
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      // setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

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
      setBanksGBP(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, infoTkn]);

  //Enviar a espera una recarga
  const handleSubmitLoad = async (event) => {
    event.preventDefault();
  
    const findBankName = () => {
      if (payment === "USD") {
        const bank = banksUSD.find(
          (bank) => bank.accusd_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.accusd_Bank;
        }
      }
      if (payment === "EUR") {
        const bank = banksEUR.find(
          (bank) => bank.acceur_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.acceur_Bank;
        }
      }
      if (payment === "GBP") {
        const bank = banksGBP.find(
          (bank) => bank.accgbp_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.accgbp_Bank;
        }
      }
    };
  
    const formData = new FormData();
    formData.append("mov_currency", payment);
    formData.append("mov_amount", sendAmount);
    formData.append("mov_oldAmount", 0);
    formData.append("mov_type", "Deposito");
    formData.append("mov_status", "E");
    formData.append("mov_comment", findBankName());
    formData.append("mov_code", cash);
    formData.append("mov_phone", cashPhone);
    formData.append("mov_img", mov_img);
    formData.append(
      "mov_accEurId",
      payment === "EUR" && selectedMethod === "efectivoBBVA"
        ? 1
        : payment === "EUR" && selectedMethod === "efectivoSantander"
        ? 2
        : payment === "EUR"
        ? parseInt(bankOptionPay)
        : 0
    );
    formData.append(
      "mov_accUsdId",
      payment === "USD" ? parseInt(bankOptionPay) : 0
    );
    formData.append(
      "mov_accGbpId",
      payment === "GBP" ? parseInt(bankOptionPay) : 0
    );
    formData.append("mov_userId", user.use_id);
  
    try {
      // Crear el movimiento
      const response = await axios.post(`${url}/Movements/create`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      const movementId = response.data.mov_id; // Obtén el ID del movimiento recién creado
  
      // Enviar correo después de la creación del movimiento
      await axios.post(
        `${url}/Mailer/pendantIncome/Ingresosnuevo@hotmail.com/${movementId}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
  
      fetchDataUser();
      handleNextStep();
      toast.success(
        "Cambio realizado con éxito!, En un momento se verá reflejado tu ingreso en la plataforma",
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
      setTransactionDone(true);
      setTransactionError(false);
      console.log("Request sent successfully");
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      setTransactionDone(false);
      console.log(transactionDone);
      setTransactionError(true);
      console.log(error);
      toast.error("Error al procesar la recarga", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    // fetchCurrencyData();
    fetchDataUser();
    fetchDataAccEur();
    fetchDataAccUsd();
    fetchDataAccGbp();
  }, [
    // fetchCurrencyData,
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

  // Transformación de la cantidad de divisa a bolívares
  const handleAmountChangeBs = (e) => {
    const inputAmount = e.target.value;
    setSendAmount(inputAmount);

    if (inputAmount < 20) {
      setFeedbackMessage("Solo aceptamos transferencias a partir de 20 euros.");
      setIsValid(false);
    } else if (inputAmount >= 20) {
      console.log(feedbackMessage);
      setFeedbackMessage("Monto válido para transferencia.");
      setIsValid(true);
    }

    // currencyPrice.forEach((coin) => {
    //   if (payment === "EUR") {
    //     setReceiveAmount(parseFloat(inputAmount) * coin.cur_EurToBs);
    //   } else if (payment === "GBP") {
    //     setReceiveAmount(parseFloat(inputAmount) * coin.cur_GbpToBs);
    //   } else if (payment === "USD") {
    //     setReceiveAmount(parseFloat(inputAmount) * coin.cur_UsdToBs);
    //   }
    // });
  };

  const validateStep = () => {
    if (step === 2) {
      if (!selectedMethod) {
        setErrorMessage("Por favor, selecciona un método de recarga.");
        return false;
      }

      if (
        selectedMethod === "transferencia" &&
        (!bankOptionPay || !sendAmount)
      ) {
        setErrorMessage("Por favor, selecciona un banco y un monto.");
        return false;
      }

      if (
        (selectedMethod === "efectivoBBVA" ||
          selectedMethod === "efectivoSantander") &&
        cashPhone === "" &&
        cash === ""
      ) {
        setErrorMessage(
          "Por favor, completa todos los campos de Efectivo Móvil."
        );
        return false;
      }
    }

    if (step === 3 && !mov_img) {
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

  const resetRecharge = () => {
    setStep(1);
    setPayment("");
    setSelectedMethod("");
    setBankOptionPay("");
    // setAmount("");
    // setFile(null);
    setTransactionError(false);
    setTransactionDone(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMov_img(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return logged ? (
    user.use_verif !== "E" && user.use_verif !== "R" ? ( // Verificar si el usuario está verificado
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
                  step < totalSteps && stepNumber < step
                    ? "pointer"
                    : "default",
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
            {(selectedMethod === "transferencia" ||
              selectedMethod === "transferenciaUSA" ||
              selectedMethod === "transferenciaUK") && (
              <div className="bank-details">
                <label>Selecciona el banco:</label>
                <select onChange={handleBankChange} className="custom-bank-select">
  <option value="">Selecciona un banco</option>
  {payment === "EUR"
    ? banksEUR
        .filter((bank) => bank.acceur_status === "Activo")
        .map((bank) => {
          return bank.acceur_Bank ? (
            <option value={bank.acceur_id} key={bank.acceur_id}>
              {bank.acceur_Bank}
            </option>
          ) : null;
        })
    : payment === "USD"
    ? banksUSD
        .filter((bank) => bank.accusd_status === "Activo")
        .map((bank) => {
          return bank.accusd_Bank ? (
            <option value={bank.accusd_id} key={bank.accusd_id}>
              {bank.accusd_Bank}
            </option>
          ) : null;
        })
    : payment === "GBP"
    ? banksGBP
        .filter((bank) => bank.accgbp_status === "Activo")
        .map((bank) => {
          return bank.accgbp_Bank ? (
            <option value={bank.accgbp_id} key={bank.accgbp_id}>
              {bank.accgbp_Bank}
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
            <div className="iban-info" key={bank.acceur_id}>
              <p>Número de cuenta: {bank.acceur_number}</p>
              <p>CONCEPTO: {bank.acceur_swift}</p>
            </div>
          )
        );
      })
    : payment === "USD"
    ? banksUSD.map((bank) => {
        return bank.accusd_id === parseInt(bankOptionPay) ? (
          <div className="iban-info" key={bank.accusd_id}>
            <p>Número de cuenta: {bank.accusd_number}</p>
            <p>Correo para Zelle: {bank.accusd_email}</p>
            <p>CONCEPTO: {bank.accusd_phone}</p>
          </div>
        ) : null;
      })
    : payment === "GBP"
    ? banksGBP.map((bank) => {
        return bank.accgbp_id === parseInt(bankOptionPay) ? (
          <div className="iban-info" key={bank.accgbp_id}>
            <p>Número de cuenta: {bank.accgbp_number}</p>
            <p>CONCEPTO: {bank.accgbp_swift}</p>
          </div>
        ) : null;
      })
    : null)}

                <div className="form-group">
                  <label>
                    Monto a transferir{" "}
                    {payment === "EUR" && (
                      <span
                        style={{
                          color: "red",
                          marginTop: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        🔴 Solo aceptamos transferencias a partir de 20 Euros.
                      </span>
                    )}
                    {payment === "USD" && (
                      <span
                        style={{
                          color: "red",
                          marginTop: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        🔴 Solo aceptamos transferencias a partir de 20 Dólares.
                      </span>
                    )}
                    {payment === "GBP" && (
                      <span
                        style={{
                          color: "red",
                          marginTop: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        🔴 Solo aceptamos transferencias a partir de 20 Libras.
                      </span>
                    )}
                  </label>

                  <input
                    type="number"
                    className={`custom-form-input ${
                      isValid ? "valid" : "invalid"
                    }`} // Agregar clase de validación
                    placeholder="Introduce el monto"
                    value={sendAmount}
                    onChange={handleAmountChangeBs}
                  />
                  <div
                    className="warning-message"
                    style={{ color: "red", marginTop: "5px" }}
                  >
                    {/* Mensaje de advertencia */}
                    {sendAmount && sendAmount < 20 && payment === "EUR" && (
                      <span>
                        🔴 Solo aceptamos transferencias a partir de 20 Euros.
                      </span>
                    )}
                    {sendAmount && sendAmount < 20 && payment === "USD" && (
                      <span>
                        🔴 Solo aceptamos transferencias a partir de 20 Dólares.
                      </span>
                    )}
                    {sendAmount && sendAmount < 20 && payment === "GBP" && (
                      <span>
                        🔴 Solo aceptamos transferencias a partir de 20 Libras.
                      </span>
                    )}
                  </div>
                  {isValid && (
                    <div
                      className="form-feedback"
                      style={{ color: "green", marginTop: "5px" }}
                    >
                      {/* Mensaje de feedback */}
                      <span>✅ Monto válido para transferencia.</span>
                    </div>
                  )}
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
                    value={cashPhone}
                    onChange={(e) => setCashPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Código de la transacción</label>
                  <input
                    type="text"
                    className="custom-form-input"
                    placeholder="Código"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                  />
                </div>
                <span
                        style={{
                          color: "red",
                          marginTop: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        🔴 Solo aceptamos transferencias a partir de 20 Euros.
                      </span>
                <div className="form-group">
                  <label>Monto a Transferir</label>
                  <input
                    type="number"
                    className={`custom-form-input ${
                      isValid ? "valid" : "invalid"
                    }`} // Agregar clase de validación
                    placeholder="Introduce el monto"
                    value={sendAmount}
                    onChange={(e)=> setSendAmount(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Entrega en Efectivo en Madrid */}
            {selectedMethod === "efectivoMadrid" && (
              <div className="efectivo-madrid">
                <p>
                  Para entregas en efectivo en Madrid, deberás contactarte por
                  correo electrónico o WhatsApp. Este tipo de recargas **no se
                  reflejará en la página**. Por favor, elige otro método si
                  deseas que la recarga se refleje en la página.
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

                <div
                  className="form-actions"
                  style={{ justifyContent: "center" }}
                >
                  <button className="back-button" onClick={handlePreviousStep}>
                    Volver
                  </button>
                  {selectedMethod !== "efectivoMadrid" && (
                    <button
                      className="continue-button"
                      onClick={handleNextStep}
                      disabled={sendAmount && sendAmount < 20}
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
            <p>
              {mov_img ? (
                <img
                  src={imageUrl}
                  alt="Imagen seleccionada"
                  style={{ width: "300px", alignItems: "center" }}
                />
              ) : (
                "Ningún archivo seleccionado"
              )}
            </p>

            <div className="form-actions">
              <button className="back-button" onClick={handlePreviousStep}>
                Volver
              </button>
              <button className="continue-button" disabled={mov_img === null || loading} onClick={handleSubmitLoad}>
        {loading ? <span className="spinner"></span> : 'Confirmar'}
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
              <button
                className="another-recharge-button"
                onClick={resetRecharge}
              >
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
    ) : (
      <NotFound /> // Usar el componente NotFound aquí
    )
  ) : (
    <Redirect to="/login" />
  );
}

export { Recharge };