import { useState } from 'react'; 
import { ShoppingBag, Trash2, Send, User, Phone, MapPin } from 'lucide-react';
import { useCart } from "../Context/CartContext";
import { useTranslation } from 'react-i18next';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalQuantity, clearCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const itemSubtotal = cart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  // 1. إنشاء State لتخزين بيانات المستخدم (مع إضافة الرقم الاحتياطي)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    backupPhone: '', 
    address: '',
    notes: ''
  });

  const validateForm = () => {
    let newErrors = {};

    // التحقق من الاسم (على الأقل 3 حروف)
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t('cart.error_name');
    }

    // التحقق من الرقم الأساسي
    const flexiblePhoneRegex = /^[0-9\-\(\)\/\+\s]{7,15}$/;
    if (!flexiblePhoneRegex.test(formData.phone)) {
      newErrors.phone = t('cart.error_phone');
    }

    // التحقق من الرقم الاحتياطي 
    if (formData.backupPhone.trim() !== '' && !flexiblePhoneRegex.test(formData.backupPhone)) {
      newErrors.backupPhone = t('cart.error_backup_phone', 'Invalid backup phone number');
    }

    // التحقق من العنوان
    if (formData.address.trim().length < 5) {
      newErrors.address = t('cart.error_address');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ترجع true لو مفيش أخطاء
  };

  // دالة لتحديث الـ State عند الكتابة
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      const flexiblePhoneRegex = /^[0-9\-\(\)\/\+\s]{7,15}$/;
      let fieldError = '';

      if (name === 'fullName') {
        if (value.trim().length < 3) {
          fieldError = t('cart.error_name');
        }
      }

      if (name === 'phone') {
        if (!flexiblePhoneRegex.test(value)) {
          fieldError = t('cart.error_phone');
        }
      }

      if (name === 'backupPhone') {
        if (value.trim() !== '' && !flexiblePhoneRegex.test(value)) {
          fieldError = t('cart.error_backup_phone', 'Invalid backup phone number');
        }
      }

      if (name === 'address') {
        if (value.trim().length < 5) {
          fieldError = t('cart.error_address');
        }
      }

      if (fieldError) {
        updatedErrors[name] = fieldError;
      } else {
        delete updatedErrors[name];
      }

      return updatedErrors;
    });
  };

  // التحقق من صحة البيانات لفتح زر الإرسال
  const isFormValid = 
    formData.fullName.trim() !== '' && 
    formData.phone.trim() !== '' && 
    formData.address.trim() !== '' &&
    cart.length > 0;

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    
    // التأكد من صحة البيانات
    if (!validateForm()) {
      return; // توقف هنا لو فيه أخطاء
    }

    const orderData = {
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        backupPhone: formData.backupPhone || "",
        address: formData.address,
        notes: formData.notes || ""
      },
      items: cart.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        size: item.size || "Standard"
      })),
      totalAmount: Number(itemSubtotal)
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();

      if (response.ok) {
        alert(t('cart.success_msg'));
        setFormData({ fullName: '', phone: '', backupPhone: '', address: '', notes: '' });
        clearCart(); 
      } else {
        alert(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to server. Check if backend is running!");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
          <ShoppingBag className="text-pink-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">{t('cart.title')} ({totalQuantity})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.img || 'https://via.placeholder.com/120'} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-pink-50" />
                    <div>
                      <h3 className="font-semibold text-gray-700">{item.name}</h3>
                      <p className="text-pink-600 font-bold">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3 bg-pink-50/50 w-fit p-1 rounded-xl border border-pink-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-pink-600 shadow-sm hover:bg-pink-600 hover:text-white transition-all active:scale-90"
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-700 text-sm min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-pink-600 shadow-sm hover:bg-pink-600 hover:text-white transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{t('cart.subtotal')}</p>
                      <p className="font-bold text-gray-800">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-pink-200 text-center">
                <p className="text-gray-400 text-lg">{t('cart.empty')}</p>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary & Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">{t('cart.contact_info')}</h2>
            
            <form className="space-y-4" onSubmit={handleCompleteOrder}>
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User size={16} className="text-pink-400" /> {t('cart.full_name')}
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder={t('cart.placeholder_name')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none bg-gray-50 focus:ring-2 focus:ring-pink-100 transition-all" 
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone size={16} className="text-pink-400" /> {t('cart.phone_number')}
                </label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder={t('cart.error_phone', '+34 612 345 678...')} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none bg-gray-50 focus:ring-2 focus:ring-pink-100 transition-all" 
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
              </div>

              {/* Backup Phone Input ── الحقل الجديد */}
              <div className="space-y-1">
  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
    <Phone size={16} className="text-pink-300" /> {t('cart.cart.backup_phone')}
  </label>
  <input 
    type="text" 
    name="backupPhone"
    value={formData.backupPhone}
    onChange={handleChange}
    placeholder={t('cart.placeholder_backup_phone', '+34 612 345 678...')} 
    className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none bg-gray-50 focus:ring-2 focus:ring-pink-100 transition-all" 
  />
  {errors.backupPhone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.backupPhone}</p>}
</div> 

              {/* Address Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin size={16} className="text-pink-400" /> {t('cart.address')}
                </label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder={t('cart.placeholder_address')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none bg-gray-50 focus:ring-2 focus:ring-pink-100 transition-all" 
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address}</p>}
              </div>

              {/* Special Notes Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span className="text-pink-400">📝</span> {t('cart.special_notes')}
                </label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={t('cart.notes_placeholder')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none bg-gray-50 focus:ring-2 focus:ring-pink-100 transition-all resize-none min-h-[100px]"
                />
              </div>

              {/* Price & Submit Section */}
              <div className="pt-4 border-t border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 font-medium">{t('cart.items_count', 'Items')} ({totalQuantity})</span>
                  <span className="text-gray-500 font-medium">${itemSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">{t('cart.delivery_fee')}</span>
                  <span className="text-gray-500 font-medium">$80.00</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">{t('cart.total_amount')}</span>
                  <span className="text-2xl font-black text-pink-600">${totalPrice.toFixed(2)}</span>
                </div>
                
                <button 
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-bold py-4 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <Send size={18} />{t('cart.complete_order')}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}