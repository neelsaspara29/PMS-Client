import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import { useSelector } from 'react-redux';
import Home from './Pages/Home';

function App() {

  const isLogin:boolean = useSelector((state:any) => state?.auth.isLoggedIn)
  return (
    <>
    {
      !isLogin ? <Routes> 
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='*' element={<Navigate to={'/login'} />} />
      </Routes> : 
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Navigate to={'/'} />} />

      </Routes>
    }
   
    <Toaster position='top-right'/>
    </>
  );
}

export default App;
