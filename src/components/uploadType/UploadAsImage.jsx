import React, { useState } from 'react';

export default function UploadAsImage() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div className="flex flex-col items-center mt-8 p-4 text-center w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Image File</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
                Please upload your image file for analysis.
            </p>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />

            <button
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                Upload
            </button>
        </div>
    );
}
