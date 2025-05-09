import React from 'react';
import './FooterSyn.css';
import FooterBanner from '../assets/banner.jpg';

const FooterSyn = () => {
  return (
    <div className="synfooter">
      <img src={FooterBanner} alt="Footer Banner" className="synfooter-banner" />
    </div>
  );
};

export default FooterSyn;

