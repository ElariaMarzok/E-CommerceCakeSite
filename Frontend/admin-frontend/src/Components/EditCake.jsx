import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── الدالة المساعدة الذكية المحسّنة لاستخراج النصوص ──────────────────
const getText = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field; // لو النص عادي يرجع فوراً
  
  // لو النص عبارة عن Object (نظام الترجمات)
  if (typeof field === 'object') {
    if (field[lang]) return field[lang];
    if (field.en) return field.en;
    if (field.es) return field.es;
    if (field.ar) return field.ar;
    
    // حل احتياطي: لو مفيش أي لغة متطابقة، هات أول قيمة موجودة جوه الـ Object
    const keys = Object.keys(field);
    if (keys.length > 0) return field[keys[0]];
  }
  return '';
};

export default function EditCake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [productName, setProductName]               = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory]       = useState('bakery');
  const [images, setImages]                         = useState([]);
  const [selectedSizes, setSelectedSizes]           = useState({});

  const BACKEND_URL   = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const categories    = ['bakery', 'cakes', 'catering', 'sweets', 'boxes'];
  const availableSizes = ['Small', 'Medium', 'Large'];

  useEffect(() => {
    // جلب البيانات مع إرسال اللغة الحالية للمتصفح
    fetch(`${BACKEND_URL}/cakes/${id}?lang=${i18n.language}`)
      .then(res => res.json())
      .then(data => {
        console.log("البيانات القادمة من السيرفر:", data); // للـ Debugging في الـ Console

        // استخدام الدالة المحسّنة لضمان رجوع الاسم والوصف في الـ Inputs
        setProductName(getText(data.name, i18n.language));
        
        // هنا قمنا بالتأمين بحيث لو الحقل اسمه description أو desc يقرأه صح
        const descData = data.description || data.desc;
        setProductDescription(getText(descData, i18n.language));
        
        setProductCategory(data.category || 'bakery');

        if (Array.isArray(data.images)) {
          setImages(data.images.map(src => ({ src, isNew: false })));
        } else if (data.image) {
          setImages([{ src: data.image, isNew: false }]);
        } else {
          setImages([]);
        }

        const sizesObj = {};
        if (data.prices) {
          data.prices.forEach(p => { sizesObj[p.size] = p.price; });
        }
        setSelectedSizes(sizesObj);
      })
      .catch(err => {
        console.error("Error fetching cake data:", err);
        alert("Could not load cake data. Check if Backend is running!");
        navigate('/');
      });
  }, [id, i18n.language]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      src: URL.createObjectURL(file),
      file,
      isNew: true,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const deleteImage = (indexToDelete) => {
    setImages(prev => {
      const removed = prev[indexToDelete];
      if (removed?.isNew && removed?.src) URL.revokeObjectURL(removed.src);
      return prev.filter((_, index) => index !== indexToDelete);
    });
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      if (newSizes[size] !== undefined) delete newSizes[size];
      else newSizes[size] = "";
      return newSizes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || images.length === 0) {
      alert("Please keep at least one image! 🍰");
      return;
    }

    // تنظيف مسارات الصور القديمة لمنع تكرار رابط السيرفر الكامل
    const existingImages = images
      .filter(img => !img.isNew)
      .map(img => {
        if (img.src.startsWith('http')) {
          return img.src.replace(BACKEND_URL, '');
        }
        return img.src;
      });

    const newFiles    = images.filter(img => img.isNew).map(img => img.file);
    const pricesArray = Object.keys(selectedSizes).map(size => ({
      size,
      price: parseFloat(selectedSizes[size]) || 0,
    }));

    try {
      // توحيد الإرسال دائمًا عبر FormData لحل مشكلة اختفاء الصور في الباك إند
      const formData = new FormData();
      
      // إرسال الحقول بكافة الصيغ المتوقعة (العادية والمترجمة) لضمان استقبال السيرفر لها
      formData.append('name',           productName);
      formData.append('name_es',        productName);
      formData.append('description',    productDescription);
      formData.append('description_es', productDescription);
      formData.append('category',       productCategory);
      formData.append('prices',         JSON.stringify(pricesArray));
      
      // إرسال مصفوفة الصور القديمة المتبقية
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('images',         JSON.stringify(existingImages));

      // إضافة ملفات الصور الجديدة إن وجدت
      if (newFiles.length > 0) {
        newFiles.forEach(file => formData.append('images', file));
      }

      const response = await fetch(`${BACKEND_URL}/cakes/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Masterpiece updated successfully!");
        navigate('/');
      } else {
        alert("Error updating cake: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to server. Check if Backend is running!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-[2.5rem] shadow-2xl my-10 font-sans border border-pink-50">

      <div className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-pink-50 rounded-full transition-colors text-pink-400">
          <ChevronLeft size={30} />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest">Edit Product</h2>
          <p className="text-[10px] text-pink-400 font-bold mt-1">UPDATE YOUR SWEET MASTERPIECE</p>
        </div>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">

        {/* Gallery */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">
            Product Gallery ({images.length})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 bg-pink-50/20 rounded-[2rem] border border-pink-100">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border-2 border-white">
                <img
                  src={
                    img.isNew 
                      ? img.src 
                      : (img.src.startsWith('http') ? img.src : `${BACKEND_URL}${img.src}`)
                  }
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  alt="Cake"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(index)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-md"
                >
                  <Trash2 size={16} />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-pink-500 text-[7px] text-white px-2 py-1 rounded-md font-black uppercase tracking-tighter shadow-sm">
                    Main Photo
                  </div>
                )}
              </div>
            ))}
            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer hover:bg-white hover:border-pink-400 transition-all text-pink-300">
              <Plus size={32} strokeWidth={3} />
              <span className="text-[9px] font-black mt-2 uppercase">Add More</span>
              <input type="file" multiple onChange={handleImageUpload} accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Product Name</label>
            <input
              type="text"
              value={productName || ""}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-pink-100 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description</label>
            <textarea
              value={productDescription || ""}
              onChange={(e) => setProductDescription(e.target.value)}
              rows="4"
              className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-pink-100 transition-all resize-none"
              placeholder="Enter cake description..."
            />
          </div>

          <div className="space-y-3 relative">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Category</label>
            <div className="relative">
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all shadow-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="font-bold text-gray-700">
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-pink-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50/50 p-8 rounded-[2rem]">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">
            Sizes & Pricing
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSizes.map((size) => (
              <div
                key={size}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedSizes[size] !== undefined
                    ? 'bg-white border-pink-200'
                    : 'border-dashed border-gray-200 opacity-40'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={selectedSizes[size] !== undefined} onChange={() => handleSizeToggle(size)} className="hidden" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedSizes[size] !== undefined ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                    {selectedSizes[size] !== undefined && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="font-bold text-gray-600 text-[11px] uppercase">{size}</span>
                </label>
                {selectedSizes[size] !== undefined && (
                  <input
                    type="number"
                    value={selectedSizes[size]}
                    onChange={(e) => setSelectedSizes({ ...selectedSizes, [size]: e.target.value })}
                    className="w-16 bg-transparent border-b-2 border-pink-100 text-center font-black text-pink-500 outline-none p-1 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-6 rounded-2xl shadow-xl shadow-pink-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <Save size={20} />
          Save Changes
        </button>
      </form>
    </div>
  );
}