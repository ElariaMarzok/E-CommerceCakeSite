import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, Package, MessageCircle, Calendar, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function Order() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // لمعرفة أي طلب يتم تحديثه حالياً

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // الدالة المُحدثة لإرسال التغيير للسيرفر
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    
    try {
      setUpdatingId(id);
      const response = await fetch(`http://localhost:4000/orders/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // تحديث القائمة الرئيسية
        setOrders(prev => prev.map(order => 
          order._id === id ? { ...order, status: newStatus } : order
        ));
        
        // تحديث الطلب المختار داخل الـ Modal إذا كان مفتوحاً
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getTopSellingProduct = () => {
    if (orders.length === 0) return "No data";
    const counts = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.name || "Unknown Cake";
        counts[name] = (counts[name] || 0) + item.quantity;
      });
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "N/A");
  };

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(order => order.status === 'Pending').length;
  const topSelling = getTopSellingProduct();

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  if (loading) return <div className="p-8 text-center font-black text-pink-500 animate-pulse">{t('orders.loading')}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-500"><Package size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.revenue')}</p>
              <h3 className="text-2xl font-black text-gray-800">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-500"><Clock size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.pending')}</p>
              <h3 className="text-2xl font-black text-gray-800">{pendingOrdersCount}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-pink-400">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-500"><Star size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.top_selling')}</p>
              <h3 className="text-lg font-black text-gray-800 truncate w-40">{topSelling}</h3>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-4">{t('orders.table.date')}</th>
                  <th className="px-6 py-4">{t('orders.table.customer')}</th>
                  <th className="px-6 py-4">{t('orders.table.phone')}</th>
                  <th className="px-6 py-4">{t('orders.table.total')}</th>
                  <th className="px-6 py-4">{t('orders.table.status')}</th>
                  <th className="px-6 py-4 text-center">{t('orders.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-bold">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-[9px] text-gray-400 uppercase">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-800 text-sm">{order.customer?.fullName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-bold">{order.customer?.phone}</span>
                        <a href={`https://wa.me/${order.customer?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-500"><MessageCircle size={16} /></a>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-pink-600">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-fit ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status === 'Completed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all">
                          <Eye size={18} />
                        </button>
                        <button 
                          disabled={updatingId === order._id}
                          onClick={() => toggleStatus(order._id, order.status)} 
                          className={`p-2 rounded-xl transition-all ${order.status === 'Completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'} ${updatingId === order._id ? 'animate-spin' : ''}`}
                        >
                          <CheckCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl">
            
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-pink-50/30">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-pink-500">
                  <Calendar size={20}/>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800">{t('orders.modal.title')}</h2>
                  <p className="text-xs text-pink-500 font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 font-black text-xl px-2">✕</button>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto">
              <div className="mb-6 bg-gray-50 p-5 rounded-3xl border border-gray-100">
                <p className="font-black text-gray-800 text-sm mb-2 uppercase tracking-tighter">
                  📍{t('orders.modal.address')}: <span className="font-medium text-gray-600 normal-case">{selectedOrder.customer?.address}</span>
                </p>
                <p className="font-black text-gray-800 text-sm uppercase tracking-tighter">
                  📝 {t('orders.modal.notes')}:<span className="font-medium text-gray-400 italic normal-case">{selectedOrder.customer?.notes || "No notes"}</span>
                </p>
              </div>

              <h3 className="font-black text-gray-800 mb-4 px-2">{t('orders.modal.items_ordered')}:</h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 font-black text-[10px]">CAKE</div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-base">{item.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-pink-600 bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200">
                         {t('orders.modal.size')}: {item.size || "Standard"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-pink-600 font-black text-xl">{item.quantity}x</p>
                      <p className="text-gray-400 text-[10px] font-bold">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-black text-lg uppercase italic tracking-widest">Total</span>
                <span className="text-4xl font-black text-gray-800">${selectedOrder.totalAmount}</span>
              </div>
              <button 
                disabled={updatingId === selectedOrder._id}
                onClick={() => toggleStatus(selectedOrder._id, selectedOrder.status)}
                className={`w-full font-black py-4 rounded-4xl transition-all uppercase tracking-widest shadow-xl ${
                  selectedOrder.status === 'Completed' 
                  ? 'bg-green-500 text-white shadow-green-100' 
                  : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-100'
                } ${updatingId === selectedOrder._id ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {updatingId === selectedOrder._id ? 'Updating...' : (selectedOrder.status === 'Completed' ? t('orders.modal.order_done') : t('orders.modal.mark_complete'))}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}