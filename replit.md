# متجر الكترو - Electro Store

موقع تجارة إلكترونية لبيع الأجهزة الكهربائية المنزلية.

## Stack
- **Backend**: Express.js (Node.js) — port 3001
- **Frontend**: React + Vite — port 5000
- **Database**: SQLite (better-sqlite3) — `store.db`
- **Auth**: express-session + bcryptjs

## How to Run
```
npm install
npm run dev
```
This starts both the API server (port 3001) and the Vite dev server (port 5000) using `concurrently`.

## Project Structure
```
├── server/
│   ├── index.js          # Express app entry
│   ├── database.js       # SQLite setup + seeding
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       └── categories.js
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/   (Navbar, Footer, ProductCard, CategoryCard, Toast)
│       └── pages/        (Home, Products, ProductDetail, Admin, Login)
├── public/uploads/       # Uploaded images
└── store.db              # SQLite database (auto-created)
```

## Admin Account
- Username: `admin`
- Password: `admin123`
- Access: `/#/admin`

## Colors / Design
- Primary Blue: #1565C0
- Dark Blue: #0D47A1
- Accent Orange: #FF6F00
- Background: #F5F7FA

## User Preferences
- Arabic RTL interface
- Iraqi Dinar (د.ع) as currency
- Cairo font (Google Fonts)
