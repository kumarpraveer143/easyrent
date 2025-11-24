# EasyRent - Smart Rental Management System

EasyRent is a comprehensive web application designed to bridge the gap between landowners and renters. It simplifies the rental process by providing a platform for landowners to list properties, manage tenants, and track payments, while allowing renters to find their ideal home, manage their rental status, and view payment history. The application features real-time notifications to keep all parties updated instantly.

## 🚀 Features

### 🔐 User Authentication & Security
- **Secure Sign Up & Login:** Dedicated portals for Landowners and Renters.
- **Role-Based Access Control:** Distinct features and dashboards for different user types.
- **JWT Authentication:** Secure session management using JSON Web Tokens.
- **Password Management:** Secure password hashing and reset functionality.

### 🏠 For Landowners
- **Property Management:** Easily upload and update room details including photos, amenities, rent price, and location.
- **Request Management:** Receive real-time rental requests from potential tenants.
- **Tenant Onboarding:** Accept or reject rental requests with a single click.
- **Active Tenant Oversight:** Manage currently active renters and view their details.
- **Financial Tracking:** Add rent records and view comprehensive payment history.
- **Archives:** Access history of past tenants (Archived Renters).
- **Dashboard:** A centralized hub for an overview of all properties and activities.

### 🔍 For Renters
- **Smart Search:** Find rooms based on preferences like location, price, and type.
- **Detailed Listings:** View comprehensive room information before making a decision.
- **Easy Booking:** Send rental requests directly to landowners.
- **My Room:** Access details of the currently rented property.
- **Payment History:** Keep track of all rent payments made.
- **Favorites:** Save interesting rooms to a wishlist for later viewing.

### ⚡ Real-Time Features
- **Instant Notifications:** Powered by **Socket.io**, users receive immediate alerts for:
  - New rental requests (for Landowners).
  - Request acceptance or rejection (for Renters).
  - Request withdrawals (for Landowners).
  - **Payment Confirmations:** Landowners get notified when a renter completes a payment.
- **Smart Automation:**
  - **Auto-Rejection:** When a room is accepted, all other pending requests for that room are automatically rejected, and applicants are notified instantly.
- **Dynamic Updates:**
  - **Request Counters:** Real-time view of how many people are interested in a specific property directly on the dashboard.

## 🧠 Challenges & Solutions

### 1. Real-Time State Synchronization
**Challenge:** Ensuring that when a room is booked, it immediately appears unavailable to other users to prevent double-booking, and all involved parties are notified.
**Solution:** Implemented a robust **Socket.io** architecture that broadcasts state changes instantly. When a request is accepted, the server triggers events to update the landowner's dashboard and notify all affected renters simultaneously.

### 2. Complex Relationship Lifecycle
**Challenge:** Managing the transition of a user from a "Guest" to "Applicant" to "Tenant" and finally to "Archived Tenant" without losing data history.
**Solution:** Designed a flexible database schema with distinct collections for `Requests`, `Relationships` (Active), and `History`. Transition logic ensures data is securely moved and linked, preserving the entire rental history for both parties.

### 3. Concurrency Control
**Challenge:** Handling scenarios where multiple users request the same room at the same time.
**Solution:** Implemented atomic database operations and backend validation checks. Before accepting a request, the system re-verifies the room's availability and the validity of the request to prevent race conditions.

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite):** Fast and modern UI library.
- **Tailwind CSS:** Utility-first CSS framework for beautiful, responsive designs.
- **React Router DOM:** For seamless client-side navigation.
- **Axios:** For efficient HTTP requests.
- **Socket.io-client:** For handling real-time events.
- **React Toastify:** For elegant user notifications.
- **React Icons:** For a clean and consistent icon set.

### Backend
- **Node.js:** Robust JavaScript runtime environment.
- **Express.js:** Minimalist web framework for Node.js.
- **MongoDB (Mongoose):** NoSQL database for flexible data storage.
- **Socket.io:** Real-time, bidirectional event-based communication.
- **JWT (JSON Web Tokens):** For secure stateless authentication.
- **Bcrypt:** For password hashing and security.

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js installed on your machine.
- MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone https://github.com/kumarpraveer143/easyrent.git
cd easyrent
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGODB=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

Start the backend server:

```bash
npm run go
# or
npm start
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

```bash
npm run dev
```

## 📱 Usage

1.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).
2.  **Sign Up** as a Landowner to list rooms or as a Renter to find rooms.
3.  **Landowners** can go to the dashboard to upload rooms.
4.  **Renters** can browse "Find Rooms" and send requests.
5.  Check the **Notification Bell** in the navbar for updates!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built with ❤️ by Praveer Kumar*
