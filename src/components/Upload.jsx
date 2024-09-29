import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                alert('File type not supported. Please upload an Excel, PDF, or image file.');
                return;
            }

            const selectedFile = acceptedFiles[0];
            const type = selectedFile.type;

            if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                navigate('/upload-type/excel');
            } else if (type === 'application/pdf') {
                navigate('/upload-type/pdf');
            } else if (type.startsWith('image/')) {
                navigate('/upload-type/image');
            }
        }
    });

    return (
        <div className='flex flex-col justify-center items-center mt-1'>
            <div
                className='
                h-[200px] w-full p-4 ml-1 mr-1 
                sm:h-[300px] sm:w-[600px]
                md:h-[300px] md:w-[700px]
                flex flex-col justify-center items-center
                border-[2px] border-dashed border-gray-500
                rounded-md text-center'
                {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="text-xl text-gray-700">Drag 'n' drop a file here, or click to select a file</p>
            </div>
        </div>
    );
}
