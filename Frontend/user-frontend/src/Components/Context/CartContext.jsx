import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

// ── Helper داخلي محسّن للتعامل مع النصوص والترجمات ──────────────────
const resolveText = (field, lang = 'es') => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
        return field[lang] || field.es || field.en || '';
    }
    return '';
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cakeCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // جلب لغة المستخدم الحالية ديناميكياً
    const lang = localStorage.getItem("i18nextLng") || 'es';

    useEffect(() => {
        localStorage.setItem("cakeCart", JSON.stringify(cart));
    }, [cart]);

    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = cart.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty   = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0) + (cart.length > 0 ? 80 : 0);

    const addToCart = (product) => {
        // تأمين البيانات القادمة لضمان صحة الأنواع (Types) داخل السلة
        const safeProduct = {
            ...product,
            // لو الاسم قادم كـ Object نترجمه، ولو قادم كـ String جاهز نتركه كما هو
            name: typeof product.name === 'object' ? resolveText(product.name, lang) : product.name,
            quantity: Number(product.quantity) || 1,
            price: Number(product.price) || 0
        };

        setCart((prev) => {
            // البحث بالـ ID الفريد (الذي يحتوي على الحجم الآن)
            const isExist = prev.find(item => item.id === safeProduct.id);
            if (isExist) {
                return prev.map(item =>
                    item.id === safeProduct.id
                        ? { ...item, quantity: item.quantity + safeProduct.quantity }
                        : item
                );
            }
            return [...prev, safeProduct];
        });
    };

    const updateQuantity = (id, amount) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

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