import React from 'react';
import { NavLink } from 'react-router-dom';

export default function UploadType() {
    return (
        <div className='flex flex-col items-center mt-8 text-center'>
            <h2 className='text-2xl font-semibold mb-4'>Select File Type</h2>
            <p className='text-sm text-gray-700 mb-6'>
                Please choose the type of file you have uploaded to proceed with the analysis.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
                <NavLink
                    to="/upload-as-excel"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-indigo-500">
                    Excel
                </NavLink>
                {/* <NavLink
                    to="/upload-as-pdf"
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-pink-500">
                    PDF
                </NavLink>
                <NavLink
                    to="/upload-as-image"
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-teal-500">
                    Image
                </NavLink> */}
            </div>
        </div>
    );
}
