import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Select() {
  return (
    <div className='flex flex-col items-center mt-2 text-xl font-poppins'>
      
      {/* Informational Section */}
      <div className='max-w-4xl text-center mb-8 p-4'>
        <h2 className='text-xl font-normal mb-2'>Welcome to ExcelInsight</h2>
        <p className='text-sm text-gray-700'>
        ExcelInsight helps you quickly analyze and visualize data from your PDF and Excel files. 
          Simply upload or scan your documents to generate insightful charts, graphs, and summaries that make your data easy to understand and use.
        </p>
      </div>

      {/* Navigation Links */}
      <div className='flex justify-center items-center w-full'>
        <NavLink 
          to="upload" 
          className={({ isActive }) => `
            flex justify-center items-center
            w-full sm:w-[300px] md:w-[350px]
            rounded-md
            ${isActive ? "border-b-2 border-gray-300 text-blue-600" : "border-none"}
            cursor-pointer
          `}
        >
          <p>Upload</p>            
        </NavLink>
        {/* <NavLink 
          to="scan" 
          className={({ isActive }) => `
            flex justify-center items-center
            w-full sm:w-[300px] md:w-[350px]
            rounded-md
            ${isActive ? "border-b-2 border-gray-300 text-blue-600" : "border-none"}
            cursor-pointer
          `}
        >
          <p>Scan</p>            
        </NavLink> */}
      </div>
    </div>
  );
}
