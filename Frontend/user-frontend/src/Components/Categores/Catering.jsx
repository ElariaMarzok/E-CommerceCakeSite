import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Catering() {
  const [cateringItems, setCateringItems] = useState([]);
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
    const fetchCatering = async () => {
      try {
        // بنبعت ?lang= عشان الباك إند يرجع النص المترجم جاهز
        const response = await fetch(`${API_URL}/cakes?lang=${i18n.language}`);
        const data = await response.json();
        
        const filteredCatering = data.filter(item => item.category === 'catering');
        setCateringItems(filteredCatering);
      } catch (error) {
        console.error("Error fetching catering items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatering();
  }, [i18n.language]); // يعيد الجلب لما المستخدم يغير اللغة

  // ── handleAdd ─────────────────────────────────────────────────
  const handleAdd = (item) => {
    addToCart({
      id:    item._id,
      name:  getText(item.name),    // string دايماً مش object
      price: item.prices?.[0]?.price || 0,
      img:   item.images?.[0] ? `${API_URL}${item.images[0]}` : "" // تأمين دمج رابط الباك إند مع مسار الصورة
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="animate-pulse text-pink-500 font-bold text-xl">
          {t('loading_catering', 'Loading Catering Services... ✨')}
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
            {t('catering_title', 'Our Special Catering')}
          </h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* التحقق من وجود بيانات */}
        {cateringItems.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            {t('no_catering_found', 'No catering items available at the moment.')}
          </p>
        )}

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cateringItems.map((item) => (
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
                  src={`${API_URL}${item.images?.[0] || ''}`}
                  alt={getText(item.name)} // string مش object
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              {/* Content Section */}
              <div className="p-6 text-center">
                {/* getText بدل item.name مباشرة */}
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