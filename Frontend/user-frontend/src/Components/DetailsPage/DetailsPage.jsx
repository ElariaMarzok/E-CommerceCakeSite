import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Heart, ChevronLeft, Loader2 } from 'lucide-react';
import { useCart } from "../Context/CartContext";

export default function DetailsPage() {
  const { id } = useParams(); // الحصول على الـ ID من الرابط
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 1. تعريف حالات البيانات
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product); // إذا لم تكن البيانات موجودة في الـ state، اجعلها في وضع التحميل
  const [selectedSize, setSelectedSize] = useState('Small');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // تعريف الرابط في ملف .env



  // 2. جلب بيانات المنتج ديناميكياً عند تحميل الصفحة أو تغيير الـ id
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // نفس مسار الباك اند 
        const response = await fetch(`${API_URL}/cakes/${id}`); 
        const data = await response.json();
        
        setProduct(data);
        setActiveImg(data.images?.[0] || ""); // تعيين الصورة الأولى كصورة نشطة
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

      const handleAddCart = (product) => {
    // تنسيق البيانات لتناسب السلة
    const productToCart = {
      id: product._id,
      name: product.name,
      price: product.prices?.[0]?.price || 0,
      img: product.images?.[0] || ""
    };
    addToCart(productToCart);
  };

    // لا تجلب البيانات إذا كانت موجودة بالفعل وتم تمريرها عبر الـ state (اختياري لسرعة الأداء)
    if (!product) {
      fetchProductDetails();
    } else if (product && !activeImg) {
        // إذا جاءت البيانات من الـ state، نحتاج فقط لتعيين الصورة النشطة
        setActiveImg(product.images?.[0] || product.img || "");
    }
  }, [id, API_URL]);


  

  const handleBack = () => navigate(-1);

// 1. تحديد السعر بناءً على المقاس المختار من الداتا بيز
  const getCurrentPriceData = () => {
    // نبحث في مصفوفة الأسعار القادمة من الباك إند عن المقاس المختار
    return product?.prices?.find(p => p.size === selectedSize);
  };

  const priceData = getCurrentPriceData();
  const currentPrice = priceData ? priceData.price : null;

  const handleAdd = () => {
    if (!currentPrice) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      size: selectedSize,
      img: activeImg
    });
  };

  // واجهة التحميل
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-pink-500">
        <Loader2 className="animate-spin" size={40} />
        <span className="ml-2 font-black">Loading Delicious Details...</span>
      </div>
    );
  }

  // واجهة الخطأ
  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-bold">Product not found.</p>
        <button onClick={handleBack} className="text-pink-500 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={handleBack} 
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-10 font-bold transition-colors uppercase text-sm tracking-widest"
      >
        <ChevronLeft size={20} /> Back to previous page
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT SIDE: Vertical Gallery */}
        <div className="lg:col-span-7 flex flex-row gap-4 h-[500px] md:h-[600px]">
          <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pr-2">
            {/* استخدام مصفوفة الصور القادمة من الباك إند */}
            {(product.images || [product.img]).map((imgUrl, i) => (
              <div 
                key={i} 
                onMouseEnter={() => setActiveImg(imgUrl)}
                className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                  activeImg === imgUrl ? 'border-pink-500 ring-4 ring-pink-50' : 'border-gray-100 hover:border-pink-200'
                }`}
              >
                <img src={`${API_URL}${imgUrl}`} className="w-full h-full object-cover" alt="thumb" />
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl border-4 border-white h-full">
            <img 
               src={`${API_URL}${activeImg}`} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          </div>
        </div>

        {/* RIGHT SIDE: Details */}
        <div className="lg:col-span-5 flex flex-col py-4">
          <h1 className="text-5xl font-black text-gray-800 mb-2 leading-tight">{product.name}</h1>
          <p className="text-gray-400 font-bold mb-6 italic tracking-tight uppercase text-xs">Category: {product.category || 'Premium Collection'}</p>
          
          <p className="text-gray-500 leading-relaxed mb-10 font-medium">
             {product.description || `Handcrafted to perfection, our ${product.name} features the finest ingredients...`}
          </p>

          {/* Size Selector */}
        <div className="mb-10">
          <h4 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Select Size</h4>
          <div className="flex gap-3">
            {['Small', 'Medium', 'Large'].map((size) => {
              // التحقق هل المقاس ده موجود له سعر في الداتا بيز؟
              const isAvailable = product?.prices?.some(p => p.size === size);
              
              return (
                <button
                  key={size}
                  disabled={!isAvailable} // تعطيل الزرار لو المقاس مش موجود له سعر
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 relative ${
                    !isAvailable ? 'opacity-30 cursor-not-allowed bg-gray-100' :
                    selectedSize === size 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200'
                  }`}
                >
                  {size}
                  {!isAvailable && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-red-500 text-white px-1 rounded">N/A</span>}
                </button>
              );
            })}
          </div>
        </div>

          {/* Price & Quantity Section */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-10 flex items-center justify-between">
            <div>
            <p className="text-gray-400 font-bold text-xs uppercase mb-1">Total Amount</p>
            {currentPrice ? (
              <h2 className="text-5xl font-black text-pink-600 tracking-tighter">
                EGP {currentPrice * quantity}
              </h2>
            ) : (
              <h2 className="text-xl font-black text-red-400">Price Not Available</h2>
            )}
          </div>
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="text-pink-500 hover:scale-110 transition-transform"><Minus size={18}/></button>
              <span className="font-black text-xl w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-pink-500 hover:scale-110 transition-transform"><Plus size={18}/></button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
            disabled={!currentPrice} //  تعطيل زر الإضافة للسلة تماماً
             onClick={handleAdd}
            className={`flex-1 font-black py-6 rounded-[2rem] transition-all shadow-xl flex items-center justify-center gap-3 text-lg ${
              currentPrice 
              ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-100' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <ShoppingCart size={24} /> 
            {currentPrice ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}