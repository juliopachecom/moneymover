import React, { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import comisionesIcon from "../Assets/Images/0-percent.png";
import rapidaIcon from "../Assets/Images/rush.png";
import opcionesIcon from "../Assets/Images/menu.png";
import seguroIcon from "../Assets/Images/verified.png";
import featureVideo from "../Assets/Images/featurevideo.mp4";
import arrowIcon from "../Assets/Images/arrow.png";
// import spainFlag from "../Assets/Images/spain.png";
// import usaFlag from "../Assets/Images/usa.png";
// import germanyFlag from "../Assets/Images/germany.png";
import colombiaFlag from "../Assets/Images/colombia.png";
import argentinaFlag from "../Assets/Images/argentina.png";
import panamaFlag from "../Assets/Images/panama.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import brasilFlag from "../Assets/Images/square.png";
import peruFlag from "../Assets/Images/peru.png";
import chileFlag from "../Assets/Images/chile.png";
import ecuadorFlag from "../Assets/Images/ecuador.png";
import protest from "../Assets/Images/protest.png";
import verified1 from "../Assets/Images/verified1.png";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function Home() {
  const { infoTkn, url } = useDataContext();

  //Calculator
  const [exchangeRate, setExchangeRate] = useState([]);
  // const [eurAmount, setEurAmount] = useState(0);
  // const [vefAmount, setVefAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState(100);
  const [receiveAmount, setReceiveAmount] = useState(0);
  // const [rate, setRate] = useState(1)

  //Anexos
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [sendCountry, setSendCountry] = useState("EUR");
  const [receiveCountry, setReceiveCountry] = useState("VEF");

  const calculateRemittance = useCallback(() => {
    if (exchangeRate.length === 0) {
      console.log("Exchange rate is empty or not loaded.");
      return;
    }

    console.log("Calculating remittance with:", {
      sendCountry,
      receiveCountry,
      sendAmount,
      exchangeRate,
    });

    let selectedRate = 1;

    if (sendCountry === "EUR" && receiveCountry === "VEF") {
      selectedRate = exchangeRate[0].cur_EurToBs;
    } else if (sendCountry === "USD" && receiveCountry === "VEF") {
      selectedRate = exchangeRate[0].cur_UsdToBs;
    }

    const result = sendAmount * selectedRate;
    console.log("Calculated receive amount:", result);
    setReceiveAmount(result);
  }, [sendCountry, receiveCountry, sendAmount, exchangeRate]);

  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/CurrencyPrice`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setExchangeRate(response.data);
      console.log(response.data); // Puedes quitar este console.log si ya no lo necesitas.
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange rate", error);
      // setError("Error fetching exchange rate");
      // setLoading(false);
    }
  }, [infoTkn, url]);

  useEffect(() => {
    AOS.init({ duration: 1200 });
    console.log("Fetching exchange rate...");
    fetchExchangeRate(); // Solo ejecuta esta función una vez al montar el componente.
  }, [fetchExchangeRate]); // Lista de dependencias con fetchExchangeRate

  useEffect(() => {
    if (exchangeRate.length > 0) {
      calculateRemittance();
    }
  }, [
    sendCountry,
    receiveCountry,
    sendAmount,
    exchangeRate,
    calculateRemittance,
  ]);

  return (
    <div className="home">
      <div className="home__message" data-aos="fade-down">
        ENVÍOS SIN COMISIONES
      </div>

      <div className="home__section">
        <div className="home__content" data-aos="fade-right">
          <h1>¿Quieres enviar dinero a tu familia desde Europa?</h1>
          <p>
            ¡Nosotros te ayudaremos! Haz tu envío ahora mismo y recibe por
            transferencia bancaria
          </p>
          <ul className="home__benefits" data-aos="fade-up">
            <li>SIN COMISIÓN</li>
            <li>PAGO EN MENOS DE 1 HORA</li>
            <li>MEJOR TASA</li>
          </ul>
        </div>

        <div className="home__calculator" data-aos="fade-left">
          <h2>¿A dónde deseas enviar dinero?</h2>

          <div className="calculator__input">
            <label>Envías desde:</label>
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
            />
            <select
              value={sendCountry}
              onChange={(e) => {
                setSendCountry(e.target.value);
              }}
              className="flag-select"
            >
              <option value="EUR">🇪🇸 EUR</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="GBP">🇬🇧 GBP</option>
            </select>
          </div>

          <div className="calculator__input">
            <label>Reciben en:</label>
            <input type="text" value={receiveAmount.toFixed(2)} readOnly />
            <select
              value={receiveCountry}
              onChange={(e) => {
                setReceiveCountry(e.target.value);
              }}
              className="flag-select"
            >
              <option value="VEF">🇻🇪 VEF</option>
              <option value="COP">🇨🇴 COP</option>
              <option value="ARS">🇦🇷 ARS</option>
              <option value="PAB">🇵🇦 PAB</option>
              <option value="BRL">🇧🇷 BRL</option>
              <option value="PEN">🇵🇪 PEN</option>
              <option value="CLP">🇨🇱 CLP</option>
              <option value="USD_ECU">🇪🇨 USD</option>
            </select>
          </div>

          <Link to="/changes">
            <button className="start-button"> Comenzar</button>
          </Link>
        </div>
      </div>

      <strong>
        <label>Envia de forma rápida y segura a:</label>
      </strong>

      <div className="home__flags" data-aos="fade-up">
        <img src={colombiaFlag} alt="Colombia" />
        <img src={argentinaFlag} alt="Argentina" />
        <img src={panamaFlag} alt="Panama" />
        <img src={venezuelaFlag} alt="Venezuela" />
        <img src={brasilFlag} alt="Brasil" />
        <img src={peruFlag} alt="Perú" />
        <img src={chileFlag} alt="Chile" />
        <img src={ecuadorFlag} alt="Ecuador" />
      </div>

      <div className="home__header" data-aos="zoom-in">
        <span className="icon">
          <img
            src={verified1}
            alt="Comprometidos a mantener tus datos protegidos"
          />
        </span>
        <h2>Comprometidos a mantener tus datos protegidos</h2>
      </div>

      <div className="verification-section" data-aos="flip-up">
        <div className="verification-section__card">
          <div className="verification-section__content">
            <div className="verification-section__text">
              <h3>¡Verifica tu identidad de forma rápida y segura!</h3>
              <p>
                ¡La verificación es obligatoria para enviar dinero según la
                normativa española! Tus datos estarán protegidos. ¡Verificarte
                solo te tomará 3 minutos!
              </p>
            </div>
            <div className="verification-section__button">
              <button className="verification-section__custom-button">
                Saber más
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <h2 className="section-title" data-aos="fade-down">
          ¿Cómo enviar dinero con Money Mover?
        </h2>
        <div className="how-it-works-content">
          <div className="how-it-works-video" data-aos="fade-right">
            <video src={featureVideo} autoPlay loop muted playsInline />
          </div>
          <div className="how-it-works-steps" data-aos="fade-left">
            <p>
              <img src={arrowIcon} alt="arrow" className="arrow-icon" />{" "}
              Regístrate con tu email y realiza el proceso de verificación de
              identidad
            </p>
            <p>
              <img src={arrowIcon} alt="arrow" className="arrow-icon" />{" "}
              Selecciona cuánto deseas enviar y realiza el pago
            </p>
            <p>
              <img src={arrowIcon} alt="arrow" className="arrow-icon" />{" "}
              Selecciona el beneficiario y ¡LISTO, ENVÍO REALIZADO!
            </p>
          </div>
        </div>
      </div>

      <div className="home__header" data-aos="zoom-in">
        <span className="icon">
          <img src={protest} alt="Sin comisiones" />
        </span>
        <h2>Descubre porque las personas confían en Money Mover</h2>
      </div>

      <div className="features-section">
        <div className="feature" data-aos="fade-up">
          <div className="feature__icon">
            <img src={comisionesIcon} alt="Sin comisiones" />
          </div>
          <h3 className="feature__title">Sin comisiones</h3>
          <p className="feature__description">
            Con Money Mover tus envíos por transferencia bancaria a moneda local
            SIN COMISIONES.
          </p>
        </div>
        <div className="feature" data-aos="fade-up" data-aos-delay="100">
          <div className="feature__icon">
            <img src={rapidaIcon} alt="Transferencia Rápida" />
          </div>
          <h3 className="feature__title">Transferencia Rápida</h3>
          <p className="feature__description">
            Tus envíos por transferencia bancaria llegarán en menos de 30
            minutos.
          </p>
        </div>
        <div className="feature" data-aos="fade-up" data-aos-delay="200">
          <div className="feature__icon">
            <img src={opcionesIcon} alt="Más opciones" />
          </div>
          <h3 className="feature__title">Más opciones</h3>
          <p className="feature__description">
            Puedes elegir el metodo de pago, sea una transferencia bancaria o
            retiro en efectivo
          </p>
        </div>
        <div className="feature" data-aos="fade-up" data-aos-delay="300">
          <div className="feature__icon">
            <img src={seguroIcon} alt="Seguro" />
          </div>
          <h3 className="feature__title">Seguro</h3>
          <p className="feature__description">
            Tus beneficios pasan por distintos niveles de seguridad diseñados
            para proteger tus envíos.
          </p>
        </div>
      </div>

      <div className="home__section--special">
        <div className="special-content">
          <div className="special-text" data-aos="fade-right">
            <h2>
              Sabemos que cuando envías dinero, lo haces para ayudar a quien
              para ti es alguien especial.
            </h2>
            <p>
              Enviar dinero a tus seres queridos puede ser un poco complicado,
              en algunos casos con largos tiempos de espera para que puedan
              recibir el dinero y en ocasiones deben desplazarse para hacer el
              retiro. En Money Mover, el proceso de envío es rápido, sin
              comisiones en transferencia a cuenta bancaria y garantizado.
              Puedes pagar con transferencias y elegir la forma cómo deseas que
              tu familiar reciba su remesa. Regístrate y comienza a enviar
              dinero en línea hoy.{" "}
            </p>
            <Link to="/changes">
              <button className="start-button">Comenzar ahora</button>
            </Link>
          </div>
          <div className="special-image" data-aos="fade-left">
            <img src={require("../Assets/Images/abuelo1.jpeg")} alt="Abuelo" />
          </div>
        </div>
      </div>

      <div className="horizontal-section">
        <div className="horizontal-section__item" data-aos="fade-up">
          <img
            src={require("../Assets/Images/globe.png")}
            alt="Europa"
            className="horizontal-section__icon"
          />
          <h3>Enviar dinero desde Europa</h3>
          <p>
            Envía dinero desde toda Europa y recíbelo en minutos. Recibe en
            Latinoamérica y paga por transferencia.
          </p>
        </div>
        <div
          className="horizontal-section__item"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img
            src={require("../Assets/Images/24-7.png")}
            alt="24/7"
            className="horizontal-section__icon"
          />
          <h3>Envía 24/7</h3>
          <p>
            Nuestra plataforma está disponible las 24 horas del día, los 7 días
            de la semana para que puedas realizar tus envios sin interrupciones.
          </p>
        </div>
        <div
          className="horizontal-section__item"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <img
            src={require("../Assets/Images/wallet.png")}
            alt="Billetera"
            className="horizontal-section__icon"
          />
          <h3>Billetera</h3>
          <p>
            Nuestra plataforma está diseñada para ser usada como billetera, lo
            que podrás realizar tus pagos de forma inmediata.
          </p>
        </div>
      </div>
    </div>
  );
}

export { Home };
