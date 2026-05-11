import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. استرجاع البيانات من localStorage عند البداية
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cakeCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. تحديث localStorage تلقائياً عند أي تغيير في السلة
    useEffect(() => {
        localStorage.setItem("cakeCart", JSON.stringify(cart));
    }, [cart]);

    // حساب إجمالي الكمية للـ Navbar
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    // حساب إجمالي السعر + 80 رسوم توصيل
    const totalPrice = cart.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0) + (cart.length > 0 ? 80 : 0); // نضيف الـ 80 فقط إذا كانت السلة غير فارغة

    // إضافة منتج للسلة
    const addToCart = (product) => {
        setCart((prev) => {
            const isExist = prev.find(item => item.id === product.id);
            if (isExist) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // تحديث الكمية داخل صفحة السلة
    const updateQuantity = (id, amount) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id 
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) } 
                    : item
            )
        );
    };

    // حذف منتج من السلة
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    // مسح السلة بالكامل بعد إتمام الطلب
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            updateQuantity, 
            addToCart, 
            removeFromCart, 
            totalQuantity, 
            totalPrice,
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};