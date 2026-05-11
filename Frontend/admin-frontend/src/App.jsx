import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import AddProduct from './Components/AddProduct';
import Navbar from './Components/Navbar';
import Order from './Components/Order';
import User from './Components/User';
import EditCake from './Components/EditCake';




function App() {
  // const [cakes, setCakes] = useState(() => {
  //   const savedCakes = localStorage.getItem('cake_inventory');
  //   return savedCakes ? JSON.parse(savedCakes) : [
  //     { id: 1, name: "Strawberry Velvet", price: 22.00, category: "Boxes", size: "Large", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop" },
  //     { id: 2, name: "Chocolate Dream", price: 18.00, category: "Cakes", size: "Medium", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=200&auto=format&fit=crop" },
  //     { id: 3, name: "Vanilla Bliss", price: 20.00, category: "Wedding", size: "Small", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop" }
  //   ];
  // 
  

  return (
   
    <div className='dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300'>
    <Navbar />
    <Routes>
      <Route path="/" element={<Dashboard /> } />``
      <Route path="/add-product" element={<AddProduct cakes={[]} setCakes={()=>{}} />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/users" element={<User />} />
      <Route path="/edit/:id" element={<EditCake cakes={[]} setCakes={()=>{}} />} />
    </Routes>
    </div>
  
  );
}

export default App;