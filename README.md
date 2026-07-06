<h1 align="center">🚖 Uber Clone - Microservices Architecture 🚖</h1>

<p align="center">
  <strong>A full-stack, highly scalable ride-hailing platform built with a robust Microservices Architecture, real-time WebSocket communication, and an ultra-modern UI.</strong>
</p>

---

## ✨ Highlights

- **🧩 Microservices Architecture**: Decoupled backend services (`User`, `Captain`, `Ride`, `Gateway`) for ultimate scalability and maintainability.
- **📍 Real-Time Live Tracking**: Seamless real-time location sharing between riders and drivers using `Socket.io`.
- **🗺️ Interactive Maps & Routing**: Powered by `MapLibre` and `OpenRouteService` for precise geocoding, route drawing, and distance/time estimations.
- **🎨 Ultra-Modern UI/UX**: Built with React, Tailwind CSS, and buttery-smooth `GSAP` animations for a premium app-like feel.
- **🔐 Secure Authentication**: JWT-based authentication for both Users (Riders) and Captains (Drivers).
- **💸 Dynamic Fare Calculation**: Intelligent pricing based on distance, time, and vehicle type (Car, Auto, Moto).
- **🚗 Ride Matching Engine**: Automatically broadcasts ride requests to nearby available captains within a specific radius.
- **📱 Responsive Design**: Fully optimized for mobile and desktop screens.
- **🚀 Centralized API Gateway**: Single entry point for all client requests, routing them securely to the appropriate microservice.

---

## 🏗️ System Architecture

Our backend is split into independently deployable microservices:

1. **`Gateway Service`**: The entry point. Handles WebSockets, routes HTTP traffic to internal services, and manages real-time events.
2. **`User Service`**: Manages rider accounts, authentication, and profile data.
3. **`Captain Service`**: Manages driver accounts, vehicle details, availability status, and location tracking.
4. **`Ride Service`**: The core engine. Handles fare calculation, route estimations (via ORS), ride creation, and ride state management (Started, Completed).

---

## 🧪 Environment Variables (`.env`) Setup

Create a `.env` file in **each** microservice directory (`backend/user`, `backend/captain`, `backend/ride`, `backend/gateway`) as well as the `frontend`. 

### Backend (Microservices)
You will need a `.env` for each service. Common variables include:

```bash
PORT=8000 # (Use different ports for each service: 8005, 8008, 8022, etc.)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
BASE_URL=http://localhost:8000 # Pointing to the Gateway or other services

# Required in the Ride Service for Maps:
ORS_API_KEY=your_openrouteservice_api_key
```

### Frontend (`/frontend`)

```bash
# Point this to your Gateway Service URL
VITE_BASE_URL=http://localhost:8000
```

---

## 🚀 How to Run the Project Locally

Because this project uses a Microservices architecture, you will need to run the frontend and **all** backend services simultaneously.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/uber-microservices.git
cd uber-microservices
```

### 2. Start the Backend Microservices

You will need to open a separate terminal for **each** service.

**Terminal 1: API Gateway**
```bash
cd backend/gateway
npm install
npx nodemon
```

**Terminal 2: User Service**
```bash
cd backend/user
npm install
npx nodemon
```

**Terminal 3: Captain Service**
```bash
cd backend/captain
npm install
npx nodemon
```

**Terminal 4: Ride Service**
```bash
cd backend/ride
npm install
npx nodemon
```


### 3. Start the Frontend Application

Open one final terminal for the React application:

**Terminal 5: Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will now be running at `http://localhost:5173`. Open it in your browser and start booking rides! 🎉

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, GSAP, MapLibre GL JS, Axios, Context API
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB, Mongoose
- **External APIs**: OpenRouteService (Geocoding & Directions)
- **Architecture**: Microservices, RESTful APIs, Event-driven WebSockets

---

<p align="center">
  <i>Built with passion and ❤️</i>
</p>
