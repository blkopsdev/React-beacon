import * as React from 'react';
import { constants } from 'src/constants/constants';
export default ({
  title,
  img,
  color,
  subtitle
}: {
  title: string;
  img: any;
  subtitle?: string;
  color: string;
}) => (
  <div
    className="banner purple"
    style={{
      backgroundColor: color,
      background: `linear-gradient(${constants.colors[`${color}Banner`]},
      ${constants.colors[`${color}Banner`]}), url(${img}) no-repeat left/cover`
    }}
  >
    {/* <img src={img} /> */}
    <span className="title">{title}</span>
    {subtitle && <span className="subtitle">{subtitle}</span>}
  </div>
);
