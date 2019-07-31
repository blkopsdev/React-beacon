import * as React from 'react';
import { constants } from '../../constants/constants';
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
}) => {
  const colorIndex = `${color}Banner`;
  return (
    <div
      className="banner purple soso"
      style={{
        backgroundColor: color,
        background: `linear-gradient(${constants.colors[colorIndex]},
      ${constants.colors[colorIndex]}), url(${img}) no-repeat left/cover`
      }}
    >
      <span className="title">{title}</span>
      {subtitle && <span className="subtitle">{subtitle}</span>}
    </div>
  );
};
