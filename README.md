Mary's Cake & Catering Service
مشروع متكامل (Full-Stack) لمنصة تجارة إلكترونية متخصصة في بيع الحلويات وخدمات الضيافة، مبني باستخدام تقنيات الـ MERN Stack.
(Features)
واجهة مستخدم ثنائية اللغة: دعم كامل للغتين الإنجليزية والإسبانية باستخدام react-i18next.

نظام تسوق متكامل: إمكانية إضافة المنتجات للسلة، تعديل الكميات، وحساب المجموع تلقائياً.

لوحة تحكم للمسؤول (Admin Dashboard): واجهة مخصصة لإدارة المنتجات واستلام الطلبات.

تصميم متجاوب: واجهة عصرية وسريعة باستخدام Tailwind CSS تعمل بكفاءة على جميع أحجام الشاشات.

إدارة الطلبات: نظام للتحقق من بيانات العميل (Validation) وإرسال الطلبات للـ Backend.

(Tech Stack)
Frontend: React.js, Tailwind CSS, Lucide Icons.
Backend: Node.js, Express.js.
State Management: React Context API.
Internationalization: i18next.

(Project Structure)
تم تنظيم المشروع لفصل الواجهة عن الخادم بشكل احترافي:

Plaintext
├── Backend/          # خادم Express وربط قاعدة البيانات
│   ├── controllers/  # منطق التحكم في البيانات
│   ├── models/       # مخططات قاعدة البيانات (Schemas)
│   └── routes/       # مسارات الـ API
├── Frontend/         
│   ├── admin-frontend/  # لوحة تحكم الإدارة
│   └── user-frontend/   # متجر المستخدمين
تشغيل المشروع محلياً
للمعاينة على جهازك، اتبعي الخطوات التالية:

1. الـ Backend
Bash
cd Backend/backend
npm install
npm start
تأكدي من إعداد ملف .env وربطه بقاعدة البيانات الخاصة بكِ.

2. الـ Frontend
Bash
cd Frontend/user-frontend
npm install
npm run dev
