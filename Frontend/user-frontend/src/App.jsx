import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useState , useEffect } from "react";
import { CartProvider } from "./Components/Context/CartContext";

import AllProducts from "./Components/AllCake/All";
import Home from "./Components/Categores/Home";
import Cart from "./Components/Cart/Cart";
import Bakery from "./Components/Categores/Bakery";
import Boxes from "./Components/Boxes/Boxes";
import Cakes from "./Components/Categores/Cakes";
import Catering from "./Components/Categores/Catering";
import Sweets from "./Components/Categores/Sweets";
import Layout from "./Components/Layout/Layout"
import NotFound from "./Components/NotFound/NotFound";
// import Signup from "./Components/Sign/signup";
// import Signin from "./Components/Sign/signin";
import DetailsPage from "./Components/DetailsPage/DetailsPage";



function App() {

  const routers = createBrowserRouter([
  {path:'/' , element :<Layout /> ,children:[
    { index: true, element: <Home /> },
    {path:'all', element:<AllProducts />},
    {path:'cart', element:<Cart  />},
    {path:'bakery', element:<Bakery  />},
    {path:'boxes', element:<Boxes />},
    {path:'cakes', element:<Cakes/>},
    {path:'catering', element:<Catering/>},
    {path:'sweets', element:<Sweets/>},
    // {path:'signin', element:<Signin/>},
    // {path:'signup', element:<Signup/>},
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