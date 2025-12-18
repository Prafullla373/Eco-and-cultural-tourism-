# Jharkhand Eco-Cultural Tourism Platform

A comprehensive tourism management system for Jharkhand featuring eco-tourism sites, cultural heritage locations, hotels, packages, and events.

## Quick Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

**Backend:**
```bash
cd backend
npm install
# Create .env file (see PROJECT_SETUP_GUIDE.md for details)
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access
- **Website:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login

## Features

### User Features
- Browse eco and cultural tourism spots
- View travel packages and upcoming events
- Book hotels
- Save favorites and view history
- Local guide information

### Admin Features
- Manage Hotels, Packages, Events, Locations
- User and Admin Management
- Content Approval System
- **Report Generation (CSV & PDF)**
  - Download reports with filters
  - Date range selection
  - Status-based filtering

## Documentation

For detailed setup instructions for sharing with others, see [PROJECT_SETUP_GUIDE.md](./.gemini/antigravity/brain/39c47633-0beb-4cc1-a9b5-cd92cdcca21b/PROJECT_SETUP_GUIDE.md)

## Tech Stack

**Backend:**
- Node.js, Express
- MongoDB with Mongoose
- JWT Authentication
- PDFKit & JSON2CSV for reports

**Frontend:**
- React + Vite
- React Router
- Axios
- Chart.js
- TailwindCSS

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── api/
    └── package.json
```

## License

MIT
