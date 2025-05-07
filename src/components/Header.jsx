import React from 'react';
import './Header.css';
import headerImg from '../assets/home_banner.jpg'; // Use your image path

function Header() {
  return (
    <header className="header" style={{ backgroundImage: `url(${headerImg})` }}>
      <div className="header-overlay">
        <div className="header-title-box">
          <h1>HELENA TL</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;

