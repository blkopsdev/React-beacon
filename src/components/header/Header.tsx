/* 
* Header simply displays the header on all pages
*/

import * as React from 'react';
import HeaderMenu from './HeaderMenu';
import { Link } from 'react-router-dom';

const headerImg = require('src/images/BeaconLogo@2x.png');

const Header = (props: any) => {
  return (
    <div className="header">
      <Link to={'/dashboard'}>
        <img src={headerImg} />
      </Link>
      <HeaderMenu {...props} />
    </div>
  );
};

export default Header;
