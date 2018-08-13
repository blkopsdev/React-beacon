import * as React from 'react';
export default ({ title, img, color }: any) => (
  <div className="banner" style={{ backgroundColor: color }}>
    <img src={img} />
    <span>{title}</span>
  </div>
);
