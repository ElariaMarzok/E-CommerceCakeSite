

import { useState, useEffect } from 'react'; 
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { Link } from 'react-router-dom';

export default function Cakes() {
  // 1. علشان اخزن البيانات الي جايه من الداتا بيز 
  const [cakesFromDb, setCakesFromDb] = useState([]);
  const [loading, setLoading] = useState(true); // حالة لتحميل البيانات

  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  // 2. عمل Connect مع الباك إند وجلب البيانات
  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await fetch(`${API_URL}/cakes`); // رابط السيرفر
        const data = await response.json();
        setCakesFromDb(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cakes:", error);
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  // 3. علشان افلتر ال cakes بس 
  const filteredCakes = cakesFromDb.filter(item => item.category === 'cakes');

  const handleAdd = (cake) => {
    const cakeToCart = {
      id: cake._id,
      name: cake.name,
      price: cake.prices?.[0]?.price || 0,
      img: cake.images?.[0] || ""
    };
    addToCart(cakeToCart);
  };

  // إذا كانت البيانات لسه بتتحمل
  if (loading) return <div className="text-center py-20 font-bold text-pink-500">Loading Masterpieces... 🍰</div>;

  return (
    <div className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Special Cakes</h1>
          <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* إذا كان القسم فارغاً */}
        {filteredCakes.length === 0 && (
          <p className="text-center text-gray-400">No cakes found in this category yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCakes.map((cake) => (
            <div 
              key={cake._id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 overflow-hidden"
            >
              <Link 
                to={`/details/${cake._id}`}
                state={{ product: cake }} 
                className="relative h-72 overflow-hidden block"
              >
                {/* عرض أول صورة من الداتا بيز */}
                <img 
                  src={`${API_URL}${cake.images && cake.images[0] ? cake.images[0] : 'https://via.placeholder.com/500'}`} 
                  loading='lazy'
                  alt={cake.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{cake.name}</h3>
                
                {/* عرض سعر أول حجم */}
                <p className="text-pink-600 font-bold text-lg mb-4">
                   {cake.prices?.[0]?.price || 0} EGP
                </p>
                
                <button 
                  onClick={() => handleAdd(cake)}
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