import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar"
import { Outlet } from "react-router-dom";
import ScrollToTop from "../Scroll/ScrollToTop";

export default function Layout({cart}){
    return(
        <>
        <ScrollToTop />
        <Navbar cart={cart}/>
        <Outlet /> 
        <Footer /> 
        </>
    )
    
}