import React from 'react';
import './CardFooterStyle.css';

const CardFooter:React.FC<any> = ({ footerButtons }) => {
  return (
    <div className="card-footer">
      <ul className="card-buttons">
        {footerButtons && footerButtons?.map((item: any) => item)}
      </ul>
    </div>
  );
};

export default CardFooter;
