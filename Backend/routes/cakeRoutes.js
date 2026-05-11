const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cakeController = require('../controllers/cakeController');
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require('uuid'); // ⇨ 'ab16e731-6cee-424d-81a0-5929e9bdb0cc'
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // تأكد من أن هذا المسار موجود في مشروعك
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uuidv4()+ '.' + file.originalname.split('.').pop()); // اسم فريد لكل صورة مع الحفاظ على الامتداد
  }
})
const upload = multer({ storage: storage });

const validateImages = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
    }
    next();
};

const parseJsonFields = (fields = []) => (req, res, next) => {
    fields.forEach((field) => {
        if (typeof req.body[field] === 'string') {
            try {
                req.body[field] = JSON.parse(req.body[field]);
            } catch (err) {
                // Leave as string so controller/validation can handle it.
            }
        }
    });
    next();
};

// Define validation
const cakeValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('prices').isArray({ min: 1 }).withMessage('At least one price is required')
];

router.get('/', cakeController.getAllCakes);
router.get('/:id', cakeController.getCakeById);
router.post('/', upload.array('images', 12), validateImages, cakeController.addCake);
router.patch('/:id', upload.array('images', 12), parseJsonFields(['existingImages', 'prices']), cakeController.updateCake);
router.delete('/:id', cakeController.deleteCake);


module.exports = router;