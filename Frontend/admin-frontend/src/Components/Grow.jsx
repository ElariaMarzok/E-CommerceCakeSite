import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, DollarSign, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

export default function Grow() {
  const { t, i18n } = useTranslation(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  //  جلب الطلبات وتحضيرها للعرض في التحليلات
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        const completedOrders = data.filter(order => order.status === 'Completed');
        setOrders(completedOrders);
      } catch (error) {
        console.error("Error fetching orders for analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-pink-500">
        <Loader2 className="animate-spin" size={40} />
        <span className="ml-2 font-black">{t('grow.loading', 'Loading Dashboard Analytics...')}</span>
      </div>
    );
  }

  // ── الفلترة وحسابات المبيعات ─────────────────────────
  const filteredOrders = orders.filter(order => {
    //  نفلتر الطلبات حسب السنة المختارة في الـ dropdown
    const orderYear = new Date(order.createdAt).getFullYear().toString();
    //  نضمن إن السنة المختارة موجودة في الطلبات عشان ما نطلعش شاشة فاضية لو اخترنا سنة جديدة
    return orderYear === selectedYear;
  });

  
  const now = new Date();
  let dailyRevenue = 0;
  let weeklyRevenue = 0;
  let yearlyRevenue = 0;

  filteredOrders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const amount = order.totalAmount || 0;

    yearlyRevenue += amount;

    if (
      orderDate.getDate() === now.getDate() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    ) {
      dailyRevenue += amount;
    }

    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      weeklyRevenue += amount;
    }
  });

  // ── حساب نسب الشهور ───────────────────────────
  const monthlyData = Array(12).fill(0);
  filteredOrders.forEach(order => {
    const month = new Date(order.createdAt).getMonth();
    monthlyData[month] += order.totalAmount || 0;
  });

  const maxMonthRevenue = Math.max(...monthlyData, 1);

  // مصفوفة مفاتيح الشهور للترجمة الديناميكية
  const monthsKeys = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"
  ];

  // ── حسابات المنتجات ────────────────────────────
  const productStats = {};

  filteredOrders.forEach(order => {
    order.items?.forEach(item => {
      const name = item.name || "Unknown Cake";
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const totalItemRevenue = qty * price;

      if (!productStats[name]) {
        productStats[name] = {
          name: name,
          orderCount: 0,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      productStats[name].orderCount += 1;
      productStats[name].totalQuantity += qty;
      productStats[name].totalRevenue += totalItemRevenue;
    });
  });

  const productStatsArray = Object.values(productStats);

  const topSellingItem = productStatsArray.length > 0 
    ? productStatsArray.reduce((a, b) => a.totalRevenue > b.totalRevenue ? a : b)
    : null;

  const availableYears = [...new Set(orders.map(o => new Date(o.createdAt).getFullYear().toString()))];
  if (availableYears.length === 0) availableYears.push(new Date().getFullYear().toString());

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
              <BarChart3 className="text-pink-500" size={36} /> {t('grow.title', 'Grow Business')}
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">{t('grow.subtitle', 'Track your bakery performance and monthly growth.')}</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
            <Calendar size={18} className="text-gray-400" />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="font-bold text-gray-700 bg-transparent outline-none cursor-pointer text-sm"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{t('grow.year', 'Year')}: {year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── كروت الإيرادات الثلاثية ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-500"><DollarSign size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('grow.daily', 'Daily Revenue')}</p>
              <h3 className="text-2xl font-black text-gray-800">{t('currency', 'EGP')} {dailyRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-500"><TrendingUp size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('grow.weekly', 'Weekly Revenue (7d)')}</p>
              <h3 className="text-2xl font-black text-gray-800">{t('currency', 'EGP')} {weeklyRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-pink-500">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-500"><ShoppingBag size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('grow.yearly', 'Yearly Total')} ({selectedYear})</p>
              <h3 className="text-2xl font-black text-pink-600">{t('currency', 'EGP')} {yearlyRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* ── شارت نسب ومبيعات الشهور ───────────────── */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              📊 {t('grow.monthly_sales', 'Monthly Sales Percentage')}
            </h3>
            <div className="space-y-4">
              {monthlyData.map((revenue, index) => {
                const percentage = yearlyRevenue > 0 ? ((revenue / yearlyRevenue) * 100).toFixed(1) : 0;
                const barWidth = ((revenue / maxMonthRevenue) * 100) || 0;

                return (
                  <div key={index} className="flex items-center gap-4">
                    {/* ترجمة اسم الشهر ديناميكياً بناءً على المفتاح */}
                    <span className="w-20 text-xs font-bold text-gray-500 uppercase">
                      {t(`months.${monthsKeys[index]}`)}
                    </span>
                    <div className="flex-1 bg-gray-50 h-3 rounded-full overflow-hidden relative">
                      <div 
                        style={{ width: `${barWidth}%` }} 
                        className="bg-gradient-to-r from-pink-400 to-pink-500 h-full rounded-full transition-all duration-1000"
                      />
                    </div>
                    <span className="w-24 text-right text-xs font-black text-gray-700">{t('currency', 'EGP')} {revenue.toLocaleString()}</span>
                    <span className="w-12 text-right text-[11px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded-md">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── كارت المنتج النجم الأعلى مبيعاً ─────────────────── */}
          <div className="lg:col-span-5 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                👑 {t('grow.star_product', 'Star Product of the Year')}
              </h3>
              <p className="text-gray-400 text-xs font-medium mb-6">{t('grow.star_product_sub', 'The item that generated the highest revenue.')}</p>
              
              {topSellingItem ? (
                <div className="bg-gradient-to-br from-pink-50/40 to-amber-50/20 p-6 rounded-3xl border border-pink-100/40">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-50 font-black mb-4">🏆</div>
                  <h4 className="text-2xl font-black text-gray-800 mb-4">{topSellingItem.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{t('grow.items_sold', 'Items Sold')}</p>
                      <p className="text-lg font-black text-gray-700">{topSellingItem.totalQuantity} {t('grow.pieces', 'Pieces')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{t('grow.total_revenue', 'Total Revenue')}</p>
                      <p className="text-lg font-black text-pink-600">{t('currency', 'EGP')} {topSellingItem.totalRevenue}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 italic font-medium">{t('grow.no_data', 'No sales data recorded yet.')}</div>
              )}
            </div>

            <div className="mt-6 border-t border-dashed border-gray-100 pt-6 flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-8 rounded-b-[3rem]">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{t('grow.total_unique', 'Total Unique Items Sold')}</span>
              <span className="text-2xl font-black text-gray-800">{productStatsArray.length} {t('grow.items', 'Items')}</span>
            </div>
          </div>

        </div>

        {/* ── جدول أداء كل المنتجات ───────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-pink-500" /> {t('grow.table_title', 'All Items Performance & Orders Count')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-4">{t('grow.th_name', 'Product Name')}</th>
                  <th className="px-6 py-4 text-center">{t('grow.th_orders', 'Total Orders Count')}</th>
                  <th className="px-6 py-4 text-center">{t('grow.th_qty', 'Total Quantities Sold')}</th>
                  <th className="px-6 py-4 text-right">{t('grow.th_revenue', 'Total Revenue Achieved')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productStatsArray.map((item, index) => (
                  <tr key={index} className="hover:bg-pink-50/10 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-800 text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-600 text-sm">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{item.orderCount} {t('grow.orders', 'Orders')}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-purple-600 text-sm">{item.totalQuantity} pcs</td>
                    <td className="px-6 py-4 text-right font-black text-pink-600 text-sm">{t('currency', 'EGP')} {item.totalRevenue.toLocaleString()}</td>
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