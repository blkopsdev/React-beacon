import * as React from 'react';
export default ({ title, img }: any) => (
  <div className="banner">
    <img src={img} />
    <span>{title}</span>
  </div>
);
