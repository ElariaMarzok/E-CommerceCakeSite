import { MessageCircle, Instagram, Facebook, Heart } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

export default function Footer() {

  const { t } = useTranslation();

  return (
    <footer className="bg-pink-50 border-t border-pink-100 py-10 ">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 text-center">
          
         
          <div className="flex flex-col items-center space-y-3">
            <h1 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              {t('footer.about_title')}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
                <Heart size={32} className="text-pink-500 fill-pink-500 animate-pulse" />
           {t('footer.about_text')}
              <Heart size={32} className="text-pink-500 fill-pink-500 animate-pulse" />
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              {t('footer.contact_title')}
            </h1>
            <div className="flex justify-center gap-6">
           
              <a href="https://wa.me/189169530"
              target="_blank" 
               rel="noopener noreferrer"
               className="hover:scale-125 transition-transform text-green-500 bg-white p-3 rounded-full shadow-sm">
                <MessageCircle size={28} />
              </a>
              
           
              <a href="https://www.instagram.com/maryscakecrshop?igsh=MXYyeXk4eWxzY2U5cg=="
               target="_blank" 
               rel="noopener noreferrer"
               className="hover:scale-125 transition-transform text-pink-600 bg-white p-3 rounded-full shadow-sm">
                <Instagram size={28} />
              </a>
              
            
              <a href="https://www.facebook.com/share/1E2wuX9oVG/"
                target="_blank"  
                rel="noopener noreferrer"
                className="hover:scale-125 transition-transform text-blue-600 bg-white p-3 rounded-full shadow-sm">
                <Facebook size={28} />
              </a>
            </div>
            

            <div className="text-sm text-gray-500 space-y-1  ">
              <p className="hover:hover:text-pink-500 cursor-pointer">
               <a 
                  href="https://wa.me/189169520" 
                  target="_blank" 
                  rel="noopener noreferrer"
                 
               >
               {t('footer.whatsapp')}: 8916-9520
             </a>
              </p>
               {/* <p className='hover:hover:text-pink-500 cursor-pointer'>WhatsApp: 8916-9520</p> */}
               <p className='hover:hover:text-pink-500 cursor-pointer'> 
                <a href="https://www.instagram.com/maryscakecrshop?igsh=MXYyeXk4eWxzY2U5cg==" 
                 target="_blank"
                 rel="noopener noreferrer">
                  @maryscakeshopcr </a></p>
               <p className='hover:hover:text-pink-500 cursor-pointer'>Mary’s Cake & Catering Service</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}