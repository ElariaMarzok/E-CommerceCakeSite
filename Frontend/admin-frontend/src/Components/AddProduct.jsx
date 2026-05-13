import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, CloudUpload, X, Image as ImageIcon } from 'lucide-react'; 
import { useEffect } from 'react'; 



export default function AddProduct({ cakes, setCakes }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // المصفوفة التي ستخزن الصور كملفات مع معاينة كل صورة
  const [imagesData, setImagesData] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [description, setDescription] = useState(''); 


  // تنظيف الذاكرة من Object URLs عند إلغاء تحميل المكون أو تحديث الصور
useEffect(() => {
  // هذه الدالة تعمل فقط عندما يتم إغلاق أو مغادرة الصفحة (Unmount)
  return () => {
    imagesData.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
        console.log("Memory Cleaned: ObjectURL revoked");
      }
    });
  };
}, [imagesData]); // سيراقب التغييرات وينظف عند الحاجة

  // language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };


  
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      if (newSizes[size] !== undefined) delete newSizes[size];
      else newSizes[size] = "";
      return newSizes;
    });
  };

  const handlePriceChange = (size, price) => {
    setSelectedSizes(prev => ({ ...prev, [size]: price }));
  };

  // --- دالة معالجة رفع عدة صور كملفات وتخزين معاينة لكل صورة ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesData(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
    ]);
  };

  // دالة لحذف صورة من المعاينة قبل الحفظ
  const removeImage = (indexToRemove) => {
    setImagesData(prev => {
      const removed = prev[indexToRemove];
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };


  // دالة معالجة إرسال النموذج مع البيانات الجديدة للمنتج
  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('productName');
    const category = formData.get('productCategory');
    const description = formData.get('description');

  //  التحقق من صحة البيانات قبل الإرسال
    if (!name || imagesData.length === 0) {
      alert("Please enter a name and upload at least one image! 🍰");
      return;
    }

    const sizeKeys = Object.keys(selectedSizes);
    if (sizeKeys.length === 0 || sizeKeys.some(s => selectedSizes[s] === "")) {
      alert("Please select sizes and enter all prices! ");
      return;
    }
    //  تجهيز كائن البيانات (Data Object) بنفس الأسماء اللي الباك إند مستنيها
    const cakeData = {
      name: name,
      category: category,
      prices: sizeKeys.map(size => ({
        size: size,
        price: parseFloat(selectedSizes[size])
      })),
    };

    try {
      // 3. إرسال البيانات للباك إند
      const multipartData = new FormData();
    multipartData.append('name', name);
    multipartData.append('description', description || '');
    multipartData.append('category', category);
    multipartData.append('prices', JSON.stringify(cakeData.prices));
    imagesData.forEach(image => {
      multipartData.append('images', image.file);
    });

    const response = await fetch('http://localhost:4000/cakes', {
      method: 'POST',
      body: multipartData
    });

      const result = await response.json();

      if (response.ok) {
        // تنظيف الذاكرة من Object URLs بعد الحفظ الناجح
          imagesData.forEach(img => URL.revokeObjectURL(img.preview));
        // 4. تحديث الـ State في الفرونت إند بعد التأكد من نجاح الحفظ في الباك
        setCakes([...cakes, result]); 
        alert("Product added successfully! ✨");
        navigate('/');
      } else {
        // هندلة الأخطاء اللي جايه من express-validator
        console.error("Server Error:", result.errors);
        alert("Failed to save product. Check console for details.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to server. Make sure your Backend is running!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-pink-50 max-w-2xl mx-auto my-10 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
          <span className="bg-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-pink-200">
            <Plus size={24} />
          </span>
          {t('form_title')}
        </h2>
       
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t('product_name')}</label>
          <input type="text" name="productName" placeholder={t('placeholder_name')} className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-pink-100 rounded-3xl outline-none font-bold text-gray-700 transition-all" />
        </div>

       {/* Description */}
<div className="space-y-2">
  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">
    Description
  </label>
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Enter cake description..."
    rows="4"
    className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-pink-100 rounded-3xl outline-none font-bold text-gray-700 transition-all resize-none"
  />
</div>

        {/* Sizes & Prices */}
        <div className="bg-pink-50/20 p-6 rounded-4xl border border-pink-50">
          <label className="block text-xs font-black text-pink-400 uppercase tracking-widest mb-6 text-center">{t('select_sizes_and_prices')}</label>
          <div className="grid grid-cols-1 gap-3">
            {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
              <div key={size} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedSizes[size] !== undefined ? 'bg-white border-pink-200 shadow-sm' : 'border-dashed border-gray-100 opacity-60'}`}>
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input type="checkbox" checked={selectedSizes[size] !== undefined} onChange={() => handleSizeToggle(size)} className="w-5 h-5 accent-pink-500 rounded-lg" />
                  <span className="text-gray-700 font-bold text-sm">{size}</span>
                </label>

                {selectedSizes[size] !== undefined && (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={selectedSizes[size]}
                      onChange={(e) => handlePriceChange(size, e.target.value)}
                      className="w-20 bg-pink-50 border-b-2 border-pink-200 text-center font-black text-pink-600 outline-none p-1"
                    />
                    <span className="text-[10px] font-black text-pink-400">EGP</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Dropdown (Styled) */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{t('category')}</label>
          <div className="relative">
            <select name="productCategory" className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-pink-100 rounded-3xl outline-none font-bold text-gray-700 appearance-none cursor-pointer">
              <option value="bakery">BAKERY</option>
              <option value="cakes">CAKES</option>
              <option value="sweets">SWEETS</option>
              <option value="catering">CATERING</option>
              <option value="boxes">BOXES</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
              <Plus size={20} className="rotate-45" />
            </div>
          </div>
        </div>

        {/* Multiple Image Upload & Gallery Preview */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Product Gallery</label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
            {imagesData.map((image, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
                <img src={image.preview} className="w-full h-full object-cover" alt="preview" />
                <button 
                  type="button" 
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {/* مربع إضافة صور جديدة */}
            <label className="aspect-square flex flex-col items-center justify-center bg-white rounded-2xl cursor-pointer hover:bg-pink-50 transition-all border-2 border-pink-100 text-pink-300">
              <CloudUpload size={30} />
              <span className="text-[8px] font-black uppercase mt-1">Add Photo</span>
              <input type="file" multiple onChange={handleImageChange} accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black py-6 rounded-[2rem] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
          <CloudUpload size={20} />
          {t('save_btn')}
        </button>
      </form>
    </div>
  );
}