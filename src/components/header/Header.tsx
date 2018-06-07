import * as React from 'react';
import HeaderMenu from './HeaderMenu';

const headerImg = require('src/images/KittenLogo@2x.png');

const Header = () => {
  return (
    <div className="header">
      <img src={headerImg} />
      <HeaderMenu />
    </div>
  );
};

export default Header;
