import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Bakery() {
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading]     = useState(true);

  const { addToCart }  = useCart();
  const { t, i18n }    = useTranslation();       // عشان نعرف اللغة الحالية
  const API_URL        = import.meta.env.VITE_API_URL;

  // ── Helper: يستخرج النص الصح حسب اللغة ──────────────────────
  const getText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;          // داتا قديمة
    return field[i18n.language] || field.es || field.en || ''; // داتا جديدة
  };

  // ── جلب البيانات مع تمرير اللغة ─
  useEffect(() => {
    const fetchBakery = async () => {
      try {
        const response = await fetch(`${API_URL}/cakes?lang=${i18n.language}`); 
        const data = await response.json();

        console.log("Bakery Raw Response:", data);

        if (Array.isArray(data)) {
          // 1. فلترة البيانات عشان نجيب بس اللي كاتيجوري بتاعه 'bakery'
          const filteredBakery = data.filter(item => item.category === 'bakery');
          // 2. تحديث  State بالبيانات المفلترة
          setBakeryItems(filteredBakery);
        } else {
          console.error("Expected array but got:", data);
          setBakeryItems([]);
        }
      } catch (error) {
        console.error("Error fetching bakery items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBakery();
  }, [i18n.language]); // يعيد الجلب لما المستخدم يغير اللغة

  // ── handleAdd ─────────────────────────────────────────────────
  const handleAdd = (item) => {
    addToCart({
      id:    item._id,
      name:  getText(item.name),    // string دايماً مش object
      price: item.prices?.[0]?.price || 0,
      img:   item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${API_URL}${item.images[0]}`) : ""
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="animate-pulse text-pink-500 font-bold text-xl">
          {t('loading_bakery', 'Loading Bakery Delights... 🥐')}
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
            {t('bakery_title', 'Our Special Bakery')}
          </h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* التحقق من وجود بيانات */}
        {bakeryItems.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            {t('no_items_found', 'No bakery items found at the moment.')}
          </p>
        )}

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {bakeryItems.map((item) => (
            <div 
              key={item._id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 overflow-hidden"
            >
              {/* Image Container */}
              <Link 
                to={`/details/${item._id}`}
                state={{ product: item }}
                className="relative h-72 overflow-hidden block"
              >
                <img 
                  src={item.images && item.images[0] 
                    ? item.images[0].startsWith('http') 
                      ? item.images[0]
                      : `${API_URL}${item.images[0]}` 
                    : 'https://via.placeholder.com/500'} 
                  alt={getText(item.name)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              {/* Content Section */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {getText(item.name)}
                </h3>

                <p className="text-pink-600 font-bold text-lg mb-4">
                  {item.prices?.[0]?.price || 0} {t('currency', 'EGP')}
                </p>
                
                <button 
                  onClick={() => handleAdd(item)}
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