const Cake = require('../models/Cake');
const Order = require('../models/Order');
const { translateFieldsToEnglish } = require('../services/translationService');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// رفع الصور عبر الـ Streams
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'cake_shop_products', 
        resource_type: 'auto' 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};
const runTranslation = async (nameEs, descriptionEs) => {
    try {
        const fieldsToTranslate = {};
        if (nameEs?.trim())      fieldsToTranslate.name        = nameEs;
        if (descriptionEs?.trim()) fieldsToTranslate.description = descriptionEs;

        if (Object.keys(fieldsToTranslate).length === 0) return {};
        return await translateFieldsToEnglish(fieldsToTranslate);
    } catch (err) {
        console.error('[Translation failed — saving ES only]', err.message);
        return {};
    }
};

// 1. Get All Cakes
const getAllCakes = async (req, res) => {
    try {
        const { category, search, lang = 'en' } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { 'name.es':         { $regex: search, $options: 'i' } },
                { 'name.en':         { $regex: search, $options: 'i' } },
                { 'description.es': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } },
                { category:          { $regex: search, $options: 'i' } },
            ];
        }

        if (category) filter.category = category;

        const cakes = await Cake.find(filter).sort({ createdAt: -1 });

        const localized = cakes.map(cake => ({
            _id:         cake._id,
            name:        cake.name?.[lang]        || cake.name?.es        || cake.name,
            description: cake.description?.[lang] || cake.description?.es || cake.description,
            prices:      cake.prices,
            category:    cake.category,
            images:      cake.images,
            createdAt:   cake.createdAt,
            lang,
        }));

        res.status(200).json(localized);
    } catch (error) {
        res.status(500).json({ message: error.message ,"message debug": "Internal Server Error" });
    }
};

// 2. Get Cake by ID
const getCakeById = async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const cake = await Cake.findById(req.params.id);
        if (!cake) return res.status(404).json({ message: 'Cake not found' });

        res.status(200).json({
            _id:         cake._id,
            name:        cake.name?.[lang]        || cake.name?.es        || cake.name,
            description: cake.description?.[lang] || cake.description?.es || cake.description,
            prices:      cake.prices,
            category:    cake.category,
            images:      cake.images,
            createdAt:   cake.createdAt,
            lang,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Add New Cake (High Performance Parallel Upload)
const addCake = async (req, res) => {
    try {
        let imageUrls = [];
        
        // 👈 السرعة القصوى: نرفع كل الصور بالتوازي باستخدام Promise.all
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => streamUpload(file.buffer));
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url || result.url);
        }

        // بما أن الميديال وير قام بعمل Parse، نقرأها بأمان أو نضع مصفوفة فارغة افتراضية
        const prices = req.body.prices || [];

        const nameEs        = req.body.name_es        || req.body.name        || '';
        const descriptionEs = req.body.description_es || req.body.description || '';

        const translated = await runTranslation(nameEs, descriptionEs);

        const cakeData = {
            category: req.body.category || '',
            prices,
            images: imageUrls,
            name: {
                es: nameEs,
                en: translated.name || '',
            },
            description: {
                es: descriptionEs,
                en: translated.description || '',
            },
            translationMeta: {
                translatedAt: translated.name ? new Date() : null,
                provider: 'mymemory',
            },
        };

        const newCake = new Cake(cakeData);
        const savedCake = await newCake.save();
        res.status(201).json(savedCake);
    } catch (error) {
        console.error("🚨 CRITICAL BACKEND ERROR IN ADD_CAKE:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Update Cake (High Performance Parallel Upload)
const updateCake = async (req, res) => {
    try {
        let imageUrls = [];
        
        // 👈 رفع الصور الجديدة بالتوازي في التعديل أيضاً
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => streamUpload(file.buffer));
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url || result.url);
        }

        const existingImages = req.body.existingImages || [];
        const prices = req.body.prices || [];
        const images = [...existingImages, ...imageUrls];

        const existingCake = await Cake.findById(req.params.id);
        if (!existingCake) return res.status(404).json({ message: 'Cake not found' });

        const incomingName = req.body.name_es || req.body.name || '';
        const incomingDesc = req.body.description_es || req.body.description || '';

        const currentNameEs = existingCake.name?.es || (typeof existingCake.name === 'string' ? existingCake.name : '');
        const currentDescEs = existingCake.description?.es || (typeof existingCake.description === 'string' ? existingCake.description : '');

        const nameChanged = incomingName && incomingName !== currentNameEs;
        const descChanged = incomingDesc && incomingDesc !== currentDescEs;

        let translated = {};
        if (nameChanged || descChanged) {
            translated = await runTranslation(
                nameChanged ? incomingName : null,
                descChanged ? incomingDesc : null,
                );
        }

        const updateData = {
            category: req.body.category || existingCake.category,
            prices,
            images,
            name: {
                es: incomingName || currentNameEs,
                en: nameChanged ? (translated.name || existingCake.name?.en || '') : (existingCake.name?.en || ''),
            },
            description: {
                es: incomingDesc || currentDescEs,
                en: descChanged ? (translated.description || existingCake.description?.en || '') : (existingCake.description?.en || ''),
            },
        };

        if (nameChanged || descChanged) {
            updateData.translationMeta = {
                translatedAt: new Date(),
                provider: 'mymemory',
            };
        }

        const updatedCake = await Cake.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedCake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Delete Cake
const deleteCake = async (req, res) => {
    try {
        const deletedCake = await Cake.findByIdAndDelete(req.params.id);
        if (!deletedCake) return res.status(404).json({ message: 'Cake not found' });
        res.status(200).json({ success: true, message: 'Cake deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Place Order
const placeOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({
            success: true,
            message: 'Order saved to database!',
            orderId: savedOrder._id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save order', error: error.message });
    }
};

// 7. Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = {
    getAllCakes,
    getCakeById,
    addCake,
    updateCake,
    deleteCake,
    placeOrder,
    getAllOrders,
};