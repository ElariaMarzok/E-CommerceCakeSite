const Order = require('../models/Order');
// استقبال الطلب من العميل
exports.placeOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

//  جلب كل الطلبات للأدمن
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // الأحدث أولاً
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


