/* 
* Header simply displays the header on all pages
*/

import * as React from 'react';
import HeaderMenu from './HeaderMenu';
import { Link } from 'react-router-dom';

const headerImg = require('src/images/KittenLogo@2x.png');

const Header = () => {
  return (
    <div className="header">
      <Link to={'dashboard'}>
        <img src={headerImg} />
      </Link>
      <HeaderMenu />
    </div>
  );
};

export default Header;
