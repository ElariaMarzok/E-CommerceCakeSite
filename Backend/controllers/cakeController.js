

const Cake = require('../models/Cake');


// 1. Get All Cakes from MongoDB (تفعيل الدالة لتصليح الـ Dashboard)
const getAllCakes = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        const cakes = await Cake.find(filter).sort({ createdAt: -1 });
        res.status(200).json(cakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Cake by ID
const getCakeById = async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (!cake) return res.status(404).json({ message: "Cake not found" });
        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Add New Cake (تم حذف existingCake المسبب للانهيار)
const addCake = async (req, res) => {
    try {
        const imageUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];
        const prices = JSON.parse(req.body.prices || '[]');

        const cakeData = {
            ...req.body,
            prices,
            description: req.body.description || '', // هنا الحل الصحيح للبساطة
            images: imageUrls,
        };

        const newCake = new Cake(cakeData);
        const savedCake = await newCake.save();
        res.status(201).json(savedCake);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Update Cake
const updateCake = async (req, res) => {
    try {
        const imageUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];
        
        // التحقق من البيانات المرسلة
        let existingImages = req.body.existingImages;
        try { existingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : (existingImages || []); } 
        catch (err) { existingImages = []; }

        let prices = req.body.prices;
        try { prices = typeof prices === 'string' ? JSON.parse(prices) : (prices || []); } 
        catch (err) { prices = []; }

        const images = [...existingImages, ...imageUrls];

        const updateData = {
            ...req.body,
            prices,
            images,
            description: req.body.description || ''
        };
        delete updateData.existingImages;

        const updatedCake = await Cake.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCake) return res.status(404).json({ message: "Cake not found" });
        res.status(200).json(updatedCake);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Delete Cake
const deleteCake = async (req, res) => {
    try {
        const deletedCake = await Cake.findByIdAndDelete(req.params.id);
        if (!deletedCake) return res.status(404).json({ message: "Cake not found" });
        res.status(200).json({ success: true, message: "Cake deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        // req.body يجب أن يحتوي على (customer, items, totalAmount)
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Order saved to database!", 
            orderId: savedOrder._id 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to save order", 
            error: error.message 
        });
    }
};

// 7. Get All Orders (خاص بصفحة الأدمن لرؤية الطلبات)
const getAllOrders = async (req, res) => {
    try {
        // ترتيب من الأحدث للأقدم
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

module.exports = {
    getAllCakes, // تأكدي أنها غير معلقة هنا
    getCakeById,
    addCake,
    updateCake,
    deleteCake,
    placeOrder,
    getAllOrders
};