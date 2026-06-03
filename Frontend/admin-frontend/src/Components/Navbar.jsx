import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoCake from '../assets/logoCake.jpg';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, LogOut, User } from 'lucide-react';
import { useAuth } from './Context/AuthContext';
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 2. جلب بيانات الأدمن ودالة تسجيل الخروج وحالة التحقق
  const { admin, logout, isAuthenticated } = useAuth();

  // تنسيقات الروابط
  const isActive = "text-pink-500 font-bold border-b-2 border-pink-500 pb-1";
  const isNotActive = "text-gray-700 hover:text-pink-500 font-medium transition-colors";
  const activeStyle = "block px-4 py-3 bg-pink-50 text-pink-600 font-bold rounded-lg transition-all";
  const idleStyle = "block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-gray-50 transition-colors rounded-lg font-medium";

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false); // إغلاق قائمة الموبايل في حال كان مفتوحاً منها
    navigate('/signin');
  };

  const flags = {
    en: "https://flagcdn.com/w40/us.png",
    es: "https://flagcdn.com/w40/es.png"
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* 1. الـ Logo على اليسار */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoCake} alt="CakeSite Logo" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                Mary's Cake 
              </span>
            </Link>
          </div>

          {/* 2. الليست في المنتصف (تظهر فقط في الـ PC) */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-12">
            <Link to="/" className={location.pathname === '/' ? isActive : isNotActive}>
              {t('navbar.dashboard')}
            </Link>
            <Link to="/users" className={location.pathname === '/users' ? isActive : isNotActive}>
              {t('navbar.users')}
            </Link>
            <Link to="/orders" className={location.pathname === '/orders' ? isActive : isNotActive}>
              {t('navbar.orders')}
            </Link>
            <Link to="/grow" className={location.pathname === '/grow' ? isActive : isNotActive}>
              {t('navbar.grow')}
            </Link>
          </div>

          {/* 3. الزرار على اليمين */}
          <div className="flex items-center gap-4">
            
            {/* أزرار الـ PC المعتمدة على حالة التسجيل */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                // 🌟 إذا كان مسجل دخول في الـ PC: يعرض الاسم وزر الخروج
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-xl border border-pink-100">
                    <User size={16} className="text-pink-500" />
                    <span className="text-gray-700 font-bold text-sm">
                      {t('navbar.welcome')}, {admin?.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm shadow-sm"
                  >
                    <LogOut size={15} />
                    {t('navbar.signout')}
                  </button>
                </div>
              ) : (
                // 🔒 إذا كان غير مسجل دخول في الـ PC: يعرض أزرار الدخول والتسجيل العادية
                <div className="flex items-center gap-3">
                  <Link to="/signup" className="text-pink-500 hover:bg-pink-500 hover:rounded-xl hover:p-2 transition-all hover:text-white font-medium ">
                    {t('navbar.signup')}
                  </Link>
                  <Link to="/signin" className="text-pink-500 hover:bg-pink-500 hover:rounded-xl hover:p-2 transition-all hover:text-white font-medium">
                    {t('navbar.signin')}
                  </Link>
                </div>
              )}
            </div>

            {/* زر اللغة للـ PC */}
            <button 
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-pink-50 border border-gray-100 rounded-2xl transition-all group"
            >
              <div className="w-8 h-6 overflow-hidden rounded-sm shadow-sm">
                <img src={i18n.language === 'en' ? flags.en : flags.es} alt="Flag" className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('navbar.language_label')}</span>
                <span className="text-sm font-bold text-gray-700">{i18n.language === 'en' ? 'English' : 'Español'}</span>
              </div>
            </button>

            {/* زر الموبايل */}
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
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen pb-6' : 'max-h-0'}`}>
        <div className="px-4 pt-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className={location.pathname === '/' ? activeStyle : idleStyle}>{t('navbar.dashboard')}</Link>
          <Link to="/users" onClick={() => setIsOpen(false)} className={location.pathname === '/users' ? activeStyle : idleStyle}>{t('navbar.users')}</Link>
          <Link to="/orders" onClick={() => setIsOpen(false)} className={location.pathname === '/orders' ? activeStyle : idleStyle}>{t('navbar.orders')}</Link>
          <Link to="/grow" onClick={() => setIsOpen(false)} className={location.pathname === '/grow' ? activeStyle : idleStyle}>{t('navbar.grow')}</Link>
          
          {/* 📱 إدارة أزرار الحساب داخل قائمة الموبايل */}
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg font-bold text-sm">
                  <User size={16} />
                  {t('navbar.welcome')}, {admin?.username}
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors rounded-lg font-bold text-sm"
                >
                  <LogOut size={16} />
                  {t('navbar.signout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/signin" onClick={() => setIsOpen(false)} className="block text-center px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg text-sm border border-gray-200">
                  {t('navbar.signin')}
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-center px-4 py-2.5 bg-pink-500 text-white font-bold rounded-lg text-sm shadow-sm">
                  {t('navbar.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* زر اللغة للموبايل */}
          <button 
            onClick={() => { toggleLanguage(); setIsOpen(false); }}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-colors rounded-lg font-medium border-t border-gray-50 mt-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-6 overflow-hidden rounded-sm shadow-sm border border-gray-100">
                <img src={i18n.language === 'en' ? flags.en : flags.es} alt="Flag" className="w-full h-full object-cover"/>
              </div>
              <span className="text-sm font-bold">{i18n.language === 'en' ? 'English' : 'Español'}</span>
            </div>
            <Globe size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;