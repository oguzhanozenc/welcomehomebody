# Homebody – Retro E-commerce Platform

Homebody is a fully responsive, retro-styled e-commerce platform that merges vintage arcade aesthetics with modern web technologies. Designed to reflect "homebody" culture, it offers a complete online shopping experience with secure checkout, user authentication, persistent cart functionality, and a built-in blog system for brand storytelling.

## Live Demo

> **[View Live Site](https://welcomehomebody.com)**

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Journey](#user-journey)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Challenges & Solutions](#challenges--solutions)
- [License](#license)

---

## Features

- ✨ Retro-themed UI mimicking classic OS windows and arcade aesthetics
- 🌐 Responsive layout optimized for desktop and mobile
- 🛒 Real-time cart updates with persistent state (Redux + localStorage/sessionStorage)
- 📅 Customer authentication: login, signup, logout, and password recovery
- 🏋️ Account dashboard showing order history and saved information
- ✔️ Seamless Shopify checkout integration via GraphQL
- 📝 Integrated blog system with featured posts, social share, and post reader
- 🎨 CSS-driven retro animations and hover effects

---

## Tech Stack

- **React + Redux** for UI logic and state management
- **React Router** for seamless page transitions
- **Shopify Storefront API (GraphQL)** for dynamic product, checkout, and user data
- **Redux Middleware + localStorage/sessionStorage** for cart and session persistence
- **Custom CSS** for arcade/90s-inspired visuals
- **GraphQL Request** for efficient API communication
- **Netlify** for hosting and deployment

---

## User Journey

The Homebody experience begins on the **Home Page**, where users are welcomed with a nostalgic arcade aesthetic and interactive visuals. Navigation leads to a **Product List** page where items are organized by Shopify tags and filterable by category. Users enjoy a seamless experience aided by the floating **Order Navbar**, which provides quick access to the cart and controls. At checkout, a **Review Page** summarizes their items with a confirmation dialog before redirecting to Shopify for secure payment. The journey is enriched by the **Blog Section**, which offers styled post previews, detailed articles, social sharing, and a subscription prompt to build brand engagement.

---

## Installation

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/homebody.git
cd homebody
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file with:
```
VITE_SHOPIFY_DOMAIN=your-shopify-store.myshopify.com
VITE_SHOPIFY_ACCESS_TOKEN=your-storefront-access-token
```

4. **Run the development server**
```bash
npm run dev
```

---

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Create production build
npm run preview     # Preview production build locally
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components (Navbar, ProductCard, BlogPost, etc.)
├── actions/             # Redux actions (auth, cart, products)
├── reducers/            # Redux reducers for auth, cart, products
├── middleware/          # Cart persistence logic
├── styles/              # Custom CSS files for each section
├── pages/               # Major views (Home, ProductList, Checkout, Blog, etc.)
├── App.jsx              # Main app with routes
└── store.js             # Redux store setup with middleware
```

---

## Challenges & Solutions

### Smooth Navigation Without Reloads
**Challenge:** Enabling fast, seamless page transitions across product, blog, and checkout pages.
**Solution:** Integrated **React Router** for client-side routing, preserving context and improving UX.

### Real-Time Product Management
**Challenge:** Syncing live inventory, orders, and prices with a secure and scalable backend.
**Solution:** Leveraged **Shopify Storefront API** to manage all product and checkout logic dynamically via GraphQL.

### Session and Cart Persistence
**Challenge:** Keeping user carts consistent across tabs and sessions.
**Solution:** Combined **Redux** with **localStorage** and **sessionStorage**, and implemented a **custom middleware** to persist and sync cart state.

### Authentication Flow
**Challenge:** Creating secure signup/login/recovery flows.
**Solution:** Used **Shopify's customer APIs** with Redux, form validation, and token management in localStorage.

### Retro UI Without Sacrificing UX
**Challenge:** Balancing a nostalgic, arcade look with modern usability standards.
**Solution:** Built custom CSS animations, responsive layouts, and semantic HTML to ensure accessibility and cross-device consistency.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Developed by [Oguzhan Ozenc](https://oguzhanozenc.me)  
✉️ homebodybiz24@gmail.com  
For inquiries, feedback, or collaboration ideas, feel free to [reach out](https://oguzhanozenc.me/contact)
