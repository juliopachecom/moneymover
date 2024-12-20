import React, { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
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
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast } from "react-toastify";
import { banksByCountry } from "../Utils/Variables";
import { Redirect } from "react-router-dom";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function Directory() {
  useAxiosInterceptors();
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

  // Estado para editar beneficiario
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

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

  const openEditModal = (beneficiario) => {
    setSelectedBeneficiary(beneficiario);
    setIsEditModalOpen(true);
    setAccbsUser_type(beneficiario.accbsUser_type);

    // Extraer el prefijo correctamente para Pago Móvil
    if (beneficiario.accbsUser_type === "Pago Movil" && beneficiario.accbsUser_phone) {
      const phone = beneficiario.accbsUser_phone;
      setTelefonoPrefix(phone.slice(0, 4)); // Extrae los primeros 4 dígitos correctamente
      setAccbsUser_phone(phone.slice(4));   // Extrae los 7 dígitos restantes correctamente
    } else {
      setAccbsUser_phone(beneficiario.accbsUser_phone); // Para otros casos como Zelle o cuenta bancaria
    }

    setAccbsUser_number(beneficiario.accbsUser_number);
  };




  const closeEditModal = () => {
    setSelectedBeneficiary(null);
    setIsEditModalOpen(false);
  };

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

    if (accbsUser_type === "Pago Movil") {
      const fullPhone = telefonoPrefix + accbsUser_phone;
      if (!accbsUser_phone) {
        newErrors.accbsUser_phone = "El número telefónico es requerido.";
      } else if (!/^\d+$/.test(fullPhone)) {
        newErrors.accbsUser_phone = "El número telefónico solo puede contener dígitos.";

      }
    }

    if (!accbsUser_bank) {
      newErrors.accbsUser_bank = "El banco es requerido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



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
    }
  };
  
  




  const handleEdit = async (event) => {
    event.preventDefault();
    const finalPhone = accbsUser_type === "Pago Movil" ? telefonoPrefix + accbsUser_phone : accbsUser_phone;

    try {
      await axios.put(
        `${url}/AccBsUser/${selectedBeneficiary.accbsUser_id}`,
        {
          accbsUser_owner: accbsUser_owner ? accbsUser_owner : selectedBeneficiary.accbsUser_owner,
          accbsUser_bank: accbsUser_bank ? accbsUser_bank : selectedBeneficiary.accbsUser_bank,
          accbsUser_number: accbsUser_number ? accbsUser_number : selectedBeneficiary.accbsUser_number,
          accbsUser_dni: accbsUser_dni ? accbsUser_dni : selectedBeneficiary.accbsUser_dni,
          accbsUser_phone: finalPhone, // Aquí se concatena el prefijo y el número de teléfono
          accbsUser_type: accbsUser_type ? accbsUser_type : selectedBeneficiary.accbsUser_type,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      closeEditModal();
      window.location.reload();

      toast.success("Beneficiario editado con éxito!", {
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
      toast.error("Error al editar el beneficiario", {
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
                  beneficiario.accbsUser_country === "Venezuela"
                    ? venezuelaFlag
                    : beneficiario.accbsUser_country === "Argentina"
                      ? argentina
                      : beneficiario.accbsUser_country === "Colombia"
                        ? colombia
                        : beneficiario.accbsUser_country === "Chile"
                          ? chile
                          : beneficiario.accbsUser_country === "Ecuador"
                            ? ecuador
                            : beneficiario.accbsUser_country === "Brasil"
                              ? brasil
                              : beneficiario.accbsUser_country === "Peru"
                                ? peru
                                : beneficiario.accbsUser_country === "Panama"
                                  ? panama
                                  : beneficiario.accbsUser_country === "Estados Unidos"
                                    ? usa
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
  <p>Télefono: {beneficiario.accbsUser_phone}</p>

  {/* Condicional para mostrar "Correo" si es Zelle en Estados Unidos */}
  {beneficiario.accbsUser_country === "Estados Unidos" && beneficiario.accbsUser_type === "Zelle" ? (
    <p>Correo: {beneficiario.accbsUser_number}</p>
  ) : (
    <p>Cuenta: {beneficiario.accbsUser_number}</p>
  )}

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
              <div
                className="remesa-button tooltip"
                onClick={() => openEditModal(beneficiario)}
              >
                <FaEdit />
                <span className="tooltiptext">Editar Beneficiario</span>
              </div>

              <span
                className="remesa-button"
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
  <option value="...">...</option> {/* Opción predeterminada */}
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

      {/* Modal para editar beneficiario */}
      {isEditModalOpen && selectedBeneficiary && (
        <div className="modal-overlay fadeIn">
          <div className="modal-content fadeIn">
            <button className="modal-close" onClick={closeEditModal}>
              &times;
            </button>
            <h2>Editar Beneficiario</h2>

            <form onSubmit={handleEdit}>
              {/* Mostrar el país del beneficiario */}
              <label>País</label>
              <select disabled value={selectedBeneficiary.accbsUser_country}>
                <option>{selectedBeneficiary.accbsUser_country}</option>
              </select>

              {/* Campo de nombre y apellido */}
              <label>Nombre y Apellido</label>
              <input
                type="text"
                defaultValue={selectedBeneficiary.accbsUser_owner}
                onChange={(e) => setAccbsUser_owner(e.target.value)}
              />

              {/* Ocultar cédula si el país es Estados Unidos */}
              {selectedBeneficiary.accbsUser_country !== "Estados Unidos" && (
                <>
                  <label>Cédula</label>
                  <input
                    type="text"
                    defaultValue={selectedBeneficiary.accbsUser_dni}
                    onChange={(e) => setAccbsUser_dni(e.target.value)}
                  />
                </>
              )}

              {/* Selección del tipo de transacción */}
              <label>Seleccione el tipo de transacción</label>
              <select
                value={accbsUser_type} // Mantener actualizado el tipo de transacción seleccionado
                onChange={(e) => setAccbsUser_type(e.target.value)}
              >
                {selectedBeneficiary.accbsUser_country === "Venezuela" && (
                  <option value="Pago Movil">Pago Móvil</option>
                )}
                {selectedBeneficiary.accbsUser_country === "Estados Unidos" && (
                  <>
                    <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                    <option value="Zelle">Zelle</option>
                  </>
                )}
                {selectedBeneficiary.accbsUser_country !== "Estados Unidos" && (
                  <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                )}
              </select>

              {/* Mostrar campos dinámicos según el tipo de transacción */}

              {/* Campos para "Pago Móvil" (solo para Venezuela) */}
              {selectedBeneficiary.accbsUser_country === "Venezuela" && accbsUser_type === "Pago Movil" && (
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

                </>
              )}

              {/* Campos para "Cuenta Bancaria" */}
              {(accbsUser_type === "Cuenta Bancaria" || selectedBeneficiary.accbsUser_country !== "Estados Unidos") && (
                <>
                  <label>Número de Cuenta</label>
                  <input
                    type="text"
                    value={accbsUser_number || ""}
                    onChange={(e) => setAccbsUser_number(e.target.value)}
                  />
                </>
              )}

              {/* Campos para "Zelle" (solo para Estados Unidos) */}
              {accbsUser_type === "Zelle" && selectedBeneficiary.accbsUser_country === "Estados Unidos" && (
                <>
                  <label>Correo Electrónico (Zelle)</label>
                  <input
                    type="email"
                    value={accbsUser_number} // Usar accbsUser_phone para almacenar el correo de Zelle
                    onChange={(e) => setAccbsUser_number(e.target.value)}
                  />
                </>
              )}

              {/* Campo de selección del banco (aplicable para cualquier tipo de transacción) */}
              <label>Banco</label>
              <select
                value={accbsUser_bank || selectedBeneficiary.accbsUser_bank}
                onChange={(e) => setAccbsUser_bank(e.target.value)}
              >
                {banksByCountry[selectedBeneficiary.accbsUser_country]?.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>

              {/* Botón para guardar cambios */}
              <button type="submit" className="submit-button">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  ) : (
    <Redirect to="/login" />
  );
}

export { Directory };