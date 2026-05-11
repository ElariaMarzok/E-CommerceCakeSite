import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useState , useEffect } from "react";
import { CartProvider } from "./Components/Context/CartContext";

import Home from "./Components/Categores/Home";
import Cart from "./Components/Cart/Cart";
import Bakery from "./Components/Categores/Bakery";
import Boxes from "./Components/Boxes/Boxes";
import Cakes from "./Components/Categores/Cakes";
import Catering from "./Components/Categores/Catering";
import Sweets from "./Components/Categores/Sweets";
import Layout from "./Components/Layout/Layout"
import NotFound from "./Components/NotFound/NotFound";
import Signup from "./Components/Sign/signup";
import Signin from "./Components/Sign/signin";
import DetailsPage from "./Components/DetailsPage/DetailsPage";



function App() {
//   //Lifting State Up to be visable for all pages 
//   const [cart, setCart] = useState(() => {
//   const savedCart = localStorage.getItem("cakeCart");
//   return savedCart ? JSON.parse(savedCart) : [];
// });

  // const [cakes] = useState([]);
  // // to arrive setCart
  // const addToCart = (product) => {
  //   setCart((prev) => {
  //     const isExist = prev.find(item => item.id === product.id);
  //     if (isExist) {
  //       return prev.map(item => 
  //         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  //       );
  //     }
  //     return [...prev, { ...product, quantity: 1 }];
  //   });
  // };


//   // increace or decres the quantity 
//   const updateQuantity = (id, amount) => {
//   setCart((prev) =>
//     prev.map((item) =>
//       item.id === id 
//         ? { ...item, quantity: Math.max(1, item.quantity + amount) } 
//         : item
//     )
//   );
// };

// useEffect(() => {
//   localStorage.setItem("cakeCart", JSON.stringify(cart));
// }, [cart]);


  const routers = createBrowserRouter([
  {path:'/' , element :<Layout /> ,children:[
    { index: true, element: <Home /> },
    {path:'cart', element:<Cart  />},
    {path:'bakery', element:<Bakery  />},
    {path:'boxes', element:<Boxes />},
    {path:'cakes', element:<Cakes/>},
    {path:'catering', element:<Catering/>},
    {path:'sweets', element:<Sweets/>},
    {path:'signin', element:<Signin/>},
    {path:'signup', element:<Signup/>},
    {path:'details/:id', element:<DetailsPage/>},
    {path:'*', element:<NotFound/>}


    
  ]}
])

  
   return(
   
      <CartProvider> 
           <RouterProvider router={routers} />
      </CartProvider>

      
 );
    
}

export default App;