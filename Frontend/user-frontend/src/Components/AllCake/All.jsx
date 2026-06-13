import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AllProducts() {
  const [itemsFromDb, setItemsFromDb] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  // دالة استخراج النص المترجم حسب اللغة الحالية للعميل
  const getText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[i18n.language] || field.es || field.en || '';
  };

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        // نطلب كل المنتجات من الباك إند مع تمرير اللغة الحالية
        const response = await fetch(`${API_URL}/cakes?lang=${i18n.language}`); 
        console.log("Fetch Response Status:", response);
        // const data = await response.json(response );
        
        // // جلب البيانات بالكامل بدون عمل فلترة (filter) على كاتيجوري معين
        // setItemsFromDb(data);

        const data = await response.json();

console.log("AllProducts Response:", data);
console.log("Is Array:", Array.isArray(data));

if (Array.isArray(data)) {
  setItemsFromDb(data);
} else {
  console.error("Expected array but got:", data);
  setItemsFromDb([]);
}
      } catch (error) {
        console.error("Error fetching all items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, [i18n.language]);

  const handleAdd = (item) => {
    addToCart({
      id:    item._id,
      name:  getText(item.name),
      price: item.prices?.[0]?.price || 0,
      img:   item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${API_URL}${item.images[0]}`) : ""
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="animate-pulse text-pink-500 font-bold text-xl">
          {t('loading_all_items', 'Loading All Delights... ✨')}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* العنوان الرئيسي للمنيو الكامل */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('all_items_title', 'Our Full Menu')}
          </h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

     
        {itemsFromDb.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            {t('no_items_found', 'No items available right now.')}
          </p>
        )}

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {itemsFromDb.map((item) => (
            <div 
              key={item._id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 overflow-hidden"
            >
       
              <Link 
                to={`/details/${item._id}`}
                state={{ product: item }} 
                className="relative h-72 overflow-hidden block"
              >
                <img 
                  src={item.images && item.images[0] 
                    ? item.images[0].startsWith('http') 
                    ? item.images[0]
                    :`${API_URL}${item.images[0]}` 
                    : 'https://via.placeholder.com/500'} 
                  loading='lazy'
                  alt={getText(item.name)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* شارة صغيرة لعرض القسم الخاص بالمنتج تلقائياً فوق الصورة */}
                <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-pink-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
              </Link>

              {/* تفاصيل المنتج والسعر */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {getText(item.name)}
                </h3>
                
                <p className="text-pink-600 font-bold text-lg mb-4">
                   {item.prices?.[0]?.price || 0} {t('currency', '$')}
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