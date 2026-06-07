import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, Package, MessageCircle, Calendar, Star, Phone, Trash2 } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

export default function Order() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000' 
    : 'https://e-commerce-cake-site-dxkh.vercel.app';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    
    try {
      setUpdatingId(id);
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order._id === id ? { ...order, status: newStatus } : order
        ));
        
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet masterpiece? 🗑️")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== id));
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(null);
          setIsModalOpen(false);
        }
      } else {
        console.error("Failed to delete order", response.statusText);
      }
    } catch (error) {
      console.error("Delete failed:", error);
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

  const selectedBackupPhone = selectedOrder?.customer?.backupPhone || selectedOrder?.customer?.phoneOptional;

  if (loading) return <div className="p-8 text-center font-black text-pink-500 animate-pulse">{t('orders.loading', 'Loading Orders...')}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-500"><Package size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.revenue', 'Total Revenue')}</p>
              <h3 className="text-2xl font-black text-gray-800">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-500"><Clock size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.pending', 'Pending Orders')}</p>
              <h3 className="text-2xl font-black text-gray-800">{pendingOrdersCount}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-pink-400">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-500"><Star size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('orders.stats.top_selling', 'Top Selling')}</p>
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
                  <th className="px-6 py-4">{t('orders.table.date', 'Date')}</th>
                  <th className="px-6 py-4">{t('orders.table.customer', 'Customer')}</th>
                  <th className="px-6 py-4">{t('orders.table.phone', 'Phone')}</th>
                  <th className="px-6 py-4">{t('orders.table.total', 'Total')}</th>
                  <th className="px-6 py-4">{t('orders.table.status', 'Status')}</th>
                  <th className="px-6 py-4 text-center">{t('orders.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedOrders.map((order) => {
                  const orderBackupPhone = order.customer?.backupPhone || order.customer?.phoneOptional;
                  return (
                    <tr key={order._id} className="hover:bg-pink-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs font-bold">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-[9px] text-gray-400 uppercase">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-800 text-sm">{order.customer?.fullName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-bold">{order.customer?.phone}</span>
                            <a href={`https://wa.me/${order.customer?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-500 hover:scale-110 transition-transform"><MessageCircle size={15} /></a>
                          </div>
                          {orderBackupPhone && (
                            <div className="flex items-center gap-2 border-t border-dashed border-gray-100 pt-1">
                              <span className="text-[11px] text-gray-400 font-medium">{orderBackupPhone}</span>
                              <a href={`https://wa.me/${orderBackupPhone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-400 hover:scale-110 transition-transform"><MessageCircle size={13} /></a>
                            </div>
                          )}
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
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all">
                            <Eye size={18} />
                          </button>
                          <button 
                            disabled={updatingId === order._id}
                            onClick={() => toggleStatus(order._id, order.status)} 
                            className={`p-2 rounded-xl transition-all ${order.status === 'Completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'} ${updatingId === order._id ? 'api-loading' : ''}`}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            disabled={updatingId === order._id}
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Order"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  <h2 className="text-xl font-black text-gray-800">{t('orders.modal.title', 'Order Details')}</h2>
                  <p className="text-xs text-pink-500 font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 font-black text-xl px-2">✕</button>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto">
              <div className="mb-6 bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-2.5">
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-gray-200/60 pb-2.5">
                  <p className="font-black text-gray-800 text-sm flex items-center gap-1.5">
                    <Phone size={14} className="text-pink-500" /> {t('orders.table.phone', 'Phone')}: 
                    <span className="font-bold text-gray-600">{selectedOrder.customer?.phone}</span>
                  </p>
                  {selectedBackupPhone && (
                    <p className="font-black text-gray-800 text-sm flex items-center gap-1.5">
                      <Phone size={14} className="text-pink-400" /> {t('cart.backup_phone', 'Backup')}: 
                      <span className="font-bold text-gray-500">{selectedBackupPhone}</span>
                    </p>
                  )}
                </div>
                <p className="font-black text-gray-800 text-sm uppercase tracking-tighter">
                  📝 {t('orders.modal.notes', 'Notes')}: <span className="font-medium text-gray-600 normal-case">{selectedOrder.customer?.notes || "No notes"}</span>
                </p>
              </div>

              <h3 className="font-black text-gray-800 mb-4 px-2">{t('orders.modal.items_ordered', 'Items Ordered')}:</h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    {(item.img || item.image) ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img 
                          src={
                            (() => {
                              const imagePath = item.img || item.image;
                              if (imagePath.startsWith('http')) return imagePath;
                              const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
                              return `${API_URL}${cleanPath}`;
                            })()
                          } 
                          className="w-full h-full object-cover" 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 font-black text-[10px] flex-shrink-0">
                        🎂
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-base">{item.name}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {/* حقل الـ Category المضاف حديثاً */}
                        {item.category && (
                          <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100/70">
                            {item.category}
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                          {t('orders.modal.size', 'Size')}: {item.size || "Standard"}
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

            <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-black text-lg uppercase italic tracking-widest">Total</span>
                <span className="text-4xl font-black text-gray-800">${selectedOrder.totalAmount}</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  disabled={updatingId === selectedOrder._id}
                  onClick={() => toggleStatus(selectedOrder._id, selectedOrder.status)}
                  className={`flex-1 font-black py-4 rounded-4xl transition-all uppercase tracking-widest shadow-xl ${
                    selectedOrder.status === 'Completed' 
                    ? 'bg-green-500 text-white shadow-green-100' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-100'
                  }`}
                >
                  {selectedOrder.status === 'Completed' ? t('orders.modal.order_done', 'Order Done') : t('orders.modal.mark_complete', 'Mark As Complete')}
                </button>
                
                <button 
                  disabled={updatingId === selectedOrder._id}
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 rounded-4xl font-black transition-all border border-red-100 shadow-md"
                  title="Delete Entire Order"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}