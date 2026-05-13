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

//تغير حاله الطلب 
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;


        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // ليرجع البيانات بعد التعديل
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


