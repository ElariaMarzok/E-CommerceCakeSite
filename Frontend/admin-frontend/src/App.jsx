import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import AddProduct from './Components/AddProduct';
import Navbar from './Components/Navbar';
import Order from './Components/Order';
import User from './Components/User';
import EditCake from './Components/EditCake';
import Grow from './Components/Grow';
import Signup from './Components/Sign/signup';
import Signin from './Components/Sign/signin';
import ProtectedRoute from './Components/ProtectedRoute';




function App() {


  return (
   
    <div className='dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300'>
    <Navbar />
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard /> } />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/users" element={<User />} />
        <Route path="/edit/:id" element={<EditCake />} />
        <Route path="/grow" element={<Grow />} />
      </Route>
      

      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
    </div>
  
  );
}

export default App;