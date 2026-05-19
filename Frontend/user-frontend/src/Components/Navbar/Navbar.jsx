import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronDown, Menu, X, Globe } from 'lucide-react'; // أضفت أيقونة Globe للجمالية
import logoCake from '../../assets/logoCake.jpg'
import { useCart } from "../Context/CartContext";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { totalQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const categoryLinks = [
    { name: t('all_items'), path: '/all' },
    { name: t('navbar.bakery'), path: '/bakery' },
    { name: t('navbar.cakes'), path: '/cakes' },
    { name: t('navbar.catering'), path: '/catering' },
    { name: t('navbar.sweets'), path: '/sweets' }
    

  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const flags = {
    en: "https://flagcdn.com/w40/us.png",
    es: "https://flagcdn.com/w40/es.png"
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoCake} alt="CakeSite Logo" 
                 className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Mary's Cake
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-500 font-medium">{t('navbar.home')}</Link>

            {/* <Link to="/all" className="text-gray-700 hover:text-pink-500 font-medium">{t('all_items')}</Link> */}
            
            <div className="relative group py-4">
              <button className="flex items-center gap-1 text-gray-700 hover:text-pink-500 font-medium uppercase tracking-wide">
                {t('navbar.categories')} <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  {categoryLinks.map((item) => (
                    <Link key={item.name} to={item.path} className="block px-4 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/boxes" className="text-gray-700 hover:text-pink-500 font-medium">{t('navbar.boxes')}</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-all">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalQuantity}</span>
            </Link>

            {/* Desktop Language Button (Hidden on Mobile) */}
            <button 
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-pink-50 border border-gray-100 rounded-2xl transition-all group"
            >
              <div className="w-8 h-6 flex items-center justify-center overflow-hidden rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                <img src={i18n.language === 'en' ? flags.en : flags.es} alt="Flag" className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('navbar.language')}</span>
                <span className="text-sm font-bold text-gray-700">{i18n.language === 'en' ? 'English' : 'Español'}</span>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu List */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen pb-8 shadow-inner' : 'max-h-0'}`}>
        <div className="px-6 pt-6 space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-500 transition-colors rounded-xl font-medium bg-gray-50">{t('navbar.home')}</Link>
          
          <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('navbar.categories')}</div>
          {categoryLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={() => setIsOpen(false)}
              className="block px-8 py-3 text-gray-600 hover:text-pink-500 transition-colors rounded-lg border-l-2 border-transparent hover:border-pink-200"
            >
              {item.name}
            </Link>
          ))}
          
          <Link to="/boxes" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-500 font-medium">{t('navbar.boxes')}</Link>

          {/* --- زر اللغة داخل قائمة الموبايل --- */}
          <div className="pt-4 mt-4 border-t border-gray-50">
            <button 
              onClick={() => {
                toggleLanguage();
                setIsOpen(false); // غلق القائمة بعد تغيير اللغة
              }}
              className="w-full flex items-center justify-between px-6 py-4 bg-pink-50/50 hover:bg-pink-50 rounded-[2rem] transition-all border border-pink-100/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={i18n.language === 'en' ? flags.en : flags.es} alt="Flag" className="w-full h-full object-cover"/>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest leading-none mb-1">{t('navbar.language')}</p>
                  <p className="text-base font-bold text-gray-800">{i18n.language === 'en' ? 'English' : 'Español'}</p>
                </div>
              </div>
              <Globe size={20} className="text-pink-300" />
            </button>
          </div>
         

        </div>
      </div>
    </nav>
  );
};

export default Navbar;