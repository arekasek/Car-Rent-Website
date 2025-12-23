# Import Path Migration Guide

## Quick Reference: Old vs New Import Paths

### Layout Components

```javascript
// ❌ OLD
import Navbar from "@/app/Navbar";
import Sidebar from "@/app/Sidebar";
import HamburgerMenu from "@/app/Ham-menu";

// ✅ NEW
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import HamburgerMenu from "@/components/layout/Ham-menu";
```

### Auth Components

```javascript
// ❌ OLD
import LoginCard from "@/app/components/LoginCard";
import SignupCard from "@/app/components/SignupCard";

// ✅ NEW
import LoginCard from "@/components/auth/LoginCard";
import SignupCard from "@/components/auth/SignupCard";
```

### Car Components

```javascript
// ❌ OLD
import CarInfoCard from "@/app/components/CarInfoCard";
import FilterContainer from "@/app/components/FilterContainer";
import SortingBar from "@/app/components/SortingBar";

// ✅ NEW
import CarInfoCard from "@/components/car/CarInfoCard";
import FilterContainer from "@/components/car/FilterContainer";
import SortingBar from "@/components/car/SortingBar";
```

### Booking Components

```javascript
// ❌ OLD
import DateRangeCalendar from "@/app/components/DateRangeCalendar";
import ShoppingCartModal from "@/app/components/ShoppingCartModal";

// ✅ NEW
import DateRangeCalendar from "@/components/booking/DateRangeCalendar";
import ShoppingCartModal from "@/components/booking/ShoppingCartModal";
```

### Common Components

```javascript
// ❌ OLD
import Carousel from "@/app/Carousel";
import AdminDashboard from "@/app/components/AdminDashboard";

// ✅ NEW
import Carousel from "@/components/common/Carousel";
import AdminDashboard from "@/components/common/AdminDashboard";
```

### Styles

```javascript
// ❌ OLD
import "./fonts/vibes-font.css";
import "./fonts/thunder-font.css";

// ✅ NEW
import "@/styles/vibes-font.css";
import "@/styles/thunder-font.css";
```

---

## Files to Update

### Pages That Need Import Updates:

1. **src/app/page.js** - Homepage (uses Carousel, Navbar)
2. **src/app/login/page.js** - Login page (uses LoginCard)
3. **src/app/signup/page.js** - Signup page (uses SignupCard)
4. **src/app/offer/page.js** - Cars listing (uses CarInfoCard, FilterContainer, SortingBar)
5. **src/app/admin/page.js** - Admin dashboard (uses AdminDashboard)
6. **src/app/car/[id]/page.js** - Car details page

### Layout Files:

1. **src/app/layout.js** - Main layout (uses Navbar, Sidebar)

---

## Step-by-Step Migration

### 1. Update `src/app/layout.js`

```javascript
// Replace these imports:
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// With these:
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

// Update styles import:
// import "./fonts/vibes-font.css";  ❌ Delete this
// import "./fonts/thunder-font.css";  ❌ Delete this
// import "./fonts/menu-font.css";  ❌ Delete this

import "@/styles/vibes-font.css";
import "@/styles/thunder-font.css";
// Keep menu-font.css if needed
```

### 2. Update `src/app/page.js` (Homepage)

```javascript
// Replace:
// import Carousel from "./Carousel";

// With:
import Carousel from "@/components/common/Carousel";
```

### 3. Update `src/app/login/page.js`

```javascript
// Replace:
// import LoginCard from "@/app/components/LoginCard";

// With:
import LoginCard from "@/components/auth/LoginCard";
```

### 4. Update `src/app/signup/page.js`

```javascript
// Replace:
// import SignupCard from "@/app/components/SignupCard";

// With:
import SignupCard from "@/components/auth/SignupCard";
```

### 5. Update `src/app/offer/page.js`

```javascript
// Replace all these:
// import CarInfoCard from "@/app/components/CarInfoCard";
// import FilterContainer from "@/app/components/FilterContainer";
// import SortingBar from "@/app/components/SortingBar";

// With these:
import CarInfoCard from "@/components/car/CarInfoCard";
import FilterContainer from "@/components/car/FilterContainer";
import SortingBar from "@/components/car/SortingBar";
import DateRangeCalendar from "@/components/booking/DateRangeCalendar";
```

### 6. Update `src/app/admin/page.js`

```javascript
// Replace:
// import AdminDashboard from "@/app/components/AdminDashboard";

// With:
import AdminDashboard from "@/components/common/AdminDashboard";
```

---

## Important Notes

### About Navbar

The `Navbar.js` file in the new location has been updated to use the correct import for `ShoppingCartModal`:

```javascript
// The Navbar now imports from:
import ShoppingCartModal from "@/components/booking/ShoppingCartModal";
```

### About Carousel

The `Carousel.js` file in the new location has been updated to use the correct style imports:

```javascript
// The Carousel now imports from:
import "@/styles/vibes-font.css";
import "@/styles/thunder-font.css";
```

### Context Files

Context files remain in the same location:

```javascript
// These paths don't change:
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
```

### Library Functions

Library functions remain in the same location:

```javascript
// These paths don't change:
import { fetchCars } from "@/lib/fetchCars";
import /* utils */ "@/lib/utils";
```

---

## Quick Find & Replace (VS Code)

### Find & Replace all in one go:

1. **Navbar/Sidebar/Ham-menu**

   - Find: `from "@/app/(Navbar|Sidebar|Ham-menu)`
   - Replace: `from "@/components/layout/$1`

2. **Auth Cards**

   - Find: `from "@/app/components/(LoginCard|SignupCard)`
   - Replace: `from "@/components/auth/$1`

3. **Car Components**

   - Find: `from "@/app/components/(CarInfoCard|FilterContainer|SortingBar)`
   - Replace: `from "@/components/car/$1`

4. **Booking Components**
   - Find: `from "@/app/components/(DateRangeCalendar|ShoppingCartModal)`
   - Replace: `from "@/components/booking/$1`

---

## Testing the Migration

After updating all imports:

1. Run `npm run dev` or your dev server
2. Check browser console for any import errors
3. Test each page:
   - Home page (carousel)
   - Login page (LoginCard)
   - Signup page (SignupCard)
   - Offer/Browse page (cars, filters, sorting)
   - Admin page (dashboard)
   - Navbar navigation

---

## Need Help?

If you encounter import errors:

1. Check the exact file path in the new structure
2. Ensure you're using `@/` alias correctly
3. Verify `jsconfig.json` has the correct path alias
4. Use VS Code's "Go to File" (Ctrl+P) to find the exact location

---

**Last Updated**: December 19, 2025
