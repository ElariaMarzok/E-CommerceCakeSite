import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, Search, Plus, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── Helper خارج الكومبوننت عشان يتحفظ مش يتعمل من جديد كل render ──
const getName = (name) => {
  if (!name) return '';
  if (typeof name === 'string') return name;
  return name.en || name.es || '';
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cakes, setCakes] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // تصفية الكيك حسب الاسم أو التصنيف
  const filteredCakes = cakes.filter(cake =>
    getName(cake.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cake.category && cake.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    async function getData() {
      try {
        // بنبعت اللغة عشان الباك إند يرجع name كـ string جاهز
        const response = await fetch(`${BASE_URL}/cakes?lang=${i18n.language}`);
        const data = await response.json();
        
        if (response.ok) {
          setCakes(data);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
    getData();
  }, [i18n.language]); //  يعيد الجلب لما اللغة تتغير

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweet masterpiece? 🎂🗑️")) {
      try {
        const response = await fetch(`${BASE_URL}/cakes/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setCakes(prev => prev.filter(cake => cake._id !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">

      <div className="max-w-6xl mx-auto mt-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="bg-pink-100 p-3 rounded-2xl text-pink-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('dashboard.total_varieties')}</p>
            <p className="text-2xl font-bold text-gray-800">{cakes.length}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder={t('dashboard.search_placeholder')}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all w-full md:w-64 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-pink-100 hover:shadow-pink-200 active:scale-95 transition-all text-sm"
            >
              <Plus size={18} strokeWidth={3} />
              <span>{t('dashboard.add_new')}</span>
            </button>
            <button
              onClick={() => { if (window.confirm("Clear inventory?")) setCakes([]) }}
              className="text-red-400 hover:bg-red-50 px-4 py-3 rounded-2xl text-xs font-bold transition-colors border border-transparent hover:border-red-100"
            >
              {t('dashboard.clear_all')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-4">{t('dashboard.table_product')}</th>
                <th className="px-6 py-4">{t('dashboard.table_category')}</th>
                <th className="px-6 py-4">{t('dashboard.table_prices')}</th>
                <th className="px-6 py-4 text-center">{t('dashboard.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCakes.map((cake) => (
                <tr key={cake._id} className="hover:bg-pink-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                        <img
                          src={cake.images?.length > 0 ? BASE_URL + cake.images[0] : null}
                          alt={getName(cake.name)}   // ✅
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/*  getName بدل cake.name مباشرة */}
                      <span className="font-bold text-gray-700">{getName(cake.name)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {cake.category || t('dashboard.general')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {cake.prices && Array.isArray(cake.prices) ? (
                        cake.prices.map((p, idx) => (
                          <div key={idx} className="flex items-center bg-white border border-pink-100 px-2 py-1 rounded-md shadow-sm">
                            <span className="text-[9px] font-black text-pink-500 mr-1.5 uppercase">{p.size}</span>
                            <span className="text-xs font-bold text-gray-600">{Number(p.price).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {Number(cake.price || 0).toFixed(2)} EGP
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate('/edit/' + cake._id)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cake._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCakes.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4 text-gray-200">
                <PlusCircle size={48} />
              </div>
              <h3 className="text-gray-400 font-bold text-lg">{t('dashboard.empty_title')}</h3>
              <p className="text-gray-300 text-sm">{t('dashboard.empty_desc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}