import React from 'react';
import Navbar from './components/Navbar';
import Select from './components/Select';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Select />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export default App;
