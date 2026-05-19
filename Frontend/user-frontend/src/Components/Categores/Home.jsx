import { useRef } from 'react'; 
import { Link } from 'react-router-dom';
import { ChefHat, Cake as CakeIcon, Cookie, Box, UtensilsCrossed, Globe, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { useTranslation } from 'react-i18next'; 

export default function Home() {
  const { t } = useTranslation(); 
  const sliderRef = useRef(null); 

  const categories = [
    {
      name: t('all_items', 'All'), 
      path: "all", 
      icon: <Globe size={32} />, 
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop" 
    },
    { 
      name: t('navbar.bakery', 'Bakery'), 
      path: "bakery", 
      icon: <Cookie size={32} />, 
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" 
    },
    { 
      name: t('navbar.cakes', 'Cakes'), 
      path: "cakes", 
      icon: <CakeIcon size={32} />, 
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" 
    },
    { 
      name: t('navbar.catering', 'Catering'), 
      path: "catering", 
      icon: <UtensilsCrossed size={32} />, 
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop" 
    },
    { 
      name: t('navbar.sweets', 'Sweets'), 
      path: "sweets", 
      icon: <ChefHat size={32} />, 
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop" 
    },
    { 
      name: t('navbar.boxes', 'Boxes'), 
      path: "boxes", 
      icon: <Box size={32} />, 
      img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&auto=format&fit=crop" 
    },
  ];

 // دالة للتحكم في حركة السلايدر يمين ويسار
  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // المسافة التي يتحركها السلايدر مع كل ضغطة بالبكسل
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 1. Hero Image */}
      <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden">
        <img 
          src="https://static.vecteezy.com/system/resources/previews/039/072/217/non_2x/ai-generated-a-charming-ombre-cake-with-layers-of-pink-and-purple-beautifully-displayed-against-a-clean-background-free-photo.jpeg"
          className="w-full h-full object-cover" 
          alt="Banner" 
        />
      </div>

      {/* 2. Category Slider Section */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* الـ Header الخاص بالقسم مع إضافة الأزرار */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-pink-500">
              {t('categories_section.title', 'Our Categories')}
            </h2>
            <div className="h-1 flex-1 bg-pink-100 mx-4 rounded-full"></div>
            
            
            <div className="flex gap-2">
              <button 
                onClick={() => slide('left')}
                className="p-2 rounded-full border border-pink-100 bg-white text-pink-500 shadow-sm hover:bg-pink-500 hover:text-white transition-all duration-300"
                aria-label="Slide Left"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => slide('right')}
                className="p-2 rounded-full border border-pink-100 bg-white text-pink-500 shadow-sm hover:bg-pink-500 hover:text-white transition-all duration-300"
                aria-label="Slide Right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {categories.map((cat, index) => (
              <Link 
                key={index} 
                to={`/${cat.path}`}
                className="min-w-[200px] md:min-w-[240px] group snap-start"
              >
                <div className="relative h-[280px] rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                  {/* Background Image */}
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-3 group-hover:bg-pink-500 transition-colors">
                      {cat.icon}
                    </div>
                    <span className="text-xl font-black uppercase tracking-widest">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
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