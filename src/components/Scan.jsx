import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

function Scan() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsDesktop(userAgent.indexOf('Mobile') === -1);
  }, []);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <div className='flex flex-col items-center justify-center mt-1'>
      {isDesktop ? (
        <div className='relative flex justify-center items-center border-2 border-blue-400 h-auto w-auto'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className='h-full w-full'
          />
          <button
            className='absolute bottom-4 left-1/2 border-sky-300 border-2 transform -translate-x-1/2 px-4 py-1 bg-white text-white rounded-full hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400'
            onClick={capture}
          >
            .
          </button>
          {image && (
            <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full text-center'>
              <p className='text-lg text-gray-700'>Captured Image:</p>
              <img src={image} alt="Captured" className='mt-2 border-2 border-gray-300 rounded-md' />
            </div>
          )}
        </div>
      ) : (
        <div>Camera not supported on mobile</div>
      )}
      <button
        className='mt-4 px-4 py-2 h-10 w-36 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
      >
        Summarize
      </button>
    </div>
  );
}

export default Scan;
