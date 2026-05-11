import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // جلب بيانات المستخدم من 
    // localStorage عند تحميل التطبيق
    const savedUser = localStorage.getItem("cakeUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // تحديث localStorage كلما تغيرت بيانات المستخدم
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("cakeUser", JSON.stringify(userData));
  };

  // وظيفة تسجيل الخروج التي تزيل بيانات المستخدم من الحالة و localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cakeUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);