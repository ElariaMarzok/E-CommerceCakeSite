import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Cakes() {
  const [cakesFromDb, setCakesFromDb] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();       // عشان نعرف اللغة الحالية
  const API_URL = import.meta.env.VITE_API_URL;

  // ── Helper: يستخرج النص الصح حسب اللغة ──────────────────────
  // يشتغل مع الداتا القديمة (string) والجديدة (object) معاً
  const getText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;          // داتا قديمة
    return field[i18n.language] || field.es || field.en || ''; // داتا جديدة
  };

  // ── جلب البيانات مع تمرير اللغة ─
  useEffect(() => {
    const fetchCakes = async () => {
      try {
        // بنبعت ?lang= عشان الباك إند يرجع النص المترجم جاهز
        const response = await fetch(`${API_URL}/cakes?lang=${i18n.language}`); 
        const data = await response.json();
        
        const filteredCakes = data.filter(item => item.category === 'cakes');
        setCakesFromDb(filteredCakes);
      } catch (error) {
        console.error("Error fetching cakes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [i18n.language]); // يعيد الجلب لما المستخدم يغير اللغة

  // ── handleAdd ─────────────────────────────────────────────────
  const handleAdd = (cake) => {
    addToCart({
      id:    cake._id,
      name:  getText(cake.name),    // string دايماً مش object
      price: cake.prices?.[0]?.price || 0,
      img:   cake.images?.[0] ? (cake.images[0].startsWith('http') ? cake.images[0] : `${API_URL}${cake.images[0]}`) : ""
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="animate-pulse text-pink-500 font-bold text-xl">
          {t('loading_cakes', 'Loading Masterpieces... 🍰')}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('cakes_title', 'Our Special Cakes')}
          </h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* التحقق من وجود بيانات */}
        {cakesFromDb.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            {t('no_cakes_found', 'No cakes found in this category yet.')}
          </p>
        )}

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cakesFromDb.map((cake) => (
            <div 
              key={cake._id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 overflow-hidden"
            >
              {/* Image Container */}
              <Link 
                to={`/details/${cake._id}`}
                state={{ product: cake }} 
                className="relative h-72 overflow-hidden block"
              >
                <img 
                  src={cake.images && cake.images[0] 
                    ? cake.images[0].startsWith('http') 
                      ? cake.images[0]
                      : `${API_URL}${cake.images[0]}` 
                    : 'https://via.placeholder.com/500'} 
                  loading='lazy'
                  alt={getText(cake.name)} // string مش object
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              {/* Content Section */}
              <div className="p-6 text-center">
                {/* getText بدل cake.name مباشرة */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {getText(cake.name)}
                </h3>
    

                <p className="text-pink-600 font-bold text-lg mb-4">
                   {cake.prices?.[0]?.price || 0} {t('currency', 'EGP')}
                </p>
                
                <button 
                  onClick={() => handleAdd(cake)}
                  className="flex items-center justify-center gap-2 w-full bg-pink-50 text-pink-600 font-semibold py-3 rounded-2xl hover:bg-pink-600 hover:text-white transition-all"
                >
                  <ShoppingCart size={18} />
                  {t('add_to_cart', 'Add to Cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}