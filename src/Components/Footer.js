import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import logo from '../Assets/Images/logo.png'; // Asegúrate de que la ruta sea correcta

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
      <div className="footer__logo">
        <a href="https://moneymoveroficial.com/"> <img src={logo} alt="Company Logo" /></a> 
        </div>
        <div className="footer__section">
          <h3>Enlaces de interes</h3>
          <ul>
           <strong> <li><a href="https://moneymoveroficial.com/">Página Principal</a></li>
            <li><a href="https://moneymoveroficial.com/TermsAndConditions">Términos y Condiciones</a></li>
            <li><a href="https://moneymoveroficial.com/Privacy">Politica de privacidad </a></li>
            <li><a href="https://wa.me/+34602679774">Contacto</a></li></strong>
          </ul>
        </div>
        <div className="footer__section">
          <h3>Contacto</h3>
          <p>Teléfono: +34 602 679 774</p>
          <p>Email: hello@moneymoveroficial.com</p>
        </div>
        <div className="footer__section">
          <h3>Redes Sociales</h3>
          <div className="footer__social">
            <a href="https://wa.me/+34602679774" aria-label="Facebook"><FaWhatsapp /></a>
            <a href="https://facebook.com/moneymoveroficial" aria-label="Twitter"><FaFacebook /></a>
            <a href="https://instagram.com/moneymoveroficial" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <strong><p>&copy; {new Date().getFullYear()} MoneyMoverOficial. All rights reserved.</p></strong>
      </div>
    </footer>
  );
}

export { Footer };
