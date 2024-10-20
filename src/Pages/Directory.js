import React, { useState, useEffect, useCallback } from "react";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import chile from "../Assets/Images/chile.png";
import colombia from "../Assets/Images/colombia.png";
import ecuador from "../Assets/Images/ecuador.png";
import argentina from "../Assets/Images/argentina.png";
import brasil from "../Assets/Images/square.png";
import peru from "../Assets/Images/peru.png";
import panama from "../Assets/Images/panama.png";
import { NavBarUser } from "../Components/NavBarUser";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast } from "react-toastify";
import { banksByCountry } from "../Utils/Variables";
import { Redirect } from "react-router-dom";

function Directory() {
  const { logged, url, infoTkn } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState("");
  const [accbsUser_owner, setAccbsUser_owner] = useState("");
  const [accbsUser_number, setAccbsUser_number] = useState("");
  const [accbsUser_dni, setAccbsUser_dni] = useState("");
  const [accbsUser_phone, setAccbsUser_phone] = useState("");
  const [accbsUser_type, setAccbsUser_type] = useState("");
  const [accbsUser_country, setAccbsUser_country] = useState("");

  //Alternar entre activos e inactivos
  const [showInactive, setShowInactive] = useState(false);

  const toggleShowInactive = () => {
    setShowInactive(!showInactive);
  };

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  // Estado del usuario
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);

  // Prefijos para teléfono
  const [telefonoPrefix, setTelefonoPrefix] = useState("");

  // Fetch de datos del usuario
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

  // Alternar modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!accbsUser_country) {
      newErrors.accbsUser_country = "El país es requerido.";
    }

    if (!accbsUser_owner) {
      newErrors.accbsUser_owner = "El nombre es requerido.";
    }

    if (!accbsUser_dni) {
      newErrors.accbsUser_dni = "La cédula es requerida.";
    }

    if (accbsUser_type === "Pago Movil") {
      if (!accbsUser_phone) {
        newErrors.accbsUser_phone = "El número telefónico es requerido.";
      } else if (!/^\d+$/.test(accbsUser_phone)) {
        newErrors.accbsUser_phone =
          "El número telefónico solo puede contener dígitos.";
      } else if (accbsUser_phone.length !== 7) {
        newErrors.accbsUser_phone =
          "El número telefónico debe tener 7 dígitos.";
      }
    } else if (accbsUser_type === "Cuenta Bancaria") {
      if (!accbsUser_number) {
        newErrors.accbsUser_number = "El número de cuenta es requerido.";
      } else if (!/^\d+$/.test(accbsUser_number)) {
        newErrors.accbsUser_number =
          "El número de cuenta solo puede contener dígitos.";
      } else if (accbsUser_number.length !== 20) {
        newErrors.accbsUser_number =
          "El número de cuenta debe tener 20 dígitos.";
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

  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post(
        `${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni,
          accbsUser_phone: telefonoPrefix + accbsUser_phone,
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
      console.log(error);
      toast.error("Error al agregar la cuenta", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleStatus = async (beneficiario) => {
    try {
      if (beneficiario.accbsUser_status === "Inactivo") {
        await axios.put(
          `${url}/AccBsUser/${beneficiario.accbsUser_id}`,
          {
            accbsUser_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else {
        await axios.put(
          `${url}/AccBsUser/${beneficiario.accbsUser_id}`,
          {
            accbsUser_status: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      window.location.reload();

      toast.success("Cuenta desactivada con éxito!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al desactivar la cuenta", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  return logged ? (
    <div className="directorio">
      <NavBarUser />
      <div className="directorio__header">
        <h1>Tus Beneficiarios</h1>
        <div className="directorio__actions">
          <button className="action-button" onClick={toggleShowInactive}>
            {showInactive ? "Ver activos" : "Ver inactivos"}
          </button>
          <button className="action-button" onClick={toggleModal}>
            Nuevo beneficiario
          </button>
        </div>
      </div>
      <div className="directorio__list">
        {userDirectory
          .filter((beneficiario) =>
            showInactive
              ? beneficiario.accbsUser_status === "Inactivo"
              : beneficiario.accbsUser_status === "Activo"
          )
          .map((beneficiario) => (
            <div className="beneficiario-card" key={beneficiario.accbsUser_id}>
              <img
                src={
                  beneficiario.accbsUser_country === "venezuela"
                    ? venezuelaFlag
                    : beneficiario.accbsUser_country === "argentina"
                    ? argentina
                    : beneficiario.accbsUser_country === "Venezuela"
                    ? venezuelaFlag
                    : beneficiario.accbsUser_country === "colombia"
                    ? colombia
                    : beneficiario.accbsUser_country === "chile"
                    ? chile
                    : beneficiario.accbsUser_country === "ecuador"
                    ? ecuador
                    : beneficiario.accbsUser_country === "brasil"
                    ? brasil
                    : beneficiario.accbsUser_country === "peru"
                    ? peru
                    : beneficiario.accbsUser_country === "panama"
                    ? panama
                    : //Falta agregar el de Mexico
                      null
                }
                alt="flag"
                className="flag-icon"
              />
              <div className="beneficiario-info">
                <h3>{beneficiario.accbsUser_owner}</h3>
                <p>Transferencia bancaria</p>
                <p>Cédula: {beneficiario.accbsUser_dni}</p>
                <p>Banco: {beneficiario.accbsUser_bank}</p>
                <p>Cuenta: {beneficiario.accbsUser_number}</p>
                <p>Número teléfonico: {beneficiario.accbsUser_phone}</p>
                <p>{beneficiario.accbsUser_type}</p>
              </div>
              <button
                className="remesa-button"
                onClick={() => {
                  window.location.href = `/sendmoney`;
                }}
              >
                Envía tu Remesa
              </button>
              <span
                className="estado"
                onClick={() => {
                  handleStatus(beneficiario);
                }}
              >
                {beneficiario.accbsUser_status}
              </span>
            </div>
          ))}
      </div>

      {/* Modal para agregar nuevo beneficiario */}
      {/* Modal para agregar nuevo beneficiario */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? "open" : "close"}`}>
          <div className="modal-content">
            <button className="close-button" onClick={toggleModal}>
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

                {/* Cédula */}
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
                  <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                </select>
                {errors.accbsUser_type && (
                  <span className="error">{errors.accbsUser_type}</span>
                )}

                {/* Campos dinámicos */}
                {accbsUser_type === "Pago Movil" && (
                  <>
                    {/* Número de Teléfono */}
                    <label>Número de Teléfono</label>
                    <div className="telefono-input">
                      <select
                        name="prefijoTelefono"
                        className="telefono-prefix"
                        value={telefonoPrefix}
                        onChange={(e) => setTelefonoPrefix(e.target.value)}
                      >
                        <option value="0414">0414</option>
                        <option value="0424">0424</option>
                        <option value="0412">0412</option>
                        <option value="0416">0416</option>
                        <option value="0426">0426</option>
                      </select>
                      <input
                        type="text"
                        name="telefono"
                        value={accbsUser_phone}
                        onChange={(e) => setAccbsUser_phone(e.target.value)}
                        placeholder="Ingresa el número telefónico"
                      />
                    </div>
                    {errors.accbsUser_phone && (
                      <span className="error">{errors.accbsUser_phone}</span>
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

                    <button
                      onClick={handleAddAccountSubmit}
                      className="submit-button"
                    >
                      Guardar Beneficiario
                    </button>
                  </>
                )}

                {accbsUser_type === "Cuenta Bancaria" && (
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

                    <button
                      onClick={handleAddAccountSubmit}
                      className="submit-button"
                    >
                      Guardar Beneficiario
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  ) : (
    <Redirect to="/login" />
  );
}

export { Directory };
