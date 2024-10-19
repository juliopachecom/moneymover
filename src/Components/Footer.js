import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="#home">Inicio</a></li>
            <li><a href="#about">Sobre Nosotros</a></li>
            <li><a href="#services">Servicios</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h3>Contacto</h3>
          <p>Teléfono: +1 234 567 890</p>
          <p>Email: contacto@example.com</p>
        </div>
        <div className="footer__section">
          <h3>Síguenos</h3>
          <div className="footer__social">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Your Company. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export { Footer };
