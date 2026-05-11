import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // عند تغير المسار، قم بالتمرير إلى أعلى الصفحة
    window.scrollTo(0, 0);
    
    
  }, [pathname]); // لما يتغير المسار (الراوتر) يتم تنفيذ هذا التأثير

  return null;
}