# Dynamic Shopping Website

A fully functional e-commerce web application built with HTML, CSS (Bootstrap 5 + Material Design), and JavaScript. This project uses LocalStorage as a database to simulate a real-world shopping experience with User and Admin roles.

## Project Structure
```text
/src
  /css
    - styles.css      # Custom styles and Material Design overrides
  /js
    - app.js          # Main application logic (Auth, CRUD, DOM)
  - index.html        # Home Page
  - register.html     # User Registration
  - login.html        # User/Admin Login
  - shop.html         # Product Listing
  - cart.html         # Shopping Cart
  - add-product.html  # Admin: Add new product
  - edit-product.html # Admin: Edit existing product
```

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Framework**: Bootstrap 5
- **Design**: Material Design (Custom CSS)
- **Database**: Browser LocalStorage

## Features
- **User Authentication**: Register and Login with email validation.
- **Admin Panel**: Special login (`admin@gmail.com` / `admin123`) to manage products.
- **Product Management**: Admin can Add, Edit, and Delete products.
- **Shopping Cart**: Users can add items, update quantities, and remove items.
- **Persistent Data**: All data is saved in LocalStorage, so it survives page reloads.

## How to Run
1.  Clone the repository or download the source code.
2.  Open `src/index.html` in any modern web browser.
3.  **To test Admin features**: Login with `admin@gmail.com` / `admin123`.
4.  **To test User features**: Register a new account and login.

## CRUD Functionality
- **Create**: Register users, Add products, Add to cart.
- **Read**: View products, View cart, Login.
- **Update**: Edit product details, Update cart quantity.
- **Delete**: Delete products, Remove from cart.

## Conclusion
This project demonstrates a complete frontend workflow with state management, providing a solid foundation for understanding web application architecture.
