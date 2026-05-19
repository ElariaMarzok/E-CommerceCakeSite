import { useState, useEffect, useRef } from 'react'; 
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronUp, ChevronDown, Loader2 } from 'lucide-react'; 
import { useCart } from "../Context/CartContext";
import { useTranslation } from 'react-i18next';

const getText = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.en || field.es || '';
};

export default function DetailsPage() {
  const { id }       = useParams();
  const location     = useLocation();
  const navigate     = useNavigate();
  const { addToCart } = useCart();
  const { i18n, t }  = useTranslation();

  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedSize, setSelectedSize] = useState('Small');
  const [quantity, setQuantity]         = useState(1);
  const [activeImg, setActiveImg]       = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const thumbSliderRef = useRef(null); // Ref لسلايدر الصور المصغرة

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/cakes/${id}?lang=${i18n.language}`);
        const data     = await response.json();
        setProduct(data);
        setActiveImg(data.images?.[0] || "");
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, i18n.language]);

  const handleBack = () => navigate(-1);

  const getCurrentPriceData = () =>
    product?.prices?.find(p => p.size === selectedSize);

  const priceData    = getCurrentPriceData();
  const currentPrice = priceData ? priceData.price : null;

  const handleAdd = () => {
    if (!currentPrice) return;
    addToCart({
      id:       product._id,
      name:     getText(product.name, i18n.language),
      price:    currentPrice,
      quantity: quantity,
      size:     selectedSize,
      img:      activeImg ? `${API_URL}${activeImg}` : "",
    });
  };

  // 3. دالة تحريك السلايدر الخاص بالصور المصغرة (أفقي للموبايل وعمودي للكمبيوتر)
  const scrollThumbs = (direction) => {
    if (thumbSliderRef.current) {
      const scrollAmount = 120; // المسافة بالبكسل مع كل ضغطة
      
      if (window.innerWidth >= 1024) {
        // على الكمبيوتر (التحريك لأعلى وأسفل top)
        thumbSliderRef.current.scrollBy({
          top: direction === 'prev' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      } else {
        // على الموبايل (التحريك لليمين واليسار left)
        thumbSliderRef.current.scrollBy({
          left: direction === 'prev' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const displayDescription = getText(product?.description, i18n.language);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-pink-500">
        <Loader2 className="animate-spin" size={40} />
        <span className="ml-2 font-black">{t('details.loading_details')}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-bold">{t('details.product_not_found')}</p>
        <button onClick={handleBack} className="text-pink-500 underline">{t('details.go_back')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-10 font-bold transition-colors uppercase text-sm tracking-widest"
      >
        <ChevronLeft size={20} /> {t('details.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── LEFT SECTION: Gallery With Dual Slider ──────────────────────── */}
        <div className="lg:col-span-7 flex flex-col lg:flex-row gap-4 w-full items-center">
          
          {/* 1. الصورة الكبيرة الثابتة */}
          <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-gray-50 shadow-xl border-4 border-white order-1 lg:order-2 lg:flex-1">
            <img
              src={`${API_URL}${activeImg}`}
              alt={getText(product.name, i18n.language)}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* 2. حاوية السلايدر المصغر (الصور الجانبية) */}
          <div className="flex flex-row lg:flex-col items-center gap-2 order-2 lg:order-1 w-full lg:w-auto flex-shrink-0 relative">
            
            {/* زر السهم العلوي / الأيسر */}
            <button 
              onClick={() => scrollThumbs('prev')}
              className="p-1 rounded-full bg-pink-50 border border-pink-100 text-pink-500 shadow-sm hover:bg-pink-500 hover:text-white transition-all flex-shrink-0"
            >
              {/* يظهر سهم فوق للكمبيوتر وسهم شمال للموبايل */}
              <div className="hidden lg:block"><ChevronUp size={20} /></div>
              <div className="block lg:hidden"><ChevronLeft size={20} /></div>
            </button>

            {/* سلة الصور المصغرة (مع تحديد ارتفاع ثابت للكمبيوتر لتعمل كـ Slider عمودي) */}
            <div 
              ref={thumbSliderRef}
              className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2 lg:py-1 max-w-[calc(100%-70px)] lg:max-w-none lg:h-[480px] scroll-smooth"
            >
              {(product.images || []).map((imgUrl, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveImg(imgUrl)}
                  onClick={() => setActiveImg(imgUrl)} 
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                    activeImg === imgUrl
                      ? 'border-pink-500 ring-4 ring-pink-50'
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <img src={`${API_URL}${imgUrl}`} className="w-full h-full object-cover" alt="thumbnail" />
                </div>
              ))}
            </div>

            {/* زر السهم السفلي / الأيمن */}
            <button 
              onClick={() => scrollThumbs('next')}
              className="p-1 rounded-full bg-pink-50 border border-pink-100 text-pink-500 shadow-sm hover:bg-pink-500 hover:text-white transition-all flex-shrink-0"
            >
              {/* يظهر سهم تحت للكمبيوتر وسهم يمين للموبايل */}
              <div className="hidden lg:block"><ChevronDown size={20} /></div>
              <div className="block lg:hidden"><ChevronLeft size={20} className="rotate-180" /></div>
            </button>

          </div>

        </div>

        {/* ── RIGHT SECTION: Details ─────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col py-4 w-full">

          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 leading-tight">
            {getText(product.name, i18n.language)}
          </h1>

          <p className="text-gray-400 font-bold mb-6 italic tracking-tight uppercase text-xs">
            {t('details.category')} {product.category || t('details.premium_collection')}
          </p>

          <p className="text-gray-500 leading-relaxed mb-10 font-medium">
            {displayDescription ? (
              displayDescription
            ) : (
              <span className="text-gray-300 italic text-sm">{t('details.no_description')}</span>
            )}
          </p>

          {/* Size Selector */}
          <div className="mb-10">
            <h4 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">{t('details.select_size')}</h4>
            <div className="flex gap-3">
              {['Small', 'Medium', 'Large'].map((size) => {
                const isAvailable = product?.prices?.some(p => p.size === size);
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 relative ${
                      !isAvailable ? 'opacity-30 cursor-not-allowed bg-gray-100' :
                      selectedSize === size
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    {size}
                    {!isAvailable && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-red-500 text-white px-1 rounded">
                        N/A
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 mb-10 flex flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase mb-1">{t('details.total_amount')}</p>
              {currentPrice ? (
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-pink-600 tracking-tighter whitespace-nowrap">
                  {t('currency')} {currentPrice * quantity}
                </h2>
              ) : (
                <h2 className="text-xl font-black text-red-400">{t('details.price_not_available')}</h2>
              )}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 bg-white px-3 sm:px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
              <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="text-pink-500 hover:scale-110 transition-transform">
                <Minus size={18} />
              </button>
              <span className="font-black text-lg sm:text-xl w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-pink-500 hover:scale-110 transition-transform">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-4">
            <button
              disabled={!currentPrice}
              onClick={handleAdd}
              className={`flex-1 font-black py-5 sm:py-6 rounded-[2rem] transition-all shadow-xl flex items-center justify-center gap-3 text-lg ${
                currentPrice
                  ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-100'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingCart size={24} />
              {currentPrice ? t('add_to_cart') : t('details.out_of_stock')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}