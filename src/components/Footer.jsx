import React from 'react';
import './Footer.css';
import AnchorIcon from '../assets/anchor.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2024 Helena TL. All Rights Reserved.</p>
        <p className="jp-text">ヘレナは知っていたよ〜</p>
      </div>
      <div className="footer-right">
        <img src={AnchorIcon} alt="Anchor Logo" className="footer-anchor" />
      </div>
    </footer>
  );
};

export default Footer;

