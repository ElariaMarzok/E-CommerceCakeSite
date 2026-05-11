import { Link } from 'react-router-dom';
import { Dessert, Home, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* animation icon */}
      <div className="relative mb-8">
        <Dessert size={100} className="text-pink-200 animate-bounce" />
        <UtensilsCrossed size={40} className="absolute -bottom-2 -right-2 text-pink-500 rotate-12" />
      </div>
 
      <h1 className="text-8xl font-black text-pink-100 absolute -z-10 select-none">
        404
      </h1>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h2>
      
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
       It seems that this cake is not in the oven yet! The page you are looking for does not exist or has been moved.

      </p>

      <Link 
        to="/" 
        className="flex items-center gap-2 bg-linear-to-r from-pink-500 to-pink-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-pink-200 hover:scale-105 transition-all"
      >
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
}