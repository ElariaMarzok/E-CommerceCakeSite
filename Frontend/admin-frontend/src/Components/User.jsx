import { useState, useEffect } from 'react';
import { Users as UsersIcon, Mail, User, Trash2, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Users() {
  const { t } = useTranslation();
  const [uniqueCustomers, setUniqueCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrdersAndFilterUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        const orders = await response.json();

        // بجيب الرقم مره واحده
        // عشان بيتخزن ك رقم  uniqe  ومش هتكرر الفون ف العرض
        const customersMap = new Map();

        orders.forEach(order => {
          const phone = order.customer.phone;
          // إذا لم يكن الهاتف موجوداً مسبقاً، أضف العميل
          if (!customersMap.has(phone)) {
            customersMap.set(phone, {
              fullName: order.customer.fullName,
              phone: order.customer.phone,
              address: order.customer.address,
              lastOrderDate: order.createdAt,
              orderCounئt: 1
            });
          } else {
            // لو موجود، يمكننا زيادة عداد طلباته
            const existing = customersMap.get(phone);
            existing.orderCount += 1;
          }
        });

        // تحويل الـ Map إلى مصفوفة لعرضها
        setUniqueCustomers(Array.from(customersMap.values()));
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndFilterUsers();
  }, [API_URL]);

  const totalUniqueUsers = uniqueCustomers.length;

  if (loading) return <div className="p-8 text-center text-pink-500 font-bold">Loading Customers...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Stats Widget */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <UsersIcon className="text-pink-500" /> {t('users.stat_card')}
            </h1>
            <p className="text-gray-400 font-medium text-sm">{t('users.subtitle')}</p>
          </div>

          <div className="bg-white px-8 py-4 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-pink-200 transition-all">
            <div className="bg-pink-50 p-3 rounded-2xl text-pink-500 group-hover:rotate-12 transition-transform">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('users.stat_card')}</p>
              <h3 className="text-2xl font-black text-gray-800">{totalUniqueUsers}</h3>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">{t('users.table_name')}</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">{t('users.table_phone')}</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">{t('users.table_location')}</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase text-center">{t('users.table_orders')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {uniqueCustomers.map((customer, index) => (
                <tr key={index} className="hover:bg-pink-50/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold uppercase">
                        {/* //اول حرف من الاسم logo  */}
                        {customer.fullName.charAt(0)}
                      </div>
                      <p className="font-black text-gray-800">{customer.fullName}</p>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-300" />
                      <a href={`https://wa.me/${customer?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" >
                        
                        {customer.phone} 
                       </a>
                        
                    </div>
                  </td>

                  <td className="px-8 py-5 text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-300" />
                      {customer.address}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-black">
                      {t('users.orders_count', { count: customer.orderCount })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}