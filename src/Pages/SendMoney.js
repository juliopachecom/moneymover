import React, { useState, useEffect, useCallback } from "react";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import chile from "../Assets/Images/chile.png";
import colombia from "../Assets/Images/colombia.png";
import ecuador from "../Assets/Images/ecuador.png";
import argentina from "../Assets/Images/argentina.png";
import brasil from "../Assets/Images/square.png";
import peru from "../Assets/Images/peru.png";
import panama from "../Assets/Images/panama.png";
import usa from "../Assets/Images/usa.png";

import { NavBarUser } from "../Components/NavBarUser";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // FaTimesCircle para el ícono de error // Icono de check para confirmación
import { StepTracker } from "../Components/StepTracker"; // Importación del componente StepTracker
import { toast } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { banksByCountry } from "../Utils/Variables";
import { Link } from "react-router-dom";
import { NotFound } from "../Components/NotFound";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function SendMoney() {
  useAxiosInterceptors();
  const { logged, infoTkn, url } = useDataContext();

  const [step, setStep] = useState(1); // Controla los pasos del formulario
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  //Alertas
  const [showAlert, setShowAlert] = useState(false);

  // Datos de Envio de remesas
  const [payment, setPayment] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverDni, setReceiverDni] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState(0);
  const [porcents, setPorcents] = useState([]);
  const [porcent, setPorcent] = useState([]);
  const [isCashMethodSelected, setIsCashMethodSelected] = useState(false);

  const [amount, setAmount] = useState("");
  const [amountToReceive, setAmountToReceive] = useState("");

  //Loading
  const [loading, setLoading] = useState(false);

  const getPercentage = () => {
    if (payment === "GBP") return porcent.por_porcentGbp;
    if (payment === "USD") return porcent.por_porcentUsd;
    if (payment === "EUR") return porcent.por_porcentEur;
    return 0;
  };

  //DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState("");
  const [accbsUser_owner, setAccbsUser_owner] = useState("");
  const [accbsUser_number, setAccbsUser_number] = useState("");
  const [accbsUser_dni, setAccbsUser_dni] = useState("");
  const [accbsUser_phone, setAccbsUser_phone] = useState("");
  const [accbsUser_type, setAccbsUser_type] = useState("");
  const [accbsUser_country, setAccbsUser_country] = useState("");

  // Prefijos para teléfono
  const [telefonoPrefix, setTelefonoPrefix] = useState("");

  // Estado para validaciones
  const [errors, setErrors] = useState({});

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

  // Fetch de datos de porcentaje ID
  const fetchDataPorcentId = async (id) => {
    try {
      const response = await axios.get(`${url}/PorcentPrice/${id}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setPorcent(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch de datos de porcentaje
  const fetchDataPorcent = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/PorcentPrice`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setPorcents(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, infoTkn]);

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!accbsUser_country) {
      newErrors.accbsUser_country = "El país es requerido.";
    }

    if (!accbsUser_owner) {
      newErrors.accbsUser_owner = "El nombre es requerido.";
    }

    

    if (accbsUser_type === "Pago Movil") {
      if (!accbsUser_phone) {
        newErrors.accbsUser_phone = "El número telefónico es requerido.";
      } else if (!/^\d+$/.test(accbsUser_phone)) {
        newErrors.accbsUser_phone =
          "El número telefónico solo puede contener dígitos.";
      } else if (accbsUser_phone.length === 0) {
        newErrors.accbsUser_phone =
          "El número telefónico no puede estar vacío.";
      }
    } else if (accbsUser_type === "Cuenta Bancaria") {
      if (!accbsUser_number) {
        newErrors.accbsUser_number = "El número de cuenta es requerido.";
      } else if (!/^\d+$/.test(accbsUser_number)) {
        newErrors.accbsUser_number =
          "El número de cuenta solo puede contener dígitos.";
      } else if (accbsUser_number.length === 0) {
        newErrors.accbsUser_number =
          "El número de cuenta no puede estar vacío.";
      }
    }

    if (!accbsUser_bank) {
      newErrors.accbsUser_bank = "El banco es requerido.";
    }

    if (!accbsUser_type) {
      newErrors.accbsUser_type = "Seleccione un tipo de transacción.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Agregar Beneficiario
  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Concatenar prefijo y teléfono solo si es Pago Movil
    const finalPhone =
      accbsUser_type === "Pago Movil" ? telefonoPrefix + accbsUser_phone : accbsUser_phone;

    // Si accbsUser_dni es nulo o vacío, asignar "NA"
    const finalDni = accbsUser_dni ? accbsUser_dni : "NA";

    try {
      await axios.post(
        `${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni: finalDni, // Usamos el DNI con "NA" si está vacío
          accbsUser_phone: finalPhone, // Aquí usamos el número concatenado
          accbsUser_type,
          accbsUser_status: "Activo",
          accbsUser_userId: user.use_id,
          accbsUser_country,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      window.location.reload();

      toast.success("Cuenta agregada con éxito!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("Error al agregar la cuenta:", error.response || error);
      toast.error("Error al agregar la cuenta", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }console.log(setShowAlert)
  };


  const handleCurrencyChange = (e) => {
    setPayment(e.target.value);
    setWithdrawalMethod(""); // Reiniciar método de retiro al cambiar moneda
    setIsCashMethodSelected(false); // Ocultar inputs cuando se cambia la moneda
    setSelectedCurrency(""); // Reiniciar moneda seleccionada
  };

  const handleWithdrawalMethodChange = (e) => {
    const method = e.target.value;
    setWithdrawalMethod(method);

    if (method === "efectivo") {
      setIsCashMethodSelected(true);
      setSelectedCurrency(""); // Limpiar moneda si cambia a efectivo
      setAmount(""); // Reiniciar monto si cambia a efectivo
    } else {
      setIsCashMethodSelected(false);
    }
  };

  const calculateValue = (amount, payment, porcent) => {
    const amountFloat = parseFloat(amount);
    const deliveryPrice = parseFloat(porcent.por_deliveryPrice);

    if (payment === "EUR") {
      if (porcent.por_status === "Obligatorio") {
        return (
          amountFloat +
          amountFloat * (porcent.por_porcentEur / 100) +
          deliveryPrice
        );
      } else {
        return amountFloat + amountFloat * (porcent.por_porcentEur / 100);
      }
    } else if (payment === "GBP") {
      if (porcent.por_status === "Obligatorio") {
        return (
          amountFloat +
          amountFloat * (porcent.por_porcentEur / 100) +
          deliveryPrice
        );
      } else {
        return amountFloat + amountFloat * (porcent.por_porcentGbp / 100);
      }
    } else if (payment === "USD") {
      if (porcent.por_status === "Obligatorio") {
        return (
          amountFloat +
          amountFloat * (porcent.por_porcentEur / 100) +
          deliveryPrice
        );
      } else {
        return amountFloat + amountFloat * (porcent.por_porcentUsd / 100);
      }
    }
    return null;
  };

  const handleamountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);

    let errorMessage = "";


    // Validación para el método de retiro efectivo
    if (withdrawalMethod === "efectivo") {
      if (inputAmount < 100) {
        errorMessage = "El monto a enviar debe ser mayor o igual a 100.";
      } else if (inputAmount % 20 !== 0) {
        errorMessage = "El monto a enviar debe ser múltiplo de 20.";
      }
    } else {
      // Transfrenecia
      if (inputAmount < 20) {
        errorMessage = "El monto a enviar debe ser mayor a 20.";
      }
      if (selectedCurrency !== "BS" && inputAmount < 100) {
        errorMessage = "El monto a enviar debe ser mayor a 100.";
      }
    }

    const availableBalance =
      payment === "EUR"
        ? user.use_amountEur
        : payment === "USD"
          ? user.use_amountUsd
          : user.use_amountGbp;

    if (inputAmount > availableBalance) {
      errorMessage =
        "El monto a enviar no puede ser mayor que el saldo disponible.";
    }
    // Actualizar errores en el estado

    currencyPrice.forEach((coin) => {
      if (payment === "EUR") {
        if (selectedCurrency === "BS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToBs);
        } else if (selectedCurrency === "USD") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd);
        } else if (selectedCurrency === "COP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToCol_Pes);
        } else if (selectedCurrency === "CLP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToPes_Ch);
        } else if (selectedCurrency === "PEN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToSol_Pe);
        } else if (selectedCurrency === "BRL") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToBra_Rea);
        } else if (selectedCurrency === "USD-EC") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd_Ecu);
        } else if (selectedCurrency === "USD-PA") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd_Pa);
        } else if (selectedCurrency === "MXN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToPes_Mex);
        } else if (selectedCurrency === "ARS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToArg_Pes);
        }
      } else if (payment === "GBP") {
        if (selectedCurrency === "BS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToBs);
        } else if (selectedCurrency === "USD") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToUsd);
        } else if (selectedCurrency === "COP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToCol_Pes);
        } else if (selectedCurrency === "CLP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToPes_Ch);
        } else if (selectedCurrency === "PEN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToSol_Pe);
        } else if (selectedCurrency === "BRL") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToBra_Rea);
        } else if (selectedCurrency === "USD-EC") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToUsd_Ecu);
        } else if (selectedCurrency === "USD-PA") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToUsd_Pa);
        } else if (selectedCurrency === "MXN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToPes_Mex);
        } else if (selectedCurrency === "ARS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_GbpToArg_Pes);
        }
      } else if (payment === "USD") {
        if (selectedCurrency === "BS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToBs);
        } else if (selectedCurrency === "USD") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd);
        } else if (selectedCurrency === "COP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToCol_Pes);
        } else if (selectedCurrency === "CLP") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToPes_Ch);
        } else if (selectedCurrency === "PEN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToSol_Pe);
        } else if (selectedCurrency === "BRL") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToBra_Rea);
        } else if (selectedCurrency === "USD-EC") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd_Ecu);
        } else if (selectedCurrency === "USD-PA") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd_Pa);
        } else if (selectedCurrency === "MXN") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToPes_Mex);
        } else if (selectedCurrency === "ARS") {
          setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToArg_Pes);
        }
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: errorMessage,
      }));
    });
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep(3); // Pasar al paso de confirmación
  };

  //Enviar a espera un retiro
  const handleSubmitSend = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("mov_currency", payment);
    formData.append("mov_amount", amount);
    formData.append("mov_type", "Retiro");
    formData.append("mov_status", "E");
    formData.append("mov_code", "");
    formData.append("mov_phone", "");
    formData.append(
      "mov_oldAmount",
      withdrawalMethod === "efectivo"
        ? calculateValue(amount, payment, porcent)
        : amount
    );

    formData.append(
      "mov_comment",
      `${withdrawalMethod === "efectivo"}` &&
      `<strong>Retiro de divisa en efectivo \n  Ciudad: </strong>` +
      porcent.por_stateLocation +
      `\n <strong>Persona que recibe: </strong>` +
      receiverName +
      `\n <strong>DNI de quien recibe: </strong>` +
      receiverDni +
      `\n <strong>Teléfono: </strong>` +
      phone +
      `\n <strong>Dirección: </strong>` +
      deliveryAddress +
      `\n <strong>Monto: </strong>` +
      amount
    );
    formData.append("mov_img", "Retiro de Divisa");
    formData.append("mov_typeOutflow", withdrawalMethod);
    formData.append("mov_accEurId", payment === "EUR" ? 99 : 0);
    formData.append("mov_accUsdId", payment === "USD" ? 99 : 0);
    formData.append("mov_accGbpId", payment === "GBP" ? 99 : 0);
    formData.append("mov_userId", user.use_id);
    formData.append(
      "mov_accBsUserId",
      selectedBeneficiary ? selectedBeneficiary.accbsUser_id : 0
    );

    const getCurrencyPrice = (payment, country, coin) => {
      if (payment === "EUR") {
        switch (country) {
          case "Venezuela":
            return coin.cur_EurToBs;
          case "Argentina":
            return coin.cur_EurToArg_Pes;
          case "Estados Unidos":
            return coin.cur_EurToUsd;
          case "Colombia":
            return coin.cur_EurToCol_Pes;
          case "Chile":
            return coin.cur_EurToPes_Ch;
          case "Mexico":
            return coin.cur_EurToPes_Mex;
          case "Peru":
            return coin.cur_EurToSol_Pe;
          case "Brasil":
            return coin.cur_EurToBra_Rea;
          case "Ecuador":
            return coin.cur_EurToUsd_Ecu;
          case "Panama":
            return coin.cur_EurToUsd_Pa;
          default:
            return null;
        }
      } else if (payment === "USD") {
        switch (country) {
          case "Venezuela":
            return coin.cur_UsdToBs;
          case "Argentina":
            return coin.cur_UsdToArg_Pes;
          case "Colombia":
            return coin.cur_UsdToCol_Pes;
          case "Chile":
            return coin.cur_UsdToPes_Ch;
          case "Mexico":
            return coin.cur_UsdToPes_Mex;
          case "Peru":
            return coin.cur_UsdToSol_Pe;
          case "Brasil":
            return coin.cur_UsdToBra_Rea;
          case "Ecuador":
            return coin.cur_UsdToUsd_Ecu;
          case "Panama":
            return coin.cur_UsdToUsd_Pa;
          default:
            return null;
        }
      } else if (payment === "GBP") {
        switch (country) {
          case "Venezuela":
            return coin.cur_GbpToBs;
          case "Argentina":
            return coin.cur_GbpToArg_Pes;
          case "Estados Unidos":
            return coin.cur_GbpToUsd;
          case "Colombia":
            return coin.cur_GbpToCol_Pes;
          case "Chile":
            return coin.cur_GbpToPes_Ch;
          case "Mexico":
            return coin.cur_GbpToPes_Mex;
          case "Peru":
            return coin.cur_GbpToSol_Pe;
          case "Brasil":
            return coin.cur_GbpToBra_Rea;
          case "Ecuador":
            return coin.cur_GbpToUsd_Ecu;
          case "Panama":
            return coin.cur_GbpToUsd_Pa;
          default:
            return null;
        }
      }
      return null;
    };

    const currencyPriceValue = currencyPrice
      .map((coin) =>
        getCurrencyPrice(
          payment,
          selectedBeneficiary ? selectedBeneficiary.accbsUser_country : null,
          coin
        )
      )
      .filter((price) => price !== null)[0];

    formData.append("mov_currencyPrice", currencyPriceValue);
    formData.append("mov_oldCurrency", payment);

    const formDataUser = new FormData();
    formDataUser.append(
      "use_amountUsd",
      payment === "USD" && withdrawalMethod === "efectivo"
        ? user.use_amountUsd - calculateValue(amount, payment, porcent)
        : payment === "USD" && withdrawalMethod !== "efectivo"
          ? user.use_amountUsd - amount
          : user.use_amountUsd
    );
    formDataUser.append(
      "use_amountGbp",
      payment === "GBP" && withdrawalMethod === "efectivo"
        ? user.use_amountGbp - calculateValue(amount, payment, porcent)
        : payment === "GBP" && withdrawalMethod !== "efectivo"
          ? user.use_amountGbp - amount
          : user.use_amountGbp
    );
    formDataUser.append(
      "use_amountEur",
      payment === "EUR" && withdrawalMethod === "efectivo"
        ? user.use_amountEur - calculateValue(amount, payment, porcent)
        : payment === "EUR" && withdrawalMethod !== "efectivo"
          ? user.use_amountEur - amount
          : user.use_amountEur
    );

    try {
      // Crear el movimiento
      const response = await axios.post(`${url}/Movements/create`, formData, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const movementId = response.data.mov_id; // Extraemos el ID del movimiento
      console.log("Movement ID:", movementId); // Asegúrate de que 'movementId' sea correcto

     

      // Actualizar saldo del usuario
      await axios.put(`${url}/Users/${user.use_id}`, formDataUser, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
          "Content-Type": "multipart/form-data",
        },
      });


       // Enviar correo según el método de retiro
       if (withdrawalMethod === "efectivo") {
        // Enviar correo a "Egresosnuevo@hotmail.com" si es retiro en efectivo
        await axios.post(`${url}/Mailer/pendantCashWithdraw/Egresosnuevo@hotmail.com/${movementId}`);
      } else {
        // Enviar correo a "Egresosnuevo@hotmail.com" si es una transferencia
        await axios.post(`${url}/Mailer/pendantWithdraw/Egresosnuevo@hotmail.com/${movementId}`);
      }

      toast.success(
        "Cambio realizado con éxito! En un momento tu egreso será procesado",
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
      setTransactionError(false); // asegurarse de que el error esté en false
    } catch (error) {
      console.error("Error:", error);
      setTransactionError(true);
      console.log(transactionDone);
      setTransactionDone(false);
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
    fetchDataPorcent();
  }, [fetchCurrencyData, fetchDataUser, fetchDataPorcent]);

  return logged ? (
    user.use_verif !== "E" && user.use_verif !== "R" ? ( // Verificamos el valor de use_verif
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

              {payment && (
                <div className="form-group">
                  <label htmlFor="withdrawal-method">Método de retiro</label>
                  <select
                    id="withdrawal-method"
                    value={withdrawalMethod}
                    onChange={handleWithdrawalMethodChange}
                  >
                    <option value="">Seleccione...</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
              )}

              {isCashMethodSelected && (
                <>
                  <div className="form-group">
                    <label htmlFor="state-location">Ubicación</label>
                    <select
                      id="state-location"
                      defaultValue={withdrawalMethod}
                      onChange={(e) => fetchDataPorcentId(e.target.value)}
                    >
                      <option value="">Seleccione una ubicación</option>
                      {porcents.map((por) => {
                        if (por.por_status === "Desactivado") {
                          return null;
                        }
                        return (
                          <option value={por.por_id}>
                            {por.por_stateLocation}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {porcent && (
                    <>
                      <div className="form-group">
                        <label>Porcentaje</label>
                        <input
                          type="text"
                          value={`${getPercentage()}%`}
                          disabled
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="status">Estado</label>
                        <input
                          type="text"
                          id="status"
                          value={porcent.por_status}
                          disabled
                        />

                        {porcent.por_status === "Oficina" && (
                          <div className="form-group">
                            <label htmlFor="comment">Comentario</label>
                            <input
                              type="text"
                              id="comment"
                              value={porcent.por_comment}
                              disabled
                            />
                          </div>
                        )}

                        {porcent.por_status === "Obligatorio" && (
                          <div className="form-group">
                            <label htmlFor="delivery-price">
                              Precio de entrega
                            </label>
                            <input
                              type="text"
                              id="delivery-price"
                              value={`Precio de entrega: ${porcent.por_deliveryPrice}`}
                              disabled
                            />
                          </div>
                        )}

                        {porcent.por_status === "Desactivado" && (
                          <div className="form-group">
                            <label htmlFor="no-cash">Mensaje</label>
                            <input
                              type="text"
                              id="no-cash"
                              value="No hay efectivo para esta ubicación por los momentos."
                              disabled
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {withdrawalMethod === "transferencia" && (
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
              )}

              {withdrawalMethod === "efectivo" && (
                <>
                  <div className="form-group">
                    <label htmlFor="amount-send">Monto USD a recibir</label>
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
                    {errors.amount && (
                      <span className="error">{errors.amount}</span>
                    )}{" "}
                    {/* Mostrar mensaje de error */}
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount-receive">Monto {payment === "EUR" ? "EUR" : payment === "USD" ? "USD" : "GBP"} a debitar</label>
                    <input
                      type="number"
                      id="amount-receive"
                      value={calculateValue(amount, payment, porcent)}
                      readOnly
                      placeholder="Calculando..."
                    />
                  </div>
                </>
              )}

              {selectedCurrency && (
                <>
                  <div className="form-group">
                    <label htmlFor="amount-send">
                      {selectedCurrency === "USD"
                        ? "Monto a debitar"
                        : "Monto a enviar"}
                    </label>
                    {errors.amount && (
                      <span className="error">{errors.amount}</span>
                    )}{" "}
                    {/* Mostrar el error aquí */}
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
                    <label htmlFor="amount-receive">
                      {selectedCurrency === "USD"
                        ? "Monto USD a recibir "
                        : "Monto a recibir"}
                    </label>
                    <input
                      type="number"
                      id="amount-receive"
                      value={amountToReceive}
                      readOnly
                      placeholder="Calculando..."
                    />
                  </div>
                </>
              )}

              {amount && (
                <div className="exchange-rate-box">
                  <h4>Tasa de cambio</h4>
                  {currencyPrice.map((coin) => {
                    if (payment === "EUR" && selectedCurrency === "BS") {
                      return (
                        <p
                          key={coin.cur_EurToBs}
                        >{`1 ${payment} = ${coin.cur_EurToBs} Bs.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "ARS"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToArg_Pes}
                        >{`1 ${payment} = ${coin.cur_EurToArg_Pes} ARS.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "COP"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToCol_Pes}
                        >{`1 ${payment} = ${coin.cur_EurToCol_Pes} COP.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "CLP"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToPes_Ch}
                        >{`1 ${payment} = ${coin.cur_EurToPes_Ch} CLP.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "MXN"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToPes_Mex}
                        >{`1 ${payment} = ${coin.cur_EurToPes_Mex} MXN.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "PEN"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToSol_Pe}
                        >{`1 ${payment} = ${coin.cur_EurToSol_Pe} PEN.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "BRL"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToBra_Rea}
                        >{`1 ${payment} = ${coin.cur_EurToBra_Rea} BRL.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "USD-EC"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToUsd_Ecu}
                        >{`1 ${payment} = ${coin.cur_EurToUsd_Ecu} USD.`}</p>
                      );
                    } else if (
                      payment === "EUR" &&
                      selectedCurrency === "USD-PA"
                    ) {
                      return (
                        <p
                          key={coin.cur_EurToUsd_Pa}
                        >{`1 ${payment} = ${coin.cur_EurToUsd_Pa} USD.`}</p>
                      );
                    } else if (payment === "USD" && selectedCurrency === "BS") {
                      return (
                        <p
                          key={coin.cur_UsdToBs}
                        >{`1 ${payment} = ${coin.cur_UsdToBs} Bs.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "ARS"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToArg_Pes}
                        >{`1 ${payment} = ${coin.cur_UsdToArg_Pes} ARS.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "COP"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToCol_Pes}
                        >{`1 ${payment} = ${coin.cur_UsdToCol_Pes} COP.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "CLP"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToPes_Ch}
                        >{`1 ${payment} = ${coin.cur_UsdToPes_Ch} CLP.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "MXN"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToMex}
                        >{`1 ${payment} = ${coin.cur_UsdToPes_Mex} MXN.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "PEN"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToSol_Pe}
                        >{`1 ${payment} = ${coin.cur_UsdToSol_Pe} PEN.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "BRL"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToBra_Rea}
                        >{`1 ${payment} = ${coin.cur_UsdToBra_Rea} BRL.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "USD-EC"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToUsd_Ecu}
                        >{`1 ${payment} = ${coin.cur_UsdToUsd_Ecu} USD.`}</p>
                      );
                    } else if (
                      payment === "USD" &&
                      selectedCurrency === "USD-PA"
                    ) {
                      return (
                        <p
                          key={coin.cur_UsdToUsd_Pa}
                        >{`1 ${payment} = ${coin.cur_UsdToUsd_Pa} USD.`}</p>
                      );
                    } else if (payment === "GBP" && selectedCurrency === "BS") {
                      return (
                        <p
                          key={coin.cur_GbpToBs}
                        >{`1 ${payment} = ${coin.cur_GbpToBs} Bs.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "ARS"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToArg_Pes}
                        >{`1 ${payment} = ${coin.cur_GbpToArg_Pes} ARS.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "COP"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToCol_Pes}
                        >{`1 ${payment} = ${coin.cur_GbpToCol_Pes} COP.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "CLP"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToPes_Ch}
                        >{`1 ${payment} = ${coin.cur_GbpToPes_Ch} CLP.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "MXN"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToPes_Mex}
                        >{`1 ${payment} = ${coin.cur_GbpToPes_Mex} MXN.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "PEN"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToSol_Pe}
                        >{`1 ${payment} = ${coin.cur_GbpToSol_Pe} PEN.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "BRL"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToBra_Rea}
                        >{`1 ${payment} = ${coin.cur_GbpToBra_Rea} BRL.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "USD-EC"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToUsd_Ecu}
                        >{`1 ${payment} = ${coin.cur_GbpToUsd_Ecu} USD.`}</p>
                      );
                    } else if (
                      payment === "GBP" &&
                      selectedCurrency === "USD-PA"
                    ) {
                      return (
                        <p
                          key={coin.cur_GbpToUsd_Pa}
                        >{`1 ${payment} = ${coin.cur_GbpToUsd_Pa} USD.`}</p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {/* Botón de continuar */}
              {amount && (
                <div className="form-actions">
                  <button
                    className="continue-button"
                    onClick={() => setStep(step + 1)}
                    disabled={!!errors.amount} // Deshabilitar si hay errores
                  >
                    {errors.amount
                      ? "Corrige el error para continuar"
                      : "Continúa"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Paso 2: Selección de beneficiario */}
        {step === 2 && (
          <div className="beneficiary-step">
            <h2>Selecciona un beneficiario</h2>

            {withdrawalMethod === "efectivo" ? (
              <>
                <div className="form-container">
                  <div className="form-group">
                    <label htmlFor="receiver-name">
                      Nombre de quien recibe
                    </label>
                    <input
                      type="text"
                      id="receiver-name"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Ingrese el nombre del receptor"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="receiver-dni">Cédula de quien recibe</label>
                    <input
                      type="text"
                      id="receiver-dni"
                      value={receiverDni}
                      onChange={(e) => setReceiverDni(e.target.value)}
                      placeholder="Ingrese la cédula del receptor"
                    />
                  </div>

                  {porcent.por_status === "Obligatorio" && (
                    <div className="form-group">
                      <label htmlFor="phone">
                        Número de contacto de quien recibe
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ingrese número de contacto"
                      />
                    </div>
                  )}

                  {porcent.por_status === "Obligatorio" && (
                    <div className="form-group">
                      <label htmlFor="delivery-address">
                        Dirección de entrega
                      </label>
                      <input
                        type="text"
                        id="delivery-address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ingrese la dirección de entrega"
                      />
                    </div>
                  )}

                  {porcent.por_status === "Oficina" && (
                    <div className="form-group">
                      <label htmlFor="office-address">
                        Dirección de la oficina
                      </label>
                      <input
                        type="text"
                        id="office-address"
                        value={porcent.por_comment}
                        disabled
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="back-button" onClick={handleBack}>
                      Volver
                    </button>
                    <button
                      className="continue-button"
                      disabled={
                        !receiverName ||
                        !receiverDni ||
                        !phone ||
                        !deliveryAddress
                      }
                      onClick={() => setStep(3)}
                    >
                      Continúa
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="beneficiaries-list">
                  <>
                    {userDirectory.length === 0 ? (
                      <div className="beneficiaries-list">
                        <p style={{ color: "#003366" }}>
                          <strong>
                            No tienes beneficiarios agregados. Agrega uno para
                            continuar.
                          </strong>
                        </p>
                        <Link to="/Directory">
                          <div className="form-actions">
                            <button className="continue-button">
                              Agrega a tu beneficiario
                            </button>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="beneficiaries-list">
                          {userDirectory.filter(
                            (beneficiario) =>
                              beneficiario.accbsUser_status === "Activo" &&
                              (selectedCurrency === "BS"
                                ? beneficiario.accbsUser_country === "Venezuela"
                                : selectedCurrency === "ARS"
                                  ? beneficiario.accbsUser_country === "Argentina"
                                  : selectedCurrency === "USD"
                                    ? beneficiario.accbsUser_country ===
                                    "Estados Unidos"
                                    : selectedCurrency === "COP"
                                      ? beneficiario.accbsUser_country === "Colombia"
                                      : selectedCurrency === "CLP"
                                        ? beneficiario.accbsUser_country === "Chile"
                                        : selectedCurrency === "MXN"
                                          ? beneficiario.accbsUser_country === "Mexico"
                                          : selectedCurrency === "PEN"
                                            ? beneficiario.accbsUser_country === "Peru"
                                            : selectedCurrency === "BRL"
                                              ? beneficiario.accbsUser_country === "Brasil"
                                              : selectedCurrency === "USD-EC"
                                                ? beneficiario.accbsUser_country === "Ecuador"
                                                : selectedCurrency === "USD-PA"
                                                  ? beneficiario.accbsUser_country === "Panama"
                                                  : null)
                          ).length > 0 ? (
                            userDirectory
                              .filter(
                                (beneficiario) =>
                                  beneficiario.accbsUser_status === "Activo" &&
                                  (selectedCurrency === "BS"
                                    ? beneficiario.accbsUser_country ===
                                    "Venezuela"
                                    : selectedCurrency === "ARS"
                                      ? beneficiario.accbsUser_country ===
                                      "Argentina"
                                      : selectedCurrency === "USD"
                                        ? beneficiario.accbsUser_country ===
                                        "Estados Unidos"
                                        : selectedCurrency === "COP"
                                          ? beneficiario.accbsUser_country ===
                                          "Colombia"
                                          : selectedCurrency === "CLP"
                                            ? beneficiario.accbsUser_country === "Chile"
                                            : selectedCurrency === "MXN"
                                              ? beneficiario.accbsUser_country ===
                                              "Mexico"
                                              : selectedCurrency === "PEN"
                                                ? beneficiario.accbsUser_country === "Peru"
                                                : selectedCurrency === "BRL"
                                                  ? beneficiario.accbsUser_country ===
                                                  "Brasil"
                                                  : selectedCurrency === "USD-EC"
                                                    ? beneficiario.accbsUser_country ===
                                                    "Ecuador"
                                                    : selectedCurrency === "USD-PA"
                                                      ? beneficiario.accbsUser_country ===
                                                      "Panama"
                                                      : null)
                              )
                              .map((beneficiary) => (
                                <div
                                  className="beneficiary-card"
                                  key={beneficiary.accbsUser_id}
                                  onClick={() =>
                                    handleBeneficiarySelect(beneficiary)
                                  }
                                >
                                  <img
                                    src={
                                      beneficiary.accbsUser_country ===
                                        "Venezuela"
                                        ? venezuelaFlag
                                        : beneficiary.accbsUser_country ===
                                          "Argentina"
                                          ? argentina
                                          : beneficiary.accbsUser_country ===
                                            "Estados Unidos"
                                            ? usa
                                            : beneficiary.accbsUser_country ===
                                              "Colombia"
                                              ? colombia
                                              : beneficiary.accbsUser_country ===
                                                "Chile"
                                                ? chile
                                                : beneficiary.accbsUser_country ===
                                                  "Ecuador"
                                                  ? ecuador
                                                  : beneficiary.accbsUser_country ===
                                                    "Brasil"
                                                    ? brasil
                                                    : beneficiary.accbsUser_country ===
                                                      "Peru"
                                                      ? peru
                                                      : beneficiary.accbsUser_country ===
                                                        "Panama"
                                                        ? panama
                                                        : null
                                    }
                                    alt={beneficiary.accbsUser_country}
                                    className="flag-icon"
                                  />
                                  <div className="beneficiary-info">
                                    <h3>{beneficiary.accbsUser_owner}</h3>
                                    <p>Cédula: {beneficiary.accbsUser_dni}</p>
                                    <p>Banco: {beneficiary.accbsUser_bank}</p>
                                    <p>
                                      {beneficiary.accbsUser_type ===
                                        "Pago Movil"
                                        ? "Teléfono: " +
                                        beneficiary.accbsUser_phone
                                        : "Cuenta: " +
                                        beneficiary.accbsUser_number}
                                    </p>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="form-actions">
                              <p style={{ color: "red" }}>
                                <strong>
                                  No tienes beneficiarios activos. Agrega uno
                                  nuevo.
                                </strong>
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="form-actions">
                          <button className="back-button" onClick={handleBack}>
                            Volver
                          </button>
                          <button
                            className="add-beneficiary-button"
                            onClick={openModal}
                          >
                            Nuevo Beneficiario
                          </button>
                        </div>
                      </>
                    )}
                  </>
                </div>
              </>
            )}
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {step === 3 && (
          <div className="confirmation-step">
            <h2>Confirma los detalles</h2>
            <p>
              <strong>Moneda a enviar:</strong> {payment}
            </p>
            <p>
              <strong>Monto a Descontar:</strong>{" "}
              {withdrawalMethod === "efectivo"
                ? calculateValue(amount, payment, porcent)
                : amount}{" "}
              {payment}
            </p>
            <p>
              <strong>
                {withdrawalMethod === "efectivo"
                  ? "Monto USD a recibir"
                  : "Monto a recibir"}{" "}
                Monto a recibir:
              </strong>{" "}
              {withdrawalMethod === "efectivo"
                ? amount + " USD"
                : amountToReceive + " " + selectedCurrency}{" "}
            </p>
            <h3>Beneficiario seleccionado</h3>
            <p>
              <strong>Nombre:</strong>{" "}
              {selectedBeneficiary
                ? selectedBeneficiary.accbsUser_owner
                : receiverName}
            </p>
            <p>
              <strong>Cédula:</strong>{" "}
              {selectedBeneficiary
                ? selectedBeneficiary.accbsUser_dni
                : receiverDni}
            </p>
            <p>
              {selectedBeneficiary ? (
                <strong>Banco: {selectedBeneficiary.accbsUser_bank} </strong>
              ) : (
                <strong>Dirección de entrega: {deliveryAddress}</strong>
              )}
            </p>
            {selectedBeneficiary ? (
              <p>
                <strong>
                  {selectedBeneficiary.accbsUser_type === "Pago Movil"
                    ? "Teléfono: " + selectedBeneficiary.accbsUser_phone
                    : "Cuenta: " + selectedBeneficiary.accbsUser_number}
                </strong>
              </p>
            ) : null}

            <div className="form-actions">
              <button className="back-button" onClick={handleBack}>
                Volver
              </button>
              <button
                className="confirm-button"
                disabled={loading}
                onClick={() => {
                  handleSubmitSend();
                  setStep(4);
                }}
              >
                {loading ? "Enviando..." : "Confirmar y Enviar"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-container-edit step-4">
            {transactionError ? "¡Ocurrió un problema!" : "¡Retiro Exitoso!"}
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
                className="finish-button"
                onClick={() => (window.location.href = "/changes")}
              >
                Finalizar
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

              {/* Selección del país */}
              <label>País</label>
              <select
                value={accbsUser_country}
                onChange={(e) => setAccbsUser_country(e.target.value)}
              >
                <option value="">Seleccione un país</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
                <option value="Chile">Chile</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Panama">Panamá</option>
                <option value="Mexico">México</option>
                <option value="Brasil">Brasil</option>
                <option value="Estados Unidos">Estados Unidos</option>
              </select>
              {errors.accbsUser_country && (
                <span className="error">{errors.accbsUser_country}</span>
              )}

              {/* Mostrar el resto del formulario solo si se selecciona un país */}
              {accbsUser_country && (
                <>
                  {/* Nombre y apellido */}
                  <label>Nombre y Apellido</label>
                  <input
                    type="text"
                    name="nombre"
                    value={accbsUser_owner}
                    onChange={(e) => setAccbsUser_owner(e.target.value)}
                    placeholder="Ingresa el nombre y apellido"
                  />
                  {errors.accbsUser_owner && (
                    <span className="error">{errors.accbsUser_owner}</span>
                  )}

                  {/* Campo de cédula */}
                  {accbsUser_country !== "Estados Unidos" && (
                    <>
                      <label>Cédula</label>
                      <div className="cedula-input">
                        <input
                          type="text"
                          name="cedula"
                          value={accbsUser_dni}
                          onChange={(e) => setAccbsUser_dni(e.target.value)}
                          placeholder="Ingresa la cédula"
                        />
                      </div>
                      {errors.accbsUser_dni && (
                        <span className="error">{errors.accbsUser_dni}</span>
                      )}
                    </>
                  )}

                  {/* Selección de tipo de transacción */}
                  <label>Seleccione el tipo de transacción</label>
                  <select
                    value={accbsUser_type}
                    onChange={(e) => setAccbsUser_type(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {accbsUser_country === "Venezuela" && (
                      <option value="Pago Movil">Pago Móvil</option>
                    )}
                    {accbsUser_country === "Estados Unidos" && (
                      <>
                        <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                        <option value="Zelle">Zelle</option>
                      </>
                    )}
                    {accbsUser_country !== "Estados Unidos" && (
                      <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                    )}
                  </select>
                  {errors.accbsUser_type && (
                    <span className="error">{errors.accbsUser_type}</span>
                  )}

                  {/* Campos dinámicos para Pago Móvil en Venezuela */}
                  {accbsUser_country === "Venezuela" && accbsUser_type === "Pago Movil" && (
                    <>
                      {/* Número de Teléfono (Pago Móvil) */}
                      <label>Número de Teléfono (Pago Móvil)</label>
                      <div className="telefono-input">
                        <select
                          name="prefijoTelefono"
                          className="telefono-prefix"
                          value={telefonoPrefix} // El valor debe ser el prefijo que se haya extraído
                          onChange={(e) => setTelefonoPrefix(e.target.value)} // Cambiar el prefijo
                        >
                          <option value="...">...</option>
                          <option value="0414">0414</option>
                          <option value="0424">0424</option>
                          <option value="0412">0412</option>
                          <option value="0416">0416</option>
                          <option value="0426">0426</option>
                        </select>

                        <input
                          type="text"
                          name="telefono"
                          value={accbsUser_phone} // El valor de los últimos 7 dígitos del teléfono
                          onChange={(e) => setAccbsUser_phone(e.target.value)} // Cambiar el número de teléfono
                          placeholder="Ingresa el número telefónico"
                        />
                      </div>
                      {errors.accbsUser_phone && (
                        <span className="error">{errors.accbsUser_phone}</span>
                      )}

                      {/* Selección del banco */}
                      <label>Banco</label>
                      <select
                        name="banco"
                        value={accbsUser_bank}
                        onChange={(e) => setAccbsUser_bank(e.target.value)}
                      >
                        <option value="">Selecciona el banco</option>
                        {banksByCountry[accbsUser_country]?.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      {errors.accbsUser_bank && (
                        <span className="error">{errors.accbsUser_bank}</span>
                      )}

                      <button onClick={handleAddAccountSubmit} className="submit-button">
                        Guardar Beneficiario
                      </button>
                    </>
                  )}

                  {/* Zelle - Solo para Estados Unidos */}
                  {accbsUser_type === "Zelle" && accbsUser_country === "Estados Unidos" && (
                    <>
                      <label>Correo Electrónico (Zelle)</label>
                      <input
                        type="email"
                        name="email"
                        value={accbsUser_number} // Usamos el campo phone para almacenar el correo
                        onChange={(e) => setAccbsUser_number(e.target.value)}
                        placeholder="Ingresa el correo electrónico"
                      />
                      {errors.accbsUser_number && (
                        <span className="error">{errors.accbsUser_number}</span>
                      )}

                      {/* Selección del banco */}
                      <label>Banco</label>
                      <select
                        name="banco"
                        value={accbsUser_bank}
                        onChange={(e) => setAccbsUser_bank(e.target.value)}
                      >
                        <option value="">Selecciona el banco</option>
                        {banksByCountry[accbsUser_country]?.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      {errors.accbsUser_bank && (
                        <span className="error">{errors.accbsUser_bank}</span>
                      )}

                      <button onClick={handleAddAccountSubmit} className="submit-button">
                        Guardar Beneficiario
                      </button>
                    </>
                  )}

                  {/* Cuenta Bancaria - Solo para Estados Unidos */}
                  {accbsUser_type === "Cuenta Bancaria" && accbsUser_country === "Estados Unidos" && (
                    <>
                      <label>Número de Cuenta</label>
                      <input
                        type="text"
                        name="cuenta"
                        value={accbsUser_number}
                        onChange={(e) => setAccbsUser_number(e.target.value)}
                        placeholder="Ingresa el número de cuenta"
                      />
                      {errors.accbsUser_number && (
                        <span className="error">{errors.accbsUser_number}</span>
                      )}

                      {/* Selección del banco */}
                      <label>Banco</label>
                      <select
                        name="banco"
                        value={accbsUser_bank}
                        onChange={(e) => setAccbsUser_bank(e.target.value)}
                      >
                        <option value="">Selecciona el banco</option>
                        {banksByCountry[accbsUser_country]?.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      {errors.accbsUser_bank && (
                        <span className="error">{errors.accbsUser_bank}</span>
                      )}

                      <button onClick={handleAddAccountSubmit} className="submit-button">
                        Guardar Beneficiario
                      </button>
                    </>
                  )}

                  {/* Campos dinámicos para Cuenta Bancaria en otros países */}
                  {accbsUser_type === "Cuenta Bancaria" && accbsUser_country !== "Estados Unidos" && (
                    <>
                      <label>Cuenta Bancaria</label>
                      <input
                        type="text"
                        name="cuenta"
                        value={accbsUser_number}
                        onChange={(e) => setAccbsUser_number(e.target.value)}
                        placeholder="Ingresa el número de cuenta"
                      />
                      {errors.accbsUser_number && (
                        <span className="error">{errors.accbsUser_number}</span>
                      )}

                      <label>Banco</label>
                      <select
                        name="banco"
                        value={accbsUser_bank}
                        onChange={(e) => setAccbsUser_bank(e.target.value)}
                      >
                        <option value="">Selecciona el banco</option>
                        {banksByCountry[accbsUser_country]?.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      {errors.accbsUser_bank && (
                        <span className="error">{errors.accbsUser_bank}</span>
                      )}

                      <button onClick={handleAddAccountSubmit} className="submit-button">
                        Guardar Beneficiario
                      </button>
                    </>
                  )}
                </>
              )}




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
                  (window.location.href = "/sendmoney")
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
    ) : (
      <NotFound /> // Usar el componente NotFound aquí
    )
  ) : (
    <Redirect to="/login" />
  );
}

export { SendMoney };
