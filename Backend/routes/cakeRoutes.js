const express = require('express');
const router = express.Router();
const cakeController = require('../controllers/cakeController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ميثود التحقق من وجود صور عند الإضافة
const validateImages = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
    }
    next();
};

// ميديال وير ذكي لتحويل النصوص القادمة من FormData إلى JSON صالحة للـ DB
const parseJsonFields = (fields = []) => (req, res, next) => {
    fields.forEach((field) => {
        if (req.body && typeof req.body[field] === 'string') {
            try {
                req.body[field] = JSON.parse(req.body[field]);
            } catch (err) {
                // تترك كما هي إذا لم تكن عبارة عن نصوص JSON مدعومة
            }
        }
    });
    next();
};

// 🚀 المسارات مستقرة وبأداء عالي
router.get('/', cakeController.getAllCakes);
router.get('/:id', cakeController.getCakeById);

// 👈 أضفنا parseJsonFields هنا أيضاً لحماية الـ prices أثناء الإضافة
router.post('/', upload.array('images', 12), parseJsonFields(['prices']), validateImages, cakeController.addCake);
router.patch('/:id', upload.array('images', 12), parseJsonFields(['existingImages', 'prices']), cakeController.updateCake);

router.delete('/:id', cakeController.deleteCake);

module.exports = router;