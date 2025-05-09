import React from 'react';
import './Header.css';
import headerImg from '../assets/home_banner.jpg';

function Header() {
  return (
    <header className="header-container">
      {/* Background image with opacity control */}
      <div 
        className="header-background" 
        style={{ backgroundImage: `url(${headerImg})` }}
      ></div>
      
      {/* Content (title) - unaffected by opacity */}
      <div className="header-overlay">
        <div className="header-title-box">
          <h1>HELENA TL</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
