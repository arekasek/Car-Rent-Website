# Project Structure Documentation

## Overview

This document outlines the professional folder structure for the Car Rent application, organized for scalability, maintainability, and clear separation of concerns.

---

## 🗂️ Frontend Structure (`Car-Rent-Website/src/`)

### Directory Organization

```
src/
├── app/                          # Next.js App Router (Pages)
│   ├── admin/
│   ├── car/
│   ├── login/
│   ├── signup/
│   ├── offer/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── providers.js
│
├── components/                   # Reusable React Components (Organized by Feature)
│   ├── layout/                   # Layout Components
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── Ham-menu.js
│   │
│   ├── auth/                     # Authentication Components
│   │   ├── LoginCard.js
│   │   └── SignupCard.js
│   │
│   ├── car/                      # Car Display & Filtering
│   │   ├── CarInfoCard.js
│   │   ├── FilterContainer.js
│   │   └── SortingBar.js
│   │
│   ├── booking/                  # Booking & Cart Components
│   │   ├── DateRangeCalendar.js
│   │   └── ShoppingCartModal.js
│   │
│   ├── common/                   # Common/Shared Components
│   │   ├── Carousel.js
│   │   └── AdminDashboard.js
│   │
│   └── ui/                       # UI Primitives (checkboxes, buttons, etc.)
│       └── checkbox.jsx
│
├── context/                      # React Context (State Management)
│   ├── AuthContext.js
│   └── CartContext.js
│
├── lib/                          # Utility Functions & Helpers
│   ├── fetchCars.js
│   └── utils.js
│
├── styles/                       # Global Styles & Fonts
│   ├── vibes-font.css
│   └── thunder-font.css
│
└── hooks/                        # Custom React Hooks (Expandable)
    └── [Future custom hooks]
```

---

## 📁 Component Categories

### **Layout Components** (`src/components/layout/`)

Components responsible for page structure and navigation:

- **Navbar.js** - Main navigation bar with logo, menu, and cart/login buttons
- **Sidebar.js** - Social media links sidebar
- **Ham-menu.js** - Hamburger menu for mobile navigation

### **Authentication Components** (`src/components/auth/`)

User authentication related components:

- **LoginCard.js** - Login form with validation
- **SignupCard.js** - Registration form with validation

### **Car Components** (`src/components/car/`)

Car browsing and filtering:

- **CarInfoCard.js** - Individual car display card with specs
- **FilterContainer.js** - Filtering by fuel, chassis, transmission, seats
- **SortingBar.js** - Sort options (price, brand, seats)

### **Booking Components** (`src/components/booking/`)

Reservation and checkout features:

- **DateRangeCalendar.js** - Date selection calendar for rentals
- **ShoppingCartModal.js** - Shopping cart management modal

### **Common Components** (`src/components/common/`)

Widely used components across the app:

- **Carousel.js** - Featured cars carousel on homepage
- **AdminDashboard.js** - Admin panel for car management

### **UI Components** (`src/components/ui/`)

Reusable UI primitives:

- **checkbox.jsx** - Custom checkbox component

---

## 📦 Backend Structure (`backend/`)

```
backend/
├── server.js                 # Express server entry point
├── package.json              # Dependencies
├── config/
│   └── supabase.js           # Supabase database configuration
├── routes/                   # API Routes
│   ├── auth.js               # Authentication endpoints
│   ├── bookings.js           # Booking management
│   ├── cars.js               # Car CRUD operations
│   └── payments.js           # Payment processing
├── controllers/              # Business Logic (Expandable)
│   └── [Future controllers]
├── middleware/               # Express Middleware (Expandable)
│   └── [Future middleware]
├── models/                   # Data Models (Expandable)
│   └── [Future models]
├── utils/                    # Helper Functions (Expandable)
│   └── [Future utilities]
├── migrations/               # Database Migrations
│   └── add-admin-role.sql
└── sample-bookings.sql       # Sample data for testing
```

---

## 🎯 Naming Conventions

### Files

- **Components**: PascalCase (e.g., `LoginCard.js`, `CarInfoCard.js`)
- **Utilities/Functions**: camelCase (e.g., `fetchCars.js`, `utils.js`)
- **Styles**: kebab-case (e.g., `vibes-font.css`)

### Folders

- **Features**: lowercase (e.g., `auth`, `booking`, `car`)
- **Groupings**: lowercase (e.g., `components`, `context`, `lib`)

---

## 📍 Import Paths

### Using Path Aliases (Configured in `jsconfig.json`)

```javascript
// ❌ Before (Relative imports - Hard to maintain)
import LoginCard from "../../../../components/auth/LoginCard.js";

// ✅ After (Alias imports - Clean & maintainable)
import LoginCard from "@/components/auth/LoginCard.js";
import { useAuth } from "@/app/context/AuthContext.js";
import { fetchCars } from "@/lib/fetchCars.js";
```

**Configured aliases in `jsconfig.json`:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🔄 Folder Organization Benefits

1. **Scalability** - Easy to add new features in their own directories
2. **Maintainability** - Clear where components belong
3. **Team Collaboration** - Developers quickly understand the structure
4. **Code Reusability** - Shared components in dedicated folders
5. **Testing** - Components grouped by feature are easier to test
6. **Performance** - Better code splitting opportunities

---

## 📝 Adding New Features

### For a new feature (e.g., "Reviews"):

```
src/components/reviews/
├── ReviewCard.js
├── ReviewForm.js
├── ReviewList.js
└── ReviewRating.js

src/context/ReviewContext.js
src/lib/reviewUtils.js
```

### For new routes:

```
backend/routes/reviews.js
backend/controllers/reviewController.js (if needed)
```

---

## 🚀 Next Steps

1. **Update all import paths** in existing files to use new locations
2. **Remove old/duplicate files** from original locations
3. **Test all components** to ensure no import breaks
4. **Update CI/CD** if any build processes reference old paths
5. **Document API endpoints** in backend routes
6. **Add TypeScript** (optional) for better type safety

---

## 📚 Quick Reference

| What                 | Where                  |
| -------------------- | ---------------------- |
| Add a UI Component   | `src/components/ui/`   |
| Add Auth Logic       | `src/components/auth/` |
| Add Utility Function | `src/lib/`             |
| Add Custom Hook      | `src/hooks/`           |
| Add State Management | `src/context/`         |
| Add Global Styles    | `src/styles/`          |
| Add API Route        | `backend/routes/`      |
| Add Business Logic   | `backend/controllers/` |

---

## ✅ Structure Checklist

- [x] Layout components organized
- [x] Auth components grouped
- [x] Car/shopping components separated by feature
- [x] Context files organized
- [x] Utility functions in lib/
- [x] Styles consolidated
- [x] Backend organized by feature
- [x] Path aliases configured
- [x] Documentation created

---

**Created**: December 19, 2025  
**Project**: Car Rent Application  
**Status**: Professional Structure Implemented ✅
