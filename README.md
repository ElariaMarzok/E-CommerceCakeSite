 Mary's Cake - MERN-Stack E-commerce Platform

A professional MERN-stack e-commerce application tailored for a specialty cake and catering business. This project features a seamless user shopping experience, full multi-language support, and a robust admin dashboard for business management.

![Project Preview]()

 Key Features

Multi-Language Engine (I18n)
- **English & Español Support:** Integrated with `react-i18next` for high-quality translations.
- **Dynamic Localization:** Text and UI elements adapt instantly based on the user's selected language.

Customer Experience
- **Interactive Shopping Cart:** Users can add, remove, and update cake quantities with real-time total calculations.
- **Smart Checkout:** A comprehensive order form with validation to ensure accurate customer details (Name, Phone, Address).
- **Responsive Navbar:** A sleek navigation bar that optimizes itself for mobile, tablet, and desktop views (hidden translation buttons on mobile for better UX).

 Admin Dashboard
- **Product Management:** Full CRUD operations (Create, Read, Update, Delete) for the cake inventory.
- **Auto-Translation Tool:** Integrated logic that helps the admin translate product names and descriptions into Spanish automatically during entry.
- **Order Tracking:** A dedicated view to monitor and manage incoming customer orders.

Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Localization:** i18next.
- **Version Control:** Git & GitHub (Organized Folder Structure).

 Project Architecture

The project is structured into distinct modules for better scalability and maintenance:

```text
├── Backend/
│   ├── controllers/    # Request handling logic (Orders, Products)
│   ├── models/         # Database Schemas (Mongoose)
│   ├── routes/         # API Endpoint definitions
│   └── uploads/        # Local storage for product images
├── Frontend/
│   ├── admin-frontend/ # Management interface for the owner
│   └── user-frontend/  # Customer-facing storefront
