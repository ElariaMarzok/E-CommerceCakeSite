
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';

export default function Bakery() {
  // 1. تعريف الحالة لتخزين بيانات المخبوزات
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const vite_env = import.meta.env.VITE_API_URL

  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  // 2. جلب البيانات من السيرفر
  useEffect(() => {
    const fetchBakery = async () => {
      try {
        const response = await fetch(`${API_URL}/cakes?category=bakery`); // تأكدي من صحة البورت
        const data = await response.json();

        
        // 3. فلترة البيانات لعرض الكاتيجوري 'bakery' فقط
        const filteredBakery = data.filter(item => item.category === 'bakery');
        
        setBakeryItems(filteredBakery);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bakery items:", error);
        setLoading(false);
      }
    };

    fetchBakery();
  }, []);

  const handleAdd = (item) => {
    // تجهيز المنتج لإضافته للسلة
    const productToCart = {
      id: item._id,
      name: item.name,
      price: item.prices?.[0]?.price || 0,
      img: vite_env+item.images?.[0] || ""
    };
    addToCart(productToCart);
  };

  // واجهة التحميل
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="animate-pulse text-pink-500 font-bold text-xl">Loading Bakery Delights... 🥐</div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Special Bakery</h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* التحقق من وجود بيانات */}
        {bakeryItems.length === 0 && (
          <p className="text-center text-gray-400 py-10">No bakery items found at the moment.</p>
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
                  src={`${API_URL}${item.images?.[0] || ''}`} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              {/* Content Section */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-pink-600 font-bold text-lg mb-4">
                  {item.prices?.[0]?.price || 0} EGP
                </p>
                
                <button 
                  onClick={() => handleAdd(item)}
                  className="flex items-center justify-center gap-2 w-full bg-pink-50 text-pink-600 font-semibold py-3 rounded-2xl hover:bg-pink-600 hover:text-white transition-all"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}