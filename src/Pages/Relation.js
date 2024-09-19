import React, { useState, useEffect } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";

function Relation() {
  // Datos de prueba para recargas y retiros
  const [transacciones, setTransacciones] = useState([
    { nombre: "Ruben Quintana", recarga: 100, retirada: 30, venezuela: 1200, tasa: 40, moneda: "USD", fecha: "2024-09-16" },
    { nombre: "Wilfredo Vargas", recarga: 80, retirada: 20, venezuela: 1000, tasa: 50, moneda: "EUR", fecha: "2024-09-17" },
    { nombre: "Andrea Quintero", recarga: 80, retirada: 0, venezuela: 3200, tasa: 40, moneda: "GBP", fecha: "2024-09-17" },
    // ... agregar más datos
  ]);

  const [filtro, setFiltro] = useState("TODOS");
  const [fechaFiltro, setFechaFiltro] = useState("");
  
  // Datos de prueba para usuarios con saldos positivos (EUR, USD, GBP)
  const [usuariosSaldoPositivo, setUsuariosSaldoPositivo] = useState([
    { nombre: "Ruben Quintana", saldoEur: 70, saldoUsd: 50, saldoGbp: 30 },
    { nombre: "Wilfredo Vargas", saldoEur: 880, saldoUsd: 300, saldoGbp: 0 },
    // ... agregar más datos
  ]);

  const [showSaldoModal, setShowSaldoModal] = useState(false);

  // Establecer fecha del sistema como valor predeterminado
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFechaFiltro(today);
  }, []);

  // Totales calculados
  const calcularTotales = (campo) => {
    return transacciones.reduce((total, transaccion) => total + (transaccion[campo] || 0), 0);
  };

  // Filtrar transacciones por moneda y fecha
  const filtrarTransacciones = () => {
    let transaccionesFiltradas = transacciones;
    if (filtro !== "TODOS") {
      transaccionesFiltradas = transaccionesFiltradas.filter((transaccion) => {
        if (filtro === "LIBRAS") return transaccion.moneda === "GBP";
        if (filtro === "DOLARES") return transaccion.moneda === "USD";
        if (filtro === "EUROS") return transaccion.moneda === "EUR";
        return true;
      });
    }

    if (fechaFiltro) {
      transaccionesFiltradas = transaccionesFiltradas.filter(
        (transaccion) => transaccion.fecha === fechaFiltro
      );
    }

    return transaccionesFiltradas;
  };

  const transaccionesFiltradas = filtrarTransacciones();

  return (
    <div className="relation-dashboard">
      <div className="dashboard-content">
      <NavBarAdmin /> {/* Ahora colocado debajo de dashboard-content */}
        <h2 className="section-title">Relación de Recargas y Retiros</h2>

        {/* Filtro de Fecha */}
        <div className="date-filter">
          <label htmlFor="fecha">Filtrar por Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {/* Botones de Filtro */}
        <div className="filter-buttons">
          <button
            className={filtro === "LIBRAS" ? "active" : ""}
            onClick={() => setFiltro("LIBRAS")}
          >
            <FaPoundSign /> Recarga Libras
          </button>
          <button
            className={filtro === "DOLARES" ? "active" : ""}
            onClick={() => setFiltro("DOLARES")}
          >
            <FaDollarSign /> Recarga Dólares
          </button>
          <button
            className={filtro === "EUROS" ? "active" : ""}
            onClick={() => setFiltro("EUROS")}
          >
            <FaEuroSign /> Recarga Euros
          </button>
          <button
            className={filtro === "TODOS" ? "active" : ""}
            onClick={() => setFiltro("TODOS")}
          >
            Ver Todo
          </button>
        </div>

        {/* Tabla de Recargas y Retiros */}
        <div className="transactions-section">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Recarga del Día</th>
                <th>Retirada del Día</th>
                <th>Venezuela</th>
                <th>Valor de la Tasa</th>
                <th>Moneda</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.length > 0 ? (
                transaccionesFiltradas.map((transaccion, index) => (
                  <tr key={index}>
                    <td>{transaccion.nombre}</td>
                    <td>{transaccion.recarga}</td>
                    <td>{transaccion.retirada}</td>
                    <td>{transaccion.venezuela}</td>
                    <td>{transaccion.tasa}</td>
                    <td>{transaccion.moneda}</td>
                    <td>{transaccion.fecha}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No se encontraron transacciones para la fecha seleccionada
                  </td>
                </tr>
              )}
              <tr className="totales-row">
                <td><strong>Totales</strong></td>
                <td>{calcularTotales("recarga")}</td>
                <td>{calcularTotales("retirada")}</td>
                <td>{calcularTotales("venezuela")}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botón para mostrar usuarios con saldo positivo */}
        <div className="positive-balance-button">
          <button className="btn btn-primary" onClick={() => setShowSaldoModal(true)}>
            Ver Usuarios con Saldos Positivos
          </button>
        </div>

        {/* Modal de Usuarios con Saldos Positivos */}
        {showSaldoModal && (
          <div className="modal show">
            <div className="modal-content">
              <h3>Usuarios con Saldos Positivos</h3>
              <table className="positive-balance-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Saldo EUR</th>
                    <th>Saldo USD</th>
                    <th>Saldo GBP</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosSaldoPositivo.map((usuario, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{usuario.nombre}</td>
                      <td>€{usuario.saldoEur}</td>
                      <td>${usuario.saldoUsd}</td>
                      <td>£{usuario.saldoGbp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-secondary" onClick={() => setShowSaldoModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

     
    </div>
  );
}

export { Relation };
