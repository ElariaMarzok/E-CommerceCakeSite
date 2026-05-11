import { useState } from 'react';
import { Link , useLocation} from 'react-router-dom';
import logoCake from '../assets/logoCake.jpg';
import { useTranslation } from 'react-i18next';
import { ShoppingCart , Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
   const location = useLocation(); // to get current path for active link styling 
   //style Desktop navigation links based on active route
   const isActive = "text-pink-500 font-bold";
   const isNotActive = "text-gray-700 hover:text-pink-500 font-medium";
 //style mobile menu links based on active route
  const activeStyle = "block px-4 py-3 bg-pink-50 text-pink-600 font-bold rounded-lg transition-all";
  const idleStyle = "block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-gray-50 transition-colors rounded-lg font-medium";



  const { i18n } = useTranslation();
  // tranlate function to toggle between languages 
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  // flags for language switcher 
  const flags = {
    en: "https://flagcdn.com/w40/us.png", //USA flag for English
    es: "https://flagcdn.com/w40/es.png"  //Spain flag for Spanish
  };
  return (
    <nav className=" bg-white shadow-lg sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* there is logo  */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* <Cake className="text-pink-500 group-hover:rotate-12 transition-transform" size={36} /> */}
            <img src={logoCake} alt="CakeSite Logo" 
            className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
               Mary's Cake 
            </span>
          </Link>

          {/* Center: Desktop Navigation (Hidden on Mobile) */}
           <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-gray-700 hover:text-pink-500 font-medium ${location.pathname === '/' ? isActive : isNotActive}`}>Dashboard</Link>
            <Link to="/users" className={`text-gray-700 hover:text-pink-500 font-medium ${location.pathname === '/users' ? isActive : isNotActive}`}>Users</Link>
            <Link to="/orders" className={`text-gray-700 hover:text-pink-500 font-medium ${location.pathname === '/orders' ? isActive : location.pathname === '/orders' ? isActive : isNotActive}`}>Orders</Link>
          </div>

      {/* Language Switcher with Flag */}
      <div className="flex items-center gap-4">

        {/*  login and cart icons (Hidden on Mobile) */}
        {/* <div className="hidden md:flex items-center justify-end-safe gap-6">
            <Link to="/signin" className={`text-gray-700 hover:text-pink-500 font-medium ${location.pathname === '/signin' ? isActive : isNotActive}`}>
              SIGN IN
            </Link>
            <Link to="/signup" className={`text-gray-700 hover:text-pink-500 font-medium ${location.pathname === '/signup' ? isActive : isNotActive}`}>
              SIGN UP
            </Link>
             <Link to="/cart" className="relative p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-all">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
            </Link>
          </div>   */}


        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-pink-50 border border-gray-100 rounded-2xl transition-all group">
          <div className="w-8 h-6 flex items-center justify-center overflow-hidden rounded-sm shadow-sm group-hover:scale-110 transition-transform">
            <img 
              src={i18n.language === 'en' ? flags.en : flags.es} 
              alt="Flag"
              className="w-full h-full object-cover"/>
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Language</span>
            <span className="text-sm font-bold text-gray-700">
               {i18n.language === 'en' ? 'English' : 'Español'}
            </span>
          </div>
        </button>
      </div>
            {/* Mobile Button (Visible only on Mobile) */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      
      {/* Mobile Menu List  */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen pb-6' : 'max-h-0'}`}>
        <div className="px-4 pt-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className={location.pathname === '/' ? activeStyle : idleStyle}>Dashboard</Link>
          <Link to="/users" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-500 transition-colors rounded-lg font-medium">USERS</Link>
          <Link to="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-500 transition-colors rounded-lg font-medium">ORDERS</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





