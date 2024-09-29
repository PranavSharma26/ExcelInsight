import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App.jsx';
import UploadType from './components/uploadType/UploadType.jsx';
import UploadAsExcel from './components/uploadType/UploadAsExcel.jsx';
import UploadAsPDF from './components/uploadType/UploadAsPDF.jsx';
import UploadAsImage from './components/uploadType/UploadAsImage.jsx';
import Scan from './components/Scan.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="upload" element={<UploadType />} />
      <Route path="upload-as-excel" element={<UploadAsExcel />} />
      <Route path="upload-as-pdf" element={<UploadAsPDF />} />
      <Route path="upload-as-image" element={<UploadAsImage />} />
      <Route path="scan" element={<Scan />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
