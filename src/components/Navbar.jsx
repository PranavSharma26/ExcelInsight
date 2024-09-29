import React from 'react';
import { NavLink } from 'react-router-dom';
function Navbar() {
  return (
    <div className='
      flex items-center p-4
      border-b-2 shadow-sm h-12 
      font-medium font-poppins tracking-wide text-2xl
    '>
      <div className='    
        bg-gradient-to-r 
        from-blue-800 
        via-green-400  
        to-green-700
        bg-clip-text text-transparent
      '>
        <NavLink to='/'>
          <h1>ExcelInsight</h1>
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
