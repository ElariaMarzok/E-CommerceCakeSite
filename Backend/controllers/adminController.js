const Admin = require('../models/Admin.model'); // تم التأكيد على المسار الصحيح
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. التسجيل (Signup) مع فحص القائمة البيضاء (Whitelist)
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // جلب قائمة الإيميلات المسموحة وتحويلها لمصفوفة
    const allowedEmails = process.env.ALLOWED_ADMINS ? process.env.ALLOWED_ADMINS.split(',') : [];
    
    // التحقق إذا كان الإيميل مسموحاً له أم لا
    if (!allowedEmails.includes(email.trim().toLowerCase())) {
      return res.status(403).json({ message: 'Access Denied: This email is not authorized to register as Admin.' });
    }

    // التحقق من عدم تكرار الحساب
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists.' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء الأدمن الجديد
    const newAdmin = new Admin({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// 2. تسجيل الدخول (Signin) وإصدار التوكن
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // إصدار التوكن الأمني وصلاحيته 24 ساعة
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: { username: admin.username, email: admin.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signin' });
  }
};